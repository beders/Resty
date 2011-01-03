package de.monoid.web;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

import de.monoid.json.JSONException;
import de.monoid.json.JSONObject;
import de.monoid.json.JSONTokener;

public class JSONResource extends AbstractResource {
	JSONObject json;
	
	public JSONObject object() throws IOException, JSONException {
		if (json == null) {
			json = unmarshal();
		}
		return json;
	}
	
	/** Transforming the JSON on the fly */
	protected JSONObject unmarshal() throws IOException, JSONException {
		JSONObject json = new JSONObject(new JSONTokener(new InputStreamReader(inputStream, "UTF-8")));
		return json;
	}

	/** Execute the given path query on the json GET the returned URI expecting JSON
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
	
	/** Execute the given path query on the json and POST to the returned URI expecting JSON
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server in JSON format
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public JSONResource json(JSONPathQuery path, Content content) throws Exception {
		Object jsonValue = path.eval(this);
		return json(jsonValue.toString(), content);
	}

	/** Execute the given path query on the json and use the returned string as an URI expecting text/*
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server in text/plain format
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public TextResource text(JSONPathQuery path) throws Exception {
		Object jsonValue = path.eval(this);
		return text(URI.create(jsonValue.toString()));
	}

	/** Execute the given path query on the json and GET the returned URI expecting text/*
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server in JSON format
	 * @throws Exception 
	 */
	public XMLResource xml(JSONPathQuery path) throws Exception {
		Object jsonValue = path.eval(this);
		return xml(jsonValue.toString());
	}
	
	/** Execute the given path query on the json and POST to the returned URI expecting text/*
	 * 
	 * @param path path to the URI to follow
	 * @return a new resource, as a result of getting it from the server in JSON format
	 * @throws Exception 
	 */
	public XMLResource xml(JSONPathQuery path, Content content) throws Exception {
		Object jsonValue = path.eval(this);
		return xml(jsonValue.toString(), content);
	}
	
	/** Gets the partial JSON object or attribute as specified in the path expression.*/
	public Object get(String path) throws Exception {
		return new JSONPathQuery(path).eval(this);
	}

	@Override
	String getAcceptedTypes() {
		return "application/json";
	}

}
