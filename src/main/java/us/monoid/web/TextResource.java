package us.monoid.web;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.nio.charset.IllegalCharsetNameException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This is a text/* representation of a resource.
 * 
 * @author beders
 * 
 */
public class TextResource extends AbstractResource {
	static final Pattern charsetPattern = Pattern.compile("charset=([^ ;]+);?");
	protected String text;

	public TextResource(Option... options) {
		super(options);
	}

	/**
	 * Kinda obvious, but, yes, it parses the inputStream with the proper charset
	 * and returns the content as String
	 * 
	 */
	@Override
	public String toString() {
		if (text == null && inputStream != null) {
			text = readTextFromStream(inputStream);
			try {
				inputStream.close();
			} catch (IOException e) {/* Intentionally left empty */}
		}
		return text;
	}

	protected String readTextFromStream(InputStream aTextStream) {
		Charset charset = getCharSet();
		int size = urlConnection.getContentLength();
		ByteArrayOutputStream bos = new ByteArrayOutputStream(size != -1 ? size : 1024);
		byte[] buffer = new byte[1024];
		int len;
		try {
			while ((len = aTextStream.read(buffer)) != -1) {
				bos.write(buffer, 0, len);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		String streamedText = ""; // be robust
		try {
			streamedText = bos.toString(charset.name());
		} catch (UnsupportedEncodingException e) {
		} // we already checked for that above
		// check Content-Type text/plain; charset=iso-8859-1
		return streamedText;
	}

	/**
	 * Get charset for this content type. Parses charset= attribute of content
	 * type or falls back to a default
	 * 
	 * @return the charset to use when parsing this content
	 */
	protected Charset getCharSet() {
		String contentType = urlConnection.getContentType();
		Charset charset = Charset.forName("iso-8859-1"); // default charset
		if (contentType != null) {
			// find out about the charset from the URLConnection
			Matcher m = charsetPattern.matcher(contentType);
			if (m.find()) {
				String charsetString = m.group(1);
				try {
					charset = Charset.forName(charsetString);
				} catch (IllegalCharsetNameException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				}
			}
		}
		return charset;
	}

	@Override
	String getAcceptedTypes() {
		return "text/html,text/plain,text/*";
	}

}
