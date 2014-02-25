package us.monoid.web;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import junit.framework.Assert;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 *
 * @author ashish
 */
public class RestyChunkedTest {

    private static TestServer testServer;

    @BeforeClass
    public static void setupServer() throws IOException {
        testServer = new TestServer("us.monoid.web.server");        
    }

    @Test
    public void testChunked() throws IOException {
        Resty resty = new Resty();
        String content = "Hello world\nThis is a test for a chunked upload.";
        InputStream stream = new ByteArrayInputStream(content.getBytes("UTF-8"));
        String url = testServer.getBaseUri() + "mime/text";
        System.out.println("URL: " + url);
        String result = resty.text(url, Resty.chunked("text/plain", stream)).toString();
        Assert.assertEquals(content, result);
    }

    @AfterClass
    public static void shutdownServer() {
        testServer.stop();
    }
}
