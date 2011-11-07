package us.monoid.web;

import org.junit.Test;
import us.monoid.web.Resty.*;

public class RestyWithOption {

		@Test
		public void testOptions() {
			new Resty(Option.timeout(3000), Option.ignoreInvalidCertificates());
		}
		
}
