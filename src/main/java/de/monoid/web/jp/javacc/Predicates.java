package de.monoid.web.jp.javacc;

import org.json.JSONException;
import org.json.JSONObject;

public class Predicates {
	public interface Test {
		boolean test(JSONObject json) throws JSONException;
	}

	static class Operator implements Test {
		String fieldName;
		char ops;
		Comparable value;

		Operator(String aFieldName, String anOperator, Comparable aValue) {
			fieldName = aFieldName;
			ops = anOperator.charAt(0);
			value = aValue;
		}

		public boolean test(JSONObject json) throws JSONException {
			Comparable val = (Comparable) json.get(fieldName);
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
	
	static class Identity implements Test {
		Test child;
		Identity(Test aChild) { child = aChild; }
		public boolean test(JSONObject json) throws JSONException {
			return child.test(json);
		}
		
	}
}
