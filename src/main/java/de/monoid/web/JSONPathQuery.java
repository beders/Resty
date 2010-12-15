package de.monoid.web;

import java.io.StringReader;

import org.json.JSONException;
import org.json.JSONObject;

import de.monoid.web.jp.javacc.JSONPathCompiler;
import de.monoid.web.jp.javacc.ParseException;

public class JSONPathQuery extends PathQuery<JSONResource> {
	private JSONPathCompiler compiler;
	private String expr;
	
	public JSONPathQuery(String anExpression) {
		expr = anExpression;
	}
	
	@Override
	Object eval(JSONResource resource) throws JSONException, ParseException {
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
