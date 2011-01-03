/**
 * 
 */
package de.monoid.web;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URLConnection;

/**
 * Abstract base class for all resource handlers you want to use with Resty.
 * Resource handlers aka content handlers hold the content returned from a
 * URLConnection
 * 
 * @author beders
 * 
 */
public abstract class AbstractResource extends Resty {
	protected URLConnection urlConnection;
	protected InputStream inputStream;

	abstract String getAcceptedTypes();
	
	void fill(URLConnection anUrlConnection) throws IOException {
		urlConnection = anUrlConnection;
		inputStream = anUrlConnection.getInputStream();
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

}
