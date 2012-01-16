package us.monoid.web;

import static org.junit.Assert.*;
import static us.monoid.web.Resty.*;

import java.io.IOException;
import java.net.URI;

import us.monoid.json.JSONException;
import us.monoid.json.JSONObject;
import us.monoid.web.Resty;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

public class RestyMimeTest {
	static TestServer ts;
	

	/** Test talking to the multipart test resource. It returns a list of the mime parts found with their disposition and mime-type
	 * 
	 * @throws IOException
	 * @throws JSONException
	 */
	@Test
	public void createMultiformTest() throws IOException, JSONException {
		Resty r = new Resty();
		//TextResource text = r.text("http://www.cs.tut.fi/cgi-bin/run/~jkorpela/echoraw.cgi", 
		TextResource text = r.text("http://localhost:9998/mime/multipart", 
				form(data("bubu", "lala"), data("schön", "böööh")));
		String result = text.toString();
		System.out.println(result);
		assertTrue(result.contains("bubu"));
		JSONObject json = new JSONObject();
		json.put("bubu", "lala");
		text = r.text("http://localhost:9998/mime/multipart", form(data("someJson", content(json)), data("someText", "Text")));
		result = text.toString();
		System.out.println(result);
		assertTrue(result.contains("someJson") && result.contains("application/json") && result.contains("someText"));
	}
	
	@Test
	public void testSubmitPost() throws IOException {
		Resty r = new Resty();
		String uri = ts.getBaseUri() + "mime/text";
		System.out.println("Posting to:" + uri);
		String result = r.text(uri, content("bubu")).toString();
		System.out.println(result);
	}

	@Test
	public void testSubmitPut() throws IOException {
		Resty r = new Resty();
		String uri = ts.getBaseUri() + "mime/put";
		System.out.println("Put to:" + uri);
		String result = r.text(uri, put(content("bubu"))).toString();
		System.out.println(result);
	}
	
	@Test
	public void testPutLocation() throws IOException {
		Resty r = new Resty();
		String uri = ts.getBaseUri() + "mime/put";
		System.out.println("Put to:" + uri);
		URI loc = r.text(uri, put(content("bubu"))).location();
		System.out.println("Location of new resource:" + loc);
		assertNotNull(loc);
		
	}

	@Test
	public void testSubmitDelete() throws IOException {
		Resty r = new Resty();
		String uri = ts.getBaseUri() + "mime/delete";
		System.out.println("Delete at " + uri);
		TextResource text = r.text(uri, delete());
		String result = text.toString();
		System.out.println(result);
		assertTrue(result.equals("DELETED"));
		assertTrue(text.status(200));
	}

	
	
	@BeforeClass
	public static void setupTestServer() throws IllegalArgumentException, IOException {
		ts = new TestServer("us.monoid.web.server");
	}
	
	@AfterClass
	public static void stopServer() {
		ts.stop();
	}
	
}
