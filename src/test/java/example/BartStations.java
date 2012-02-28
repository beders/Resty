package example;

import us.monoid.web.Resty;


public class BartStations {

	/**
	 * @param args
	 * @throws Exception 
	 * @throws  
	 */
	public static void main(String[] args) throws Exception {
		Resty r = new Resty();
		String result = r.xml("http://bart.gov/dev/eta/bart_eta.xml").get("/root/station/eta/estimate[../../name/text()='Powell St.' and ../destination/text()='SF Airport']", String.class);
		System.out.println("Next train to SFO from Powell St.:" + result);
	}

}
