/**
 * 
 */
package us.monoid.web;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URLConnection;

/**
 * Used in PUT operations. Wraps nicely around Content and makes sure that PUT is used instead of POST, 
 * effectively replacing the existing resource (or creating a new one, according to the holy HTTP spec.
 * 
 * @author beders
 *
 */
public class Replacement extends AbstractContent {
	private Content wrappedContent;
	
	public Replacement(Content someContent) {
		wrappedContent = someContent;
	}
	
	@Override
	protected	void addContent(URLConnection con) throws IOException {
		con.setDoOutput(true);
		((HttpURLConnection)con).setRequestMethod("PUT");
		wrappedContent.addContent(con);
	}

	@Override
	public void writeContent(OutputStream os) throws IOException {
		// no own content
	}

	@Override
	public void writeHeader(OutputStream os) throws IOException {
		// no header
	}

	
}
