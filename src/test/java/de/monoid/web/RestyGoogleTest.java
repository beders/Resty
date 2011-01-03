package de.monoid.web;

import static org.junit.Assert.assertTrue;

import java.io.File;

import org.junit.Test;

public class RestyGoogleTest {

	@Test
	public void testGeocode() throws Exception {
		// &ll=37.815649,-122.477646
		Resty r = new Resty();
		String ggBridge = r.json("http://maps.googleapis.com/maps/api/geocode/json?latlng=37.815649,-122.477646&sensor=false").
			get("results[0].formatted_address").toString();
		System.out.println(ggBridge);
		assertTrue(ggBridge.contains("Golden Gate Bridge"));
	}
	
	@Test
	public void testStaticMap() throws Exception {
		Resty r = new Resty();
		File f = r.bytes("http://maps.google.com/maps/api/staticmap?size=512x512&maptype=hybrid" +
				"&markers=size:mid%7Ccolor:red%7C37.815649,-122.477646&sensor=false").save(File.createTempFile("google", ".png"));
		System.out.println(f.toURI());
		f.delete();
	}
}
