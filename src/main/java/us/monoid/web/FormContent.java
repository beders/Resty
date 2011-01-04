package us.monoid.web;

import java.io.UnsupportedEncodingException;

/** Encapsulates form-data sent to web services.
 * Currently only application/x-www-form-urlencoded is supported.
 * 
 * @author beders
 *
 */
public class FormContent extends Content {
	protected String rawQuery;

	public FormContent(String query) {
		super("application/x-www-form-urlencoded", getBytes(query)); // strictly speaking US ASCII should be used
	}
	
	private static byte[] getBytes(String query) {
		try {
			return query.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return new byte[0]; // should never happen
	}


	@Override
	public String toString() {
		return rawQuery;
	}
}
