package de.monoid.web;

import static de.monoid.web.Resty.*;
import static org.junit.Assert.*;

import org.junit.Test;

public class RestyTest {
	
	private static final String GOOGLE_QUERY_DATA = "q=Resty&hl=en&num=20";

	static {
		System.setProperty("content.types.user.table","src/test/java/de/monoid/web/mimecap.properties");
	}
	@Test
	public void sampleUse() throws Exception {
		Resty r = new Resty();
		assertEquals(r.json("file:src/test/java/de/monoid/web/test.json").json(path("key.subkey")).object().getInt("secret"), 42);
	}

	@Test
	public void geoNames() throws Exception {
		Resty r = new Resty();
		Object name = r.json("http://ws.geonames.org/postalCodeLookupJSON?postalcode=66780&country=DE").get("postalcodes[0].placeName");
		assertEquals(name, "Rehlingen-Siersburg");
	}
	
	@Test
	public void formDataGet() throws Exception {
		Resty r = new Resty();
		String t = r.text("http://www.google.com/search?" +  GOOGLE_QUERY_DATA).toString();
		System.out.println(t);
		assertTrue(t.contains("resty"));
	}
 
	@Test
	public void formDataPost() throws Exception {
		Resty r = new Resty();
		String t = r.text("http://www.cs.tut.fi/cgi-bin/run/~jkorpela/echoraw.cgi",
				form(GOOGLE_QUERY_DATA)).toString();
		System.out.println(t);
		assertTrue(t.contains(GOOGLE_QUERY_DATA));
	}

	
}
