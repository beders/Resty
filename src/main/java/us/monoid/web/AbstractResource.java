/**
 * 
 */
package us.monoid.web;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URLConnection;

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
				InputStream es = ((HttpURLConnection)anUrlConnection).getErrorStream();
				// read the response body
				byte[] buf = new byte[1024];
				while (es.read(buf) > 0);
				// close the errorstream
				es.close();
			}
			throw e;
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
