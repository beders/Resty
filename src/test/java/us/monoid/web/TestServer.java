/**
 * 
 */
package us.monoid.web;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.sun.grizzly.http.SelectorThread;
import com.sun.jersey.api.container.grizzly.GrizzlyWebContainerFactory;

/**
 * Set up a test server for rest resources.
 * 
 * @author beders
 * 
 */
public class TestServer {

	private SelectorThread threadSelector;
	private String baseUri;

	public TestServer(String aPackage) throws IllegalArgumentException, IOException {
		Handler h = new ConsoleHandler(); h.setLevel(Level.ALL);
		Logger.getLogger("").addHandler(h);
		
		baseUri = "http://localhost:9998/";
		final Map<String, String> initParams = new HashMap<String, String>();

		initParams.put("com.sun.jersey.config.property.packages",
				aPackage);

		System.out.println("Starting grizzly...");
		threadSelector = GrizzlyWebContainerFactory.create(baseUri, initParams);
		System.out.println(String
				.format("Jersey app started with WADL available at %sapplication.wadl\n", baseUri));
	}
	
	public String getBaseUri() {
		return baseUri;
	}
	
	public void stop() {
		threadSelector.stopEndpoint();
	}
	
	public static void main(String[] args) throws IllegalArgumentException, IOException {
		TestServer testServer = new TestServer("us.monoid.web.server");
		System.in.read();
		testServer.stop();
	}
}
