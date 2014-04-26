package us.monoid.web.ssl;

import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

final class TrustAllX509Certificates implements X509TrustManager {
    static final TrustManager[] TRUST_MANAGER =  new TrustManager[] { new TrustAllX509Certificates() };

    public void checkClientTrusted(X509Certificate[] certs, String authType) {}

    public void checkServerTrusted(X509Certificate[] certs, String authType) {}

    public X509Certificate[] getAcceptedIssuers() {	return null; }
}
