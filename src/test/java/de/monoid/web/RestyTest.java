package de.monoid.web;

import static de.monoid.web.Resty.path;
import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class RestyTest {
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
	
	
}
