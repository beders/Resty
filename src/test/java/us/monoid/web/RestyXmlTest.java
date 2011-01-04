package us.monoid.web;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static us.monoid.web.Resty.*;

import org.junit.Test;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import us.monoid.web.Resty;

public class RestyXmlTest {

	@Test
	public void testXml() throws Exception {
		Resty r = new Resty();
		NodeList nl = r.xml("http://rss.slashdot.org/Slashdot/slashdotGamesatom").get("feed/entry/link");
		assertNotNull(nl);
		for (int i = 0, len = nl.getLength(); i < len; i++) {
			System.out.println(((Element)nl.item(i)).getAttribute("href"));
		}
	}
	
	@Test
	public void testXml2Text() throws Exception {
		Resty r = new Resty();
		String text = r.xml("http://rss.slashdot.org/Slashdot/slashdotDevelopersatom").toString();
		System.out.println(text);
		assertTrue(text.contains("Slashdot: Developers"));
	}
	
	/** Getting the Google Developer calendar feed as JSON and following to the first entry, which is an XML resource:
*/
	@Test
	public void jsonToXml() throws Exception {
		Resty r = new Resty();
		String title = r.json("http://www.google.com/calendar/feeds/developer-calendar@google.com/public/full?alt=json").
			xml(path("feed.entry[0].id.$t")).get("entry/title/text()", String.class);
		assertNotNull(title);
		System.out.println(title);
	}
}
