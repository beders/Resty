package de.monoid.web.content.handler.application;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ContentHandler;
import java.net.URLConnection;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;


/** This is a ContentHandler to be used by Java's URLConnection for application/json
 * 
 * @author beders
 */
public class json extends ContentHandler {

	@Override
	public Object getContent(URLConnection urlc) throws IOException {
		try {
			InputStream inputStream = urlc.getInputStream();
			JSONObject json = new JSONObject(new JSONTokener(new InputStreamReader(inputStream, "UTF-8")));
			return json;
		} catch (JSONException e) {
			throw new IOException("No valid JSON", e);
		}
	}

}
