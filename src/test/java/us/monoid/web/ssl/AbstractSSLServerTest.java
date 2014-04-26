package us.monoid.web.ssl;

import com.google.common.io.Resources;
import com.sun.grizzly.SSLConfig;
import com.sun.grizzly.http.embed.GrizzlyWebServer;
import com.sun.grizzly.http.servlet.ServletAdapter;
import com.sun.jersey.spi.container.servlet.ServletContainer;

import java.io.File;
import java.net.URL;

public abstract class AbstractSSLServerTest {
    GrizzlyWebServer webServer;

    protected void startServer(String keystorePath) throws Exception {

        webServer = new GrizzlyWebServer(getPort(), ".", true);

        SSLConfig sslConfig = new SSLConfig();

        URL resource = Resources.getResource(keystorePath);

        if (resource != null) {
            String path = new File(resource.toURI()).getAbsolutePath();
            sslConfig.setKeyStoreFile(path);
            sslConfig.setKeyStorePass("testpass");
        } else {
            throw new RuntimeException("Failed to find test keystore");
        }
        webServer.setSSLConfig(sslConfig);

        // Jersey web resources
        ServletAdapter jerseyAdapter = new ServletAdapter();
        jerseyAdapter.addInitParameter("com.sun.jersey.config.property.packages", "us.monoid.web.ssl");
        jerseyAdapter.setContextPath("/");

        jerseyAdapter.setServletInstance(new ServletContainer());

        // register all above defined adapters
        webServer.addGrizzlyAdapter(jerseyAdapter, new String[] {"/"});

        // let Grizzly run
        webServer.start();
    }

    protected int getPort() {
        return 8443;
    }

    public void stopServer() {
        webServer.stop();
    }
}
