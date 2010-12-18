package de.monoid.web;

/** This is a text/plain representation of a resource.
 * 
 * @author beders
 *
 */
public class PlainTextResource extends AbstractResource {
	protected String text;
	
	String text() {
		return text;
	}

	@Override
	void setContent(Object aContent) {
		text = aContent.toString();
	}
}
