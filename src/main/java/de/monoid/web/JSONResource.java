package de.monoid.web;

import org.json.JSONException;
import org.json.JSONObject;

public class JSONResource extends Resty {
	JSONObject json;

	public JSONResource(JSONObject someJson) {
		json = someJson;
	}

	public JSONObject object() {
		return json;
	}
	
	/** Execute the given path query on the json and use the returned string as an URI
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public JSONResource json(JSONPathQuery path) throws Exception {
		Object jsonValue = path.eval(this);
		return json(jsonValue.toString());
	}

	/** Gets the partial JSON object or attribute as specified in the path expression.*/
	public Object get(String path) throws Exception {
		return new JSONPathQuery(path).eval(this);
	}
}
