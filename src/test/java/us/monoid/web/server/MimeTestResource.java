/**
 * 
 */
package us.monoid.web.server;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.sun.jersey.multipart.BodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;

/**
 * Simple JAX-RS service for testing purposes
 * 
 * @author beders
 *
 */
@Path("/mime")
public class MimeTestResource {
	
	@Path("/text")
	@POST
	@Consumes("text/plain")
	@Produces("text/plain")
	public String mirrorContent(String content) {
		return content;
	}
	
//	@Path("/multipart")
//	@POST
//	@Consumes("multipart/form-data")
//	@Produces("text/plain")
//	public String printParts(@FormDataParam("bubu") FormDataBodyPart bubu,
//			@FormDataParam("lala") FormDataBodyPart schoen
//				) {
//		StringBuilder sb = new StringBuilder();
//		
//			sb.append(bubu);
//			sb.append("/////////////////");
//			sb.append(schoen);
//		return sb.toString();
//	}
	@Path("/multipart")
	@POST
	@Consumes("multipart/form-data")
	@Produces("text/plain")
	public String printParts(FormDataMultiPart part) {
		StringBuilder sb = new StringBuilder();
		for (BodyPart bp : part.getBodyParts()) {
			sb.append("Name: " + bp.getContentDisposition().toString() + ", Type:" + bp.getMediaType());
			sb.append("\n////////////////////\n");
		}
		return sb.toString();
	}
	
	@Path("/put")
	@PUT
	public String putty(String o) {
		return o;
	}
	
	@Path("/delete")
	@DELETE
	public String delete() {
		return "DELETED";
	}
	
	
}
