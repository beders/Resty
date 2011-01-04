package us.monoid.web;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;

import us.monoid.json.JSONException;
import us.monoid.json.JSONObject;
import us.monoid.json.JSONTokener;


/** A resource presentation in JSON format.
 * You can  ask Resty to parse the JSON into a JSONObject, which is similar to the org.json.JSONObject and allows full access to the JSON.
 * You can also access the JSON with a JSONPathQuery to extract only the parts you are interested in.
 * @author beders
 *
 */
public class JSONResource extends AbstractResource {
	JSONObject json;
	
	/** 
	 * Parse and return JSON object. Parsing is done only once after which the inputStrem is at EOF.
	 * @return the JSON object
	 * @throws IOException
	 * @throws JSONException
	 */
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
	
	/** Gets the partial JSON object or attribute as specified in the path expression.*/
	public Object get(JSONPathQuery aQuery) throws Exception {
		return aQuery.eval(this);
	}

	@Override
	String getAcceptedTypes() {
		return "application/json";
	}

}
