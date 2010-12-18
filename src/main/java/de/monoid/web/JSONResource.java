package de.monoid.web;

import java.net.URI;

import org.json.JSONException;
import org.json.JSONObject;

public class JSONResource extends AbstractResource {
	JSONObject json;
	
	@Override
	void setContent(Object aContent) {
		json = (JSONObject)aContent;
	}
	
	public JSONObject object() {
		return json;
	}
	
	/** Execute the given path query on the json and use the returned string as an URI
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server in JSON format
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public JSONResource json(JSONPathQuery path) throws Exception {
		Object jsonValue = path.eval(this);
		return json(jsonValue.toString());
	}

	/** Execute the given path query on the json and use the returned string as an URI
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server in text/plain format
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public PlainTextResource text(JSONPathQuery path) throws Exception {
		Object jsonValue = path.eval(this);
		return text(URI.create(jsonValue.toString()));
	}

	
	/** Gets the partial JSON object or attribute as specified in the path expression.*/
	public Object get(String path) throws Exception {
		return new JSONPathQuery(path).eval(this);
	}



	
}
