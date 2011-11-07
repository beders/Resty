package us.monoid.web;

import org.junit.Test;
import us.monoid.web.Resty.*;

public class RestyWithOption {

		@Test
		public void testOptions() {
			/** Configure Resty with a socket timeout of 3000ms */
			new Resty(Option.timeout(3000));
		}
		
}
