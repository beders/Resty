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
 * Wrapper for content to be sent as form-data.
 * It adds a specific content-disposition header.
 * Also supports an optional file name;
 * @author beders
 *
 */
public class FormData extends AbstractContent {
	private AbstractContent wrappedContent;
	private String controlName;
	private String fileName;
	
	public FormData(String aControlName, AbstractContent content) {
		controlName = aControlName;
		wrappedContent = content;
		/** if (content instanceof FileContent) { fileName = ...} */
	}
	
	public FormData(String aControlName, String aFileName, AbstractContent content) {
		this(aControlName, content);
		fileName = aFileName;
	}
	
	/* (non-Javadoc)
	 * @see us.monoid.web.AbstractContent#addContent(java.net.URLConnection)
	 */
	@Override
	protected void addContent(URLConnection con) throws IOException {
		throw new IOException("This content must be sent as part of a MultipartContent");
	}

	/* (non-Javadoc)
	 * @see us.monoid.web.AbstractContent#writeContent(java.io.OutputStream)
	 */
	@Override
	public void writeContent(OutputStream os) throws IOException {
		wrappedContent.writeContent(os);
	}

	/* (non-Javadoc)
	 * @see us.monoid.web.AbstractContent#writeHeader(java.io.OutputStream)
	 */
	@Override
	public void writeHeader(OutputStream os) throws IOException {	
		os.write(ascii("Content-Disposition: form-data; name=\"" + enc(controlName)
				 + "\"" +
				((fileName != null) ? "; filename=\"" + enc(fileName) + "\"" : "") + "\r\n")); 
		wrappedContent.writeHeader(os);
	}

	
}
