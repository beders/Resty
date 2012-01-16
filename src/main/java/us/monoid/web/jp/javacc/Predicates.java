package us.monoid.web.jp.javacc;

import us.monoid.json.JSONException;
import us.monoid.json.JSONObject;
import us.monoid.web.jp.javacc.JSONPathCompiler.JSONPathExpr;

public class Predicates {
	public interface Test {
		boolean test(JSONObject json) throws JSONException;
	}

	static class Operator implements Test {
		JSONPathExpr lhs;
		char ops;
		JSONPathExpr rhs;

		Operator(JSONPathExpr aSubExpr, String anOperator, JSONPathExpr aValue) {
			lhs = aSubExpr;
			ops = anOperator.charAt(0);
			rhs = aValue;
		}

		public boolean test(JSONObject json) throws JSONException {
			Comparable val = (Comparable) lhs.eval(json);
			if (val instanceof Number) { // fix comparison between Integers and Doubles by making sure the extracted value is a double
				val = ((Number)val).doubleValue();
			}
			if (rhs == null) {  // test for existence of an attribute
				return json.has(val.toString());
			} else {
			Comparable rhsVal = (Comparable) rhs.eval(json);
			int comparisonResult = val.compareTo(rhsVal);
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
