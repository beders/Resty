/**
 * 
 */
package us.monoid.web;

import java.io.*;
import java.net.*;

/**
 * Abstract base class for all resource handlers you want to use with Resty.
 * 
 * It gives access to the underlying URLConnection and the current inputStream
 *
 * @author beders
 * 
 */
public abstract class AbstractResource extends Resty {
	protected URLConnection urlConnection;
	protected InputStream inputStream;

	public AbstractResource(Option... options) {
		super(options);
	}

	abstract String getAcceptedTypes();
	
	void fill(URLConnection anUrlConnection) throws IOException {
		urlConnection = anUrlConnection;
		try{
			inputStream = anUrlConnection.getInputStream();
		} catch (IOException e){
			// Per http://docs.oracle.com/javase/1.5.0/docs/guide/net/http-keepalive.html
			// (comparable documentation exists for later java versions)
			// if an HttpURLConnection was used clear the errorStream and close it
			// so that keep alive can keep doing its work
			if(anUrlConnection instanceof HttpURLConnection){
				HttpURLConnection conn = (HttpURLConnection)anUrlConnection;
				InputStream es = new BufferedInputStream(conn.getErrorStream());

				ByteArrayOutputStream baos = new ByteArrayOutputStream();

				// read the response body
				int read;
				while ((read = es.read()) != -1) {
					baos.write(read);
				}

				// close the errorstream
				es.close();

				throw new IOException(
					"Error while reading from " + conn.getRequestMethod()  + ": [" + conn.getResponseCode() + "] " + 
					conn.getResponseMessage() + "\n" + new String(baos.toByteArray(), "UTF-8"), e
				);
			} else {
				throw e;
			}
		}
	}

	public URLConnection getUrlConnection() {
		return urlConnection;
	}

	public HttpURLConnection http() {
		return (HttpURLConnection)urlConnection;
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

	/** Get the location header as URI. Returns null if there is no location header.
	 * 
	 */
	public URI location() {
		String loc = http().getHeaderField("Location");
		if (loc != null) {
				return URI.create(loc);
		}
		return null;
	}
}
