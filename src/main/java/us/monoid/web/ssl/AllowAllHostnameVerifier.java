package us.monoid.web.ssl;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;

/**
 * This HostnameVerifier turns off hostname verification.
 *
 * WARNING: Using this is dangerous as it bypasses an importance part of SSL handshaking. However, good for testing...
 */
public final class AllowAllHostnameVerifier implements HostnameVerifier {

    public static final HostnameVerifier ALLOW_ALL_HOSTNAMES = new AllowAllHostnameVerifier();

    @Override
    public boolean verify(String s, SSLSession sslSession) {
        return true;
    }
}
