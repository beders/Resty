package us.monoid.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.Authenticator;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;

import java.net.URI;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.xml.xpath.XPathException;

import us.monoid.json.JSONArray;
import us.monoid.json.JSONObject;
import us.monoid.web.auth.RestyAuthenticator;
import us.monoid.web.mime.MultipartContent;
import us.monoid.web.ssl.AllowAllHostnameVerifier;
import us.monoid.web.ssl.TrustAllX509SocketFactory;

/**
 * Main class. Use me! Use me! Resty is a small, convenient interface to talk to RESTful services.
 *
 * Basic usage is very simple: Create a Resty instance, use authenticate methode to add credentials (optional), then call one of the content type specific methods,
 * like json(...), xml(...), text(...) or bytes(...).
 *
 * The idea is that the method name
 * will convey the expected content type you can then operate on. Most static methods help you build content objects or queries with a compact syntax. Static methods like put(...) and delete() are
 * used to implement the respective HTTP methods.
 *
 * A neat trick to save you typing is to use <pre><code>import static us.monoid.web.Resty.*;</code></pre>
 * <p>
 *
 * GETting an URL (as JSON):
 * <pre><code>new Resty().json(url);</code></pre>
 *
 * POSTing to an URL (using multipart/form-data) and expecting JSON back:
 * <pre><code>new Resty().json(url, form(data("name", "Don Draper"), data("occupation", "Ad Man")));</code></pre>
 *
 * PUTting content and expecting JSON back:
 * <pre><code>
 * new Resty().json(url, put(content(someJSON)));
 * </code></pre>
 *
 * DELETE a resource via URL expecting JSON back:
 * <pre><code>new Resty().json(url, delete());</code></pre>
 *
 *
 * Here is an example on how to use the geonames web service. It retrieves the json object (see json.org for details) and gets the name of a place from the zip code:
 *
 * <pre>
 * <code>
 * 	Resty r = new Resty();
 * 	Object name = r.json("http://ws.geonames.org/postalCodeLookupJSON?postalcode=66780&country=DE").get("postalcodes[0].placeName");
 * 	assertEquals(name, "Rehlingen-Siersburg");
 * </code>
 * </pre>
 *
 * The return value is a resource with the data you requested AND a new Resty instance with the same set of options you initialized Resty with.
 *
 *
 * Resty supports complex path queries to navigate into a json object. This is mainly used for extracting URIs to surf along a series of REST resources for web services following the HATEOS paradigm.
 *
 * Resty objects are not re-entrant.
 *
 * You can also specify options when creating a Resty instance. Well, currently there is one option to set the timeout for connections.
 * But you can also create your own options! See Resty.Option for more info.
 *
 * @author beders
 *
 */

public class Resty {

	protected static String MOZILLA = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
	protected static String DEFAULT_USER_AGENT = "Resty/0.1 (Java)";
	static RestyAuthenticator rath = new RestyAuthenticator();
	static {
		try {
			if (CookieHandler.getDefault() == null) {
				CookieHandler.setDefault(new CookieManager());  // TODO: get rid of this for 0.4 release
			}
		} catch (NoClassDefFoundError oops) {
			System.err.println("No CookieHandler. Running on GAE? Fine. No cookie support for you!");
		}
		Authenticator.setDefault(rath);
	}

	protected String userAgent = DEFAULT_USER_AGENT;
	private java.net.Proxy proxy = java.net.Proxy.NO_PROXY;
	private Map<String, String> additionalHeaders;
	private Option[] options;

	/**
	 * Create an instance of Resty with the following list of options.
	 * <b>Also, options are carried over to resources created by calls to json/text/binary etc.</b>
	 * Use {@link #setOptions(Option...)} to change options afterwards.
	 *
	 */
	public Resty(Option... someOptions) {
		setOptions(someOptions);
	}

	/** Set options if you missed your opportunity in the c'tor or if you want to change the options.
	 *
	 * @param someOptions new set of options
	 * @return
	 */
	public Resty setOptions(Option... someOptions) {
		options = (someOptions == null) ? new Option[0] : someOptions;
		for (Option o : options) {
			o.init(this);
		}
		return this;
	}

	/**
	 * Register this root URI for authentication. Whenever a URL is requested that starts with this root, the credentials given are used for HTTP AUTH. Note that currently authentication information is
	 * shared across all Resty instances. This is due to the shortcomings of the java.net authentication mechanism. This might change should Resty adopt HttpClient and is the reason why this method is
	 * not a static one.
	 *
	 * @param aSite
	 *          the root URI of the site
	 * @param aLogin
	 *          the login name
	 * @param aPwd
	 *          the password. The array will not be internally copied. Whenever you null it, the password is gone within Resty
	 */
	public void authenticate(URI aSite, String aLogin, char[] aPwd) {
		rath.addSite(aSite, aLogin, aPwd);
	}

