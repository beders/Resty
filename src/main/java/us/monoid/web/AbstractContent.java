/**
 * 
 */
package us.monoid.web;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLConnection;

import us.monoid.util.EncoderUtil;
import us.monoid.util.EncoderUtil.Usage;

/**
 * Abstract base class of the content being sent to a server.
 * Check Resty.content(...) methods to create objects
 * @author beders
 *
 */
public abstract class AbstractContent {
	public static final byte[] CRLF = { '\r', '\n' };

	abstract public void writeHeader(OutputStream os) throws IOException;
	abstract public void writeContent(OutputStream os) throws IOException;	
	abstract protected void addContent(URLConnection con) throws IOException;
	
	protected byte[] ascii(String string) {
		return string.getBytes(EncoderUtil.US_ASCII);
	}
	
	protected String enc(String aString) {
		return EncoderUtil.encodeIfNecessary(aString, Usage.TEXT_TOKEN, 0);
	}
}
