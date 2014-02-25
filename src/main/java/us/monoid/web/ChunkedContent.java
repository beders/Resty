package us.monoid.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLConnection;

/**
 *
 * Represents a chunked, streaming content. Takes the data from InputStream and sends it.
 *
 * @author ashish
 */
public class ChunkedContent extends AbstractContent {

    private static final int BUFFER_SIZE = 4096;

    private final InputStream in;
    private final String mime;

    public ChunkedContent(String mime, InputStream in) {
        this.in = in;
        this.mime = mime;
    }

    @Override
    public void writeHeader(OutputStream os) throws IOException {
        os.write(ascii("Content-Type: " + mime + "\r\n"));
        os.write(ascii("Transfer-Encoding: chunked\r\n"));
    }

    @Override
    public void writeContent(OutputStream os) throws IOException {
        byte[] buffer = new byte[BUFFER_SIZE];
        int len;
        while ((len = in.read(buffer)) != -1) {
            os.write(buffer, 0, len);
        }
    }

    @Override
    protected void addContent(URLConnection con) throws IOException {
        con.setDoOutput(true);
        con.addRequestProperty("Content-Type", mime);
        con.addRequestProperty("Transfer-Encoding", "chunked");
        OutputStream os = con.getOutputStream();
        writeContent(os);
        os.close();
    }

}
