package us.monoid.web.ssl;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import sun.net.www.protocol.https.DefaultHostnameVerifier;
import sun.security.provider.certpath.SunCertPathBuilderException;
import sun.security.ssl.SSLSocketFactoryImpl;
import sun.security.validator.ValidatorException;
import us.monoid.web.Resty;
import us.monoid.web.TextResource;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLHandshakeException;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

public class IgnoreAllCertsTest extends AbstractSSLServerTest {

    @After
    public void tearDown() {
        super.stopServer();
    }

    @Test
    public void shouldAllowConnectionToResourceWhereCertAndHostnameAreInvalidButWhenIgnoreAllCertsIsSet() throws Exception {
        startServer("us/monoid/web/ssl/test-ssl-hostname-eq-site.com.keystore");

        Resty.ignoreAllCerts();

        Resty resty = new Resty();

        TextResource response = resty.text(String.format("https://localhost:%d%s", getPort(), HelloWorldTestResource.HELLO_WORLD_PATH));

        assertThat(response.toString(), equalTo(HelloWorldTestResource.HELLO_WORLD));
    }

    @Test(expected = SSLHandshakeException.class)
    public void shouldFailSSLHandshakeWhenHostnameMatchesButCertificateIsInvalid() throws Exception {
        HttpsURLConnection.setDefaultSSLSocketFactory(new SSLSocketFactoryImpl());
        HttpsURLConnection.setDefaultHostnameVerifier(new DefaultHostnameVerifier());

        startServer("us/monoid/web/ssl/test-ssl-hostname-eq-localhost.keystore");

        Resty resty = new Resty();

        resty.text(String.format("https://localhost:%d%s", getPort(), HelloWorldTestResource.HELLO_WORLD_PATH));
    }

    @Test(expected = SSLHandshakeException.class)
    public void shouldFailWhenCertificateHostnameDoesNotMatchAndHostnameIsNotIgnored() throws Exception {
        HttpsURLConnection.setDefaultSSLSocketFactory(new SSLSocketFactoryImpl());
        HttpsURLConnection.setDefaultHostnameVerifier(AllowAllHostnameVerifier.ALLOW_ALL_HOSTNAMES);

        startServer("us/monoid/web/ssl/test-ssl-hostname-eq-site.com.keystore");

        Resty resty = new Resty();

        resty.text(String.format("https://localhost:%d%s", getPort(), HelloWorldTestResource.HELLO_WORLD_PATH));
    }
}
