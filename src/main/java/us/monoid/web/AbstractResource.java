/**
 * 
 */
package us.monoid.web;

import java.io.*;
import java.net.*;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.zip.GZIPInputStream;

/**
 * Abstract base class for all resource handlers you want to use with Resty.
 * 
 * It gives access to the underlying URLConnection and the current inputStream
 * 
 * @author beders
 * 
 */
public abstract class AbstractResource extends Resty {
	static final Logger log = Logger.getLogger(AbstractResource.class.getName()); 
	protected URLConnection urlConnection;
	protected InputStream inputStream;

	public AbstractResource(Option... options) {
		super(options);
	}

	protected abstract String getAcceptedTypes();

	void fill(URLConnection anUrlConnection) throws IOException {
		urlConnection = anUrlConnection;
		try {
			if ("gzip".equals(anUrlConnection.getContentEncoding())) {
				inputStream = new GZIPInputStream(anUrlConnection.getInputStream());
			}
			else {
				inputStream = anUrlConnection.getInputStream();
			}
		} catch (IOException e) {
			// Per http://docs.oracle.com/javase/1.5.0/docs/guide/net/http-keepalive.html
			// (comparable documentation exists for later java versions)
			// if an HttpURLConnection was used clear the errorStream and close it
			// so that keep alive can keep doing its work
			if (anUrlConnection instanceof HttpURLConnection) {
				HttpURLConnection conn = (HttpURLConnection) anUrlConnection;
				InputStream es;
				if ("gzip".equals(conn.getContentEncoding())) {
					es = new BufferedInputStream(new GZIPInputStream(conn.getErrorStream()));
				}
				else {
					es = new BufferedInputStream(conn.getErrorStream());
				}

				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				try {
					// read the response body
					byte[] buf = new byte[1024];
					int read = -1;
					while ((read = es.read(buf)) > 0) {
						baos.write(buf, 0, read);
					}
				} catch (IOException e1) {
					log.warning("IOException when reading the error stream. Ignored");
				}

				// close the errorstream
				es.close();

				inputStream = new ByteArrayInputStream(baos.toByteArray());

			} else {
				throw e;
			}
		}
	}

	public URLConnection getUrlConnection() {
		return urlConnection;
	}

	public HttpURLConnection http() {
		return (HttpURLConnection) urlConnection;
	}

	public InputStream stream() {
		return inputStream;
	}

	/**
	 * Check if the URLConnection has returned the specified responseCode
	 * 
	 * @param responseCode
	 * @return
	 */
	public boolean status(int responseCode) {
		if (urlConnection instanceof HttpURLConnection) {
			HttpURLConnection http = (HttpURLConnection) urlConnection;
			try {
				return http.getResponseCode() == responseCode;
			} catch (IOException e) {
				e.printStackTrace();
				return false;
			}
		} else
			return false;
	}

	/**
	 * Get the location header as URI. Returns null if there is no location header.
	 * 
	 */
	public URI location() {
		String loc = http().getHeaderField("Location");
		if (loc != null) {
			return URI.create(loc);
		}
		return null;
	}

	/** Print out the response headers for this resource.
	 * 
	 * @return
	 */
	public String printResponseHeaders() {
		StringBuilder sb = new StringBuilder();
		HttpURLConnection http = http();
		if (http != null) {
			Map<String, List<String>> header = http.getHeaderFields();
			for (String key : header.keySet()) {
				for (String val : header.get(key)) {
					sb.append(key).append(": ").append(val).append("\n");
				}
			}
		}
		return sb.toString();
	}
}
