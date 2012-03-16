/**
 * 
 */
package us.monoid.web;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * All-purpose resource which is used to access application/octet-stream content or any content in that respect.
 * I.e. it will match all types, so you can also download raw JSON or images or whatever media type you envision.
 * @author beders
 *
 */
public class BinaryResource extends AbstractResource {

	public BinaryResource(Option... options) {
		super(options);
	}

	/* (non-Javadoc)
	 * @see us.monoid.web.AbstractResource#getAcceptedTypes()
	 */
	@Override
	String getAcceptedTypes() {
		return "application/octet-stream,*/*";
	}

	/** Save the contents of the resource to a file.
	 * This reads the data from the stream and stores it into the given file.
	 * Depending on the resource the data might or might not be available afterwards.
	 * 
	 * @param aFileName file to save the data in
	 * @return the file the content was stored at
	 * @throws IOException 
	 */
	public File save(File aFileName) throws IOException {
		BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(aFileName), 1024);
		byte[] buffer = new byte[1024];
		int len = -1;
		while ((len = inputStream.read(buffer)) != -1) {
			bos.write(buffer, 0, len);
		}
		bos.close();
		inputStream.close();
		return aFileName;
	}

	
	
}