	/**
	 *
	 * @see Resty#authenticate(URI, String, char[])
	 *
	 * @param string
	 * @param aLogin
	 * @param charArray
	 */
	public void authenticate(String string, String aLogin, char[] charArray) {
		authenticate(URI.create(string), aLogin, charArray);
	}

	/**
	 * Register a login password for the realm returned by the authorization challenge.
	 * Use this method instead of authenticate in case the URL is not made available to the java.net.Authenticator class
	 *
	 * @param realm the realm (see rfc2617, section 1.2)
	 * @param aLogin
	 * @param charArray
	 */
	public void authenticateForRealm(String realm, String aLogin, char[] charArray) {
		rath.addRealm(realm, aLogin, charArray);
	}

	/**
	 * Sets the User-Agent to identify as Mozilla/Firefox. Otherwise a Resty specific User-Agent is used
	 */
	public Resty identifyAsMozilla() {
		userAgent = MOZILLA;
		return this;
	}

	/**
	 * Sets the User-Agent to Resty. WHICH IS THE DEFAULT. Sorry for yelling.
	 *
	 */
	public Resty identifyAsResty() {
		userAgent = DEFAULT_USER_AGENT;
		return this;
	}

	/**
	 * GET a URI given by string and parse the result as JSON.
	 *
	 * @param string
	 *          - the string to use as URI
	 * @see Resty#json(URI) for more docs
	 */
	public JSONResource json(String string) throws IOException {
		return json(URI.create(string));
	}

	/**
	 * GET a URI and parse the result as JSON.
	 *
	 * @param anUri
	 *          the URI to request
	 * @return the JSONObject, wrapped in a neat JSONResource
	 * @throws IOException
	 */
	public JSONResource json(URI anUri) throws IOException {
		return doGET(anUri, createJSONResource());
	}

	protected JSONResource createJSONResource() {
		return new JSONResource(options);
	}

	/**
	 * POST to a URI and parse the result as JSON
	 *
	 * @param anUri
	 *          the URI to visit
	 * @param requestContent
	 *          the content to POST to the URI
	 * @return
	 * @throws IOException
	 *           if uri is wrong or no connection could be made or for 10 zillion other reasons
	 */
	public JSONResource json(URI anUri, AbstractContent requestContent) throws IOException {
		return doPOSTOrPUT(anUri, requestContent, createJSONResource());
	}

	/** @see Resty#json(URI, Content) */
	public JSONResource json(String anUri, AbstractContent content) throws IOException {
		return json(URI.create(anUri), content);
	}

	/**
	 * Get a plain text resource for the specified URI.
	 *
	 * @param anUri
	 *          the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException
	 *           if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(URI anUri) throws IOException {
		return doGET(anUri, createTextResource());
	}

	protected TextResource createTextResource() {
		return new TextResource(options);
	}

	/**
	 * Get a plain text resource for the specified URI by POSTing to it.
	 *
	 * @param anUri
	 *          the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException
	 *           if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(URI anUri, AbstractContent content) throws IOException {
		return doPOSTOrPUT(anUri, content, createTextResource());
	}

	/**
	 * Get a plain text resource for the specified URI.
	 *
	 * @param anUri
	 *          the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException
	 *           if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(String anUri) throws IOException {
		return text(URI.create(anUri));
	}

	/**
	 * Get a plain text resource for the specified URI by POSTing to it.
	 *
	 * @param anUri
	 *          the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException
	 *           if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(String anUri, AbstractContent content) throws IOException {
		return text(URI.create(anUri), content);
	}

	/**
	 * GET a URI given by string and parse the result as XML.
	 *
	 * @param string
	 *          - the string to use as URI
	 * @see Resty#xml(URI) for more docs
	 */
	public XMLResource xml(String string) throws IOException {
		return xml(URI.create(string));
	}

	/**
	 * GET a URI and parse the result as XML.
	 *
	 * @param anUri
	 *          the URI to request
	 * @return the XML, wrapped in a neat XMLResource
	 * @throws IOException
	 */
	public XMLResource xml(URI anUri) throws IOException {
		return doGET(anUri, createXMLResource());
	}

	protected XMLResource createXMLResource() {
		return new XMLResource(options);
	}

