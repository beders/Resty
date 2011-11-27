package us.monoid.web.jp.javacc;

import us.monoid.json.JSONException;
import us.monoid.json.JSONObject;
import us.monoid.web.jp.javacc.JSONPathCompiler.JSONPathExpr;

public class Predicates {
	public interface Test {
		boolean test(JSONObject json) throws JSONException;
	}

	static class Operator implements Test {
		JSONPathExpr expr;
		char ops;
		Comparable value;

		Operator(JSONPathExpr aSubExpr, String anOperator, Comparable aValue) {
			expr = aSubExpr;
			ops = anOperator.charAt(0);
			value = aValue;
		}

		public boolean test(JSONObject json) throws JSONException {
			Comparable val = (Comparable) expr.eval(json);
			if (val instanceof Number) { // fix comparison between Integers and Doubles by making sure the extracted value is a double
				val = ((Number)val).doubleValue();
			}
			int comparisonResult = val.compareTo(value);
			switch (ops) {
			case '>':
				return comparisonResult > 0;
			case '=':
				return comparisonResult == 0;
			case '<':
				return comparisonResult < 0;
			}
			return false;
		}

	}
	
	static class Existence implements Test {
		
		@Override
		public boolean test(JSONObject json) throws JSONException {
			// 
			return false;
		}
		
	}
	static class Identity implements Test {
		Test child;
		Identity(Test aChild) { child = aChild; }
		public boolean test(JSONObject json) throws JSONException {
			return child.test(json);
		}
		
	}
}
