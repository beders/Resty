package us.monoid.web.jp.javacc;

import us.monoid.json.JSONException;
import us.monoid.json.JSONObject;

public abstract class AbstractJSONExpr extends SimpleNode implements JSONPathCompilerTreeConstants {

	public AbstractJSONExpr(int i) {
		super(i);
	}

	public int getChildrenCount() {
		return this.children == null ? 0 : children.length;
	}

	public AbstractJSONExpr at(int index) {
		return (AbstractJSONExpr) (this.children == null || index < 0 || index >= this.children.length ? null
				: this.children[index]);
	}

	public String getName() {
		return JSONPathCompilerTreeConstants.jjtNodeName[this.id];
	}

	/**
	 * selector mode: choose if o matches the predicates, so evaluation can
	 * continue
	 */
	boolean test(Object o) throws JSONException {
		switch (this.id) {
		case JJTSELECTOR: {
			return selector(o);
		}
		case JJTPREDICATE: {
			return predicate(o);
		}
		case JJTTERM: {
			return term(o);
		}
		case JJTNEG: {
			return neg(o);
		}
		case JJTPART: {
			return part(o);
		}
		}
			
		return false;
	}

	/** either predicate() or recursive action. one child. 
	 * @throws JSONException */
	boolean part(Object o) throws JSONException {
		return at(0).test(o);
	}

	boolean neg(Object o) throws JSONException {
		 boolean result = at(0).test(o); // only one child		 
		return (value == null) ? result : !result; // value will be set by parsing to Boolean.FALSE if neg was used
	}

	/** conjunction: neg() ( < AND > neg() )* 
	 * @throws JSONException */
	boolean term(Object o) throws JSONException {
		boolean result = false;
		for (int i = 0; o != null && i < getChildrenCount(); ++i) {
			result = at(i).test(o);
			if (!result) break; // first FALSE stops this eval
		}
		return result;
	}

	/** disjunction: term() ( < OR > term() )* 
	 * @throws JSONException */
	boolean selector(Object o) throws JSONException {
		boolean result = false;
		for (int i = 0; o != null && i < getChildrenCount(); ++i) {
			result = at(i).test(o);
			if (result) break; // one TRUE statement -> continue
		}
		return result;
	}

	boolean predicate(Object o) throws JSONException {
		Predicates.Test t = Predicates.Test.class.cast(this.value);
		return t.test((JSONObject) o);
	}

	abstract Object eval(Object o) throws JSONException;

	@Override
	public String toString() {
		return super.toString() + " " + (value == null ? "" : value);
	}
}
