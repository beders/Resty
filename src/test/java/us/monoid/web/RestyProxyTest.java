package us.monoid.web;

import org.junit.Test;

import java.io.IOException;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.text.StringStartsWith.startsWith;
import static org.junit.Assert.assertThat;

/**
 * Test Restys proxy support.
 */
public class RestyProxyTest {

	@Test
	public void restyShouldBeAbleToConnectViaAProxy() throws IOException {
		SingleRequestServer server = new SingleRequestServer();
		server.setResponse("HTTP/1.1 200 OK\nConnection: close\n\nHello, World!");
		int port = server.start();

		Resty r = new Resty();
		r.setProxy("localhost", port);
		String response = r.text("http://example.com/some/path").toString();

		assertThat(server.getLastRequest(), startsWith("GET http://example.com/some/path HTTP/1.1"));
		assertThat(response, equalTo("Hello, World!"));
	}

}