	/**
	 * POST to a URI and parse the result as XML
	 *
	 * @param anUri
	 *          the URI to visit
	 * @param requestContent
	 *          the content to POST to the URI
	 * @return
	 * @throws IOException
	 *           if uri is wrong or no connection could be made or for 10 zillion other reasons
	 */
	public XMLResource xml(URI anUri, AbstractContent requestContent) throws IOException {
		return doPOSTOrPUT(anUri, requestContent, createXMLResource());
	}

	/** @see Resty#xml(URI, Content) */
	public XMLResource xml(String anUri, AbstractContent content) throws IOException {
		return xml(URI.create(anUri), content);
	}

	/**
	 * Get the resource specified by the uri and return a binary resource for it.
	 *
	 * @param anUri
	 *          the uri to follow
	 * @return
	 * @throws IOException
	 */
	public BinaryResource bytes(String anUri) throws IOException {
		return bytes(URI.create(anUri));
	}

	/**
	 * Get the resource specified by the uri and return a binary resource for it.
	 *
	 * @param uri
	 *          the uri to follow
	 * @return
	 * @throws IOException
	 */
	public BinaryResource bytes(URI anUri) throws IOException {
		return doGET(anUri, createBinaryResource());
	}

	protected BinaryResource createBinaryResource() {
		return new BinaryResource(options);
	}

	/**
	 * POST to the URI and get the resource as binary resource.
	 *
	 * @param anUri
	 *          the uri to follow
	 * @return
	 * @throws IOException
	 */
	public BinaryResource bytes(String anUri, AbstractContent someContent) throws IOException {
		return bytes(URI.create(anUri), someContent);
	}

	/**
	 * POST to the URI and get the resource as binary resource.
	 *
	 * @param uri
	 *          the uri to follow
	 * @return
	 * @throws IOException
	 */
	public BinaryResource bytes(URI anUri, AbstractContent someContent) throws IOException {
		return doPOSTOrPUT(anUri, someContent, createBinaryResource());
	}

	protected <T extends AbstractResource> T doGET(URI anUri, T resource) throws IOException {
		URLConnection con = openConnection(anUri, resource);
		return fillResourceFromURL(con, resource);
	}

	protected <T extends AbstractResource> T doPOSTOrPUT(URI anUri, AbstractContent requestContent, T resource) throws IOException {
		URLConnection con = openConnection(anUri, resource);
		requestContent.addContent(con);
		return fillResourceFromURL(con, resource);
	}

	protected <T extends AbstractResource> URLConnection openConnection(URI anUri, T resource) throws IOException, MalformedURLException {
		URLConnection con = anUri.toURL().openConnection(proxy);
		addStandardHeaders(con, resource);
		addAdditionalHeaders(con);
		for (Option o : options) {
			o.apply(con);
		}
		return con;
	}

	/** Add all headers that have been set with the alwaysSend call. */
	protected void addAdditionalHeaders(URLConnection con) {
		for (Map.Entry<String, String> header : getAdditionalHeaders().entrySet()) {
			con.addRequestProperty(header.getKey(), header.getValue());
		}
	}

	/** Add all standard headers (User-Agent, Accept) to the URLConnection. */
	protected <T extends AbstractResource> void addStandardHeaders(URLConnection con, T resource) {
		con.setRequestProperty("User-Agent", userAgent);
		con.setRequestProperty("Accept", resource.getAcceptedTypes());
	}

	/**
	 * Get the content from the URLConnection, create a Resource representing the content and carry over some metadata like HTTP Result and location header.
	 *
	 * @param <T extends AbstractResource> the resource that will be created and filled
	 * @param con
	 *          the URLConnection used to get the data
	 * @param resourceClass
	 *          the resource class to instantiate
	 * @return the new resource
	 * @throws IOException
	 */
	protected <T extends AbstractResource> T fillResourceFromURL(URLConnection con, T resource) throws IOException {
		resource.fill(con);
		resource.getAdditionalHeaders().putAll(getAdditionalHeaders()); // carry over additional headers TODO don't do it if there are no additional headers
		return resource;
	}

	/**
	 * Create a JSONPathQuery to extract data from a JSON object. This is usually used to extract a URI and use it in json|text|xml(JSONPathQuery...) methods of JSONResource.
	 * <code>
	 * Resty r = new Resty();
	 * r.json(someUrl).json(path("path.to.url.in.json"));
	 *
	 * </code>
	 *
	 * @param string
	 * @return
	 */
	public static JSONPathQuery path(String string) {
		return new JSONPathQuery(string);
	}

