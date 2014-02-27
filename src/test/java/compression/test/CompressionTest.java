package compression.test;

import org.junit.Test;
import us.monoid.web.Resty;

import java.io.IOException;

import static org.junit.Assert.assertTrue;

/**
 * Test that Resty deflates a compressed stream if gzip'd content is requested via the Accept-Encoding header
 */
public class CompressionTest {

    @Test
    public void testResponseDeflated() throws IOException {
        // no compression
        Resty r = new Resty();
        String responseBody = r.text("http://www.whatsmyip.org/http-compression-test/").toString();
        assertTrue("response body expected to contain message that NOT compressed",
                responseBody.contains("No, Your Browser is Not Requesting Compressed Content"));

        // with compression
        r = new Resty();
        r.withHeader("Accept-Encoding", "gzip");
        responseBody = r.text("http://www.whatsmyip.org/http-compression-test/").toString();
        assertTrue("response body expected to contain message that it WAS compressed",
                responseBody.contains("Yes, Your Browser is Requesting Compressed Content"));
    }

}
