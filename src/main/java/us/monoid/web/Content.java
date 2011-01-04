/**
 * 
 */
package us.monoid.web;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLConnection;

/**
 * Class to encapsulate content being sent as payload of a POST request.
 * You can use Resty.content(...) to create content objects. 
 * 
 * 
 * @author beders
 *
 */
public class Content {
	protected String mime;
	protected byte[] content;
	

	/** Create a new content object with given mime type and the content as bytes.
	 * No check if mime type is 'valid' or similar non-sense is done. You are all grown-ups.
	 * @param aMimeType the mime type. example: text/plain;charset=UTF-8
	 * @param someBytes the content to deliver as bytes
	 */
	public Content(String aMimeType, byte[] someBytes) {
		mime = aMimeType;
		content = someBytes;
	}
	
	/** Add the content to the URLConnection used.
	 * 
	 * @param con the connection to use
	 * @throws IOException if writing to stream fails
	 */
	void addContent(URLConnection con) throws IOException {
		con.setDoOutput(true);
		con.addRequestProperty("Content-Type", mime);
		con.addRequestProperty("Content-Lenghth", String.valueOf(content.length));
		OutputStream os = con.getOutputStream();
		os.write(content);
		os.close();
	}

}