	/**
	 * Create an XPathQuery to extract data from an XML document. This is usually used to extract a URI and use it in json|text|xml(XPathQuery...) methods. In this case, your XPath must result in a
	 * String value, i.e. it can't just extract an Element.
	 *
	 * @param anXPathExpression
	 *          an XPath expression with result type String
	 * @return the query
	 * @throws XPathException
	 */
	public static XPathQuery xpath(String anXPathExpression) throws XPathException {
		return new XPathQuery(anXPathExpression);
	}

	/**
	 * Create a content object from a JSON object. Use this to POST the content to a URL.
	 *
	 * @param someJson
	 *          the JSON object to use
	 * @return the content to send
	 */
	public static Content content(JSONObject someJson) {
		Content c = null;
		try {
			c = new Content("application/json; charset=UTF-8", someJson.toString().getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) { /* UTF-8 is never unsupported */
		}
		return c;
	}

	/**
	 * Create a content object from a JSON array. Use this to POST the content to a URL.
	 *
	 * @param someJson
	 *          the JSON array to use
	 * @return the content to send
	 */
	public static Content content(JSONArray someJson) {
		Content c = null;
		try {
			c = new Content("application/json; charset=UTF-8", someJson.toString().getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) { /* UTF-8 is never unsupported */
		}
		return c;
	}

	/**
	 * Create a content object from plain text. Use this to POST the content to a URL.
	 *
	 * @param somePlainText
	 *          the plain text to send
	 * @return the content to send
	 */
	public static Content content(String somePlainText) {
		Content c = null;
		try {
			c = new Content("text/plain; charset=UTF-8", somePlainText.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) { /* UTF-8 is never unsupported */
		}
		return c;
	}

	/**
	 * Create a content object from a byte array. Use this to POST the content to a URL with mime type application/octet-stream.
	 *
	 * @param bytes
	 *          the bytes to send
	 * @return the content to send
	 */
	public static Content content(byte[] bytes) {
		return new Content("application/octet-stream", bytes);
	}

	/**
	 * Create form content as application/x-www-form-urlencoded (i.e. a=b&c=d&...)
	 *
	 * @param query
	 *          the preformatted, properly encoded form data
	 * @return a content object to be useable for upload
	 */
	public static FormContent form(String query) {
		FormContent fc = new FormContent(query);
		return fc;
	}

	/**
	 * Create form content to be sent as multipart/form-data. Useful if you want to upload files or have tons of form data that looks really ugly in a URL.
	 *
	 *
	 */
	public static MultipartContent form(FormData... formData) {
		MultipartContent mc = new MultipartContent("form-data", formData);
		return mc;
	}

	/**
	 * Create a plain/text form data entry for a multipart form.
	 *
	 * @param name
	 *          the name of the control of the form
	 * @param plainTextValue
	 *          the plain text value
	 * @return the FormData part used in a multipart/form-data upload
	 */
	public static FormData data(String name, String plainTextValue) {
		return data(name, content(plainTextValue));
	}

	/**
	 * Create a form data entry for a multipart form with any kind of content type.
	 *
	 * @param name
	 *          the name of the control or variable in a form
	 * @param content
	 *          the content to send
	 * @return
	 */
	public static FormData data(String name, AbstractContent content) {
		return new FormData(name, content);
	}

	/**
	 * Create chunked data
	 *
	 * @param mime mime type
	 * @param stream stream to read content from
	 * @return
	 */
	public static ChunkedContent chunked(String mime, InputStream stream) {
		return new ChunkedContent(mime, stream);
	}

	// TODO more form data stuff

	/**
	 * Shortcut to URLEncoder.encode with UTF-8.
	 *
	 * @param unencodedString
	 *          the string to encode
	 * @return the URL encoded string, safe to be used in URLs
	 */
	public static String enc(String unencodedString) {
		try {
			return URLEncoder.encode(unencodedString, "UTF-8");
		} catch (UnsupportedEncodingException e) {
		} // UTF-8 is never unsupported
		return null;
	}

	/**
	 * Tell Resty to replace the specified content on the server, resulting in a PUT operation instead of a POST operation. Example use: r.json(uri, put(content("bubu")));
	 */
	public static AbstractContent put(Content someContent) {
		return new Replacement(someContent);
	}

	/**
	 * Tell Resty to delete the URL content on the server, resulting in a DELETE. Example use: r.json(uri,delete());
	 */
	public static AbstractContent delete() {
		return new Deletion();
	}

	/**
	 * Tell Resty to send the specified header with each request done on this instance. These headers will also be sent from any resource object returned by this instance. I.e. chained calls will carry
	 * over the headers r.json(url).json(get("some.path.to.a.url")); Multiple headers of the same type are not supported (yet).
	 *
	 * @deprecated
	 * @param aHeader
	 *          the header to send
	 * @param aValue
	 *          the value
	 */
	public void alwaysSend(String aHeader, String aValue) {
		getAdditionalHeaders().put(aHeader, aValue);
	}

	/**
	 * Tell Resty to send the specified header with each request done on this instance. These headers will also be sent from any resource object returned by this instance. I.e. chained calls will carry
	 * over the headers r.json(url).json(get("some.path.to.a.url")); Multiple headers of the same type are not supported (yet).
	 *
	 * @param aHeader
	 *          the header to send
	 * @param aValue
	 *          the value
	 */
	public void withHeader(String aHeader, String aValue) {
		getAdditionalHeaders().put(aHeader, aValue);
	}

	/**
	 * Don't send a header that was formely added in the alwaysSend method.
	 *
	 * @param aHeader
	 *          the header to remove
	 */
	public void dontSend(String aHeader) {
		getAdditionalHeaders().remove(aHeader);
	}

	protected Map<String, String> getAdditionalHeaders() {
		if (additionalHeaders == null) {
			additionalHeaders = new HashMap<String, String>();
		}
		return additionalHeaders;
	}

    /**
     * Defines the HttpsURLConnection's default SSLSocketFactory and HostnameVerifier so that all subsequence HttpsURLConnection instances
     * will trusts all certificates and accept all certificate hostnames.
     * <p/>
     * WARNING: Using this is dangerous as it bypasses most of what ssl certificates are made for. However, self-signed certificate, testing, and
     * domains with multiple sub-domains will not fail handshake verification when this setting is applied.
     */
    public static void ignoreAllCerts() {
        try {
            HttpsURLConnection.setDefaultSSLSocketFactory(TrustAllX509SocketFactory.getSSLSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(AllowAllHostnameVerifier.ALLOW_ALL_HOSTNAMES);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set 'Trust all' default SSL SocketFactory and Hostname Verifier", e);
        }
    }

    /** Set the proxy for this instance of Resty.
	 * Note, that the proxy settings will be carried over to Resty instances created by this instance only if you used
	 * new Resty(Option.proxy(...))!
	 *
	 * @param proxyhost name of the host
	 * @param proxyport port to be used
	 */
	public void setProxy(String proxyhost, int proxyport) {
		proxy = new java.net.Proxy(java.net.Proxy.Type.HTTP, new InetSocketAddress(proxyhost, proxyport));
	}

	/**
	 * Base class for Resty options. You can also create your own options.
	 * Override one of the apply methods to change an object like URLConnection before it is being used.
	 *
	 * @author beders
	 *
	 */
	abstract public static class Option {

		/** Override this to get access to the URLConnection before the actual connection is made.
		 * @param aConnection
		 */
		public void apply(URLConnection aConnection) {
		}

		/** Callback from Resty when the option is set on the Resty instance. Called before any connection is made.
		 * Override to set initial properties */
		public void init(Resty resty) {
		}

		/**
		 * Specify the connection timeout in milliseconds.
		 * Example: <code><pre> new Resty(Option.timeout(3000)); </pre></code>
		 * @see java.net.URLConnection#setConnectTimeout(int)
		 * @param t
		 *          the timeout
		 * @return
		 */
		public static Timeout timeout(int t) {
			return new Timeout(t);
		}

		/**
		 * Set a proxy (overrides standard proxy settings)
		 * @param aHostName the hostname to use
		 * @param aPortNumber the port number
		 */
		public static Proxy proxy(String aHostName, int aPortNumber) {
			return new Proxy(aHostName, aPortNumber);
		}
	}

	/** Option to set a timeout. Use the static timeout method for added convenience. */
	public static class Timeout extends Option {
		private int timeout;

		public Timeout(int t) {
			timeout = t;
		}

		@Override
		public void apply(URLConnection urlConnection) {
			urlConnection.setConnectTimeout(timeout);
		}

	}

	/** Option to set the proxy for a Resty instance.
	 */
	public static class Proxy extends Option {
		private String host;
		private int port;
		public Proxy(String aHost, int aPort) {
			host = aHost;
			port = aPort;
		}
		@Override
		public void init(Resty resty) {
			resty.setProxy(host,port);
		}
	}

}
