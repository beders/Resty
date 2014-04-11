package us.monoid.web.ssl;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;

public class TrustAllX509SocketFactory {
    public static SSLSocketFactory getSSLSocketFactory() throws Exception {
        SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, TrustAllX509Certificates.TRUST_MANAGER, null);
        return sc.getSocketFactory();
    }

}
