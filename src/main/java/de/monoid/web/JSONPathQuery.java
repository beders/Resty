package de.monoid.web;

import java.io.IOException;
import java.io.StringReader;


import de.monoid.json.JSONException;
import de.monoid.json.JSONObject;
import de.monoid.web.jp.javacc.JSONPathCompiler;
import de.monoid.web.jp.javacc.ParseException;

/** Create a path query for a JSON object. Usualy this is done by calling Resty.path(...)
 * 
 * A JSONPathQuery is similar to JsonPath or XPath in that you can create access paths into an JSON object.
 * It uses dot '.' as a path separator and [] to access arrays. 
 * The array index is either a number or an expression to evaluate for each object in the array. The first matching object is returned.
 * I.e. <p>
 * <code>store.book[price>7 && price<12.999].author</code>
 * <p>
 * In the example above the JSON object with a prive value between 7 and 12.999 is selected and the author returned.
 * Boolean expressions are supported with && (and), || (or), ! (not). Values can be compared with =,<,>.
 * 
 * 
 * @author beders
 *
 */
public class JSONPathQuery extends PathQuery<JSONResource, Object> {
	private JSONPathCompiler compiler;
	private String expr;
	
	public JSONPathQuery(String anExpression) {
		expr = anExpression;
	}
	
	@Override
	Object eval(JSONResource resource) throws JSONException, ParseException, IOException {
		JSONObject json = resource.object();
		Object result = getCompiler().expr().eval(json);
		return result;
	}

	protected JSONPathCompiler getCompiler() throws ParseException {
		if (null == compiler) {
			compiler = new JSONPathCompiler(new StringReader(expr));
		}
		return compiler;
	}
}
