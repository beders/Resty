package us.monoid.web;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.Authenticator;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URLConnection;
import java.net.URLEncoder;

import javax.xml.xpath.XPathException;

import us.monoid.json.JSONObject;
import us.monoid.web.auth.RestyAuthenticator;
import us.monoid.web.mime.MultipartContent;

/**
 * Main class. Use me! Use me! Resty is a small, convenient interface to talk to
 * RESTful services.
 * 
 * Basic usage is very simple: Create a Resty instance, use authenticate methode
 * to add credentials (optional), then call one of the content type specific
 * methods. The idea is that the method name will convey the expected content
 * type you can then operate on. 
 * Most static methods help you build content objects or queries with a compact syntax.
 * Static methods like put(...) and delete() are used to implement the respective HTTP methods.
 * 
 * A neat trick to save you typing is to use import static
 * us.monoid.web.Resty.*;
 * 
 * Here is an example on how to use the geonames web service. It retrieves the
 * json object (see json.org for details) and gets the name of a place from the
 * zip code:
 * 
 * <pre>
 * <code>
 * 	Resty r = new Resty();
 * 	Object name = r.json("http://ws.geonames.org/postalCodeLookupJSON?postalcode=66780&country=DE").get("postalcodes[0].placeName");
 * 	assertEquals(name, "Rehlingen-Siersburg");
 * </code>
 * </pre>
 * 
 * Resty supports complex path queries to navigate into a json object. This is
 * mainly used for extracting URIs to surf along a series of REST resources for
 * web services following the HATEOS paradigm.
 * 
 * Resty objects are not re-entrant.
 * 
 * @author beders
 * 
 */

public class Resty {
	protected static String MOZILLA = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
	protected static String DEFAULT_USER_AGENT = "Resty/0.1 (Java)";
	static RestyAuthenticator rath = new RestyAuthenticator();
	static {
		// set up content handlers. note: this is not ideal as it might conflict
		// with existing content factories
		// got rid of it: System.setProperty("java.content.handler.pkgs",
		// "us.monoid.web.content.handler");
		CookieHandler.setDefault(new CookieManager());
		Authenticator.setDefault(rath);
	}

	protected String userAgent = DEFAULT_USER_AGENT;

	/**
	 * Create a new instance without any options. Oh, ok, there are no options yet
	 * :)
	 */
	public Resty() {
		// no options
	}

	/**
	 * Register this root URI for authentication. Whenever a URL is requested that
	 * starts with this root, the credentials given are used for HTTP AUTH. Note
	 * that currently authentication information is shared across all Resty
	 * instances. This is due to the shortcomings of the java.net authentication
	 * mechanism. This might change should Resty adopt HttpClient and is the
	 * reason why this method is not a static one.
	 * 
	 * @param aSite
	 *          the root URI of the site
	 * @param aLogin
	 *          the login name
	 * @param aPwd
	 *          the password. The array will not be internally copied. Whenever
	 *          you null it, the password is gone within Resty
	 */
	public void authenticate(URI aSite, String aLogin, char[] aPwd) {
		rath.addSite(aSite, aLogin, aPwd);
	}

	/**
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
	 * Sets the User-Agent to identify as Mozilla/Firefox. Otherwise a Resty
	 * specific User-Agent is used
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
		return doGET(anUri, new JSONResource());
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
	 *           if uri is wrong or no connection could be made or for 10 zillion
	 *           other reasons
	 */
	public JSONResource json(URI anUri, AbstractContent requestContent) throws IOException {
		return doPOSTOrPUT(anUri, requestContent, new JSONResource());
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
	 *           if content type sent is not a plain text, if the connection could
	 *           not be made and gazillion other reasons
	 */
	public TextResource text(URI anUri) throws IOException {
		return doGET(anUri, new TextResource());
	}

	/**
	 * Get a plain text resource for the specified URI by POSTing to it.
	 * 
	 * @param anUri
	 *          the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException
	 *           if content type sent is not a plain text, if the connection could
	 *           not be made and gazillion other reasons
	 */
	public TextResource text(URI anUri, AbstractContent content) throws IOException {
		return doPOSTOrPUT(anUri, content, new TextResource());
	}

	/**
	 * Get a plain text resource for the specified URI.
	 * 
	 * @param anUri
	 *          the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException
	 *           if content type sent is not a plain text, if the connection could
	 *           not be made and gazillion other reasons
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
	 *           if content type sent is not a plain text, if the connection could
	 *           not be made and gazillion other reasons
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
		return doGET(anUri, new XMLResource());
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
	 *           if uri is wrong or no connection could be made or for 10 zillion
	 *           other reasons
	 */
	public XMLResource xml(URI anUri, AbstractContent requestContent) throws IOException {
		return doPOSTOrPUT(anUri, requestContent, new XMLResource());
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
		return doGET(anUri, new BinaryResource());
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
		return doPOSTOrPUT(anUri, someContent, new BinaryResource());
	}

	protected <T extends AbstractResource> T doGET(URI anUri, T resource) throws IOException {
		URLConnection con = openConnection(anUri, resource);
		return fillResourceFromURL(con, resource);
	}

	protected <T extends AbstractResource> T doPOSTOrPUT(URI anUri, AbstractContent requestContent, T resource)
			throws IOException {
		URLConnection con = openConnection(anUri,resource);
		requestContent.addContent(con);
		return fillResourceFromURL(con, resource);
	}
	
	protected <T extends AbstractResource> URLConnection openConnection(URI anUri, T resource)
			throws IOException, MalformedURLException {
		URLConnection con = anUri.toURL().openConnection();
		addStandardHeaders(con, resource);
		return con;
	}

	protected <T extends AbstractResource> void addStandardHeaders(URLConnection con, T resource) {
		con.setRequestProperty("User-Agent", userAgent);
		con.setRequestProperty("Accept", resource.getAcceptedTypes());
	}

	/**
	 * Get the content from the URLConnection, create a Resource representing the
	 * content and carry over some metadata like HTTP Result and location header.
	 * 
	 * @param <T extends AbstractResource> the resource that will be created and
	 *        filled
	 * @param con
	 *          the URLConnection used to get the data
	 * @param resourceClass
	 *          the resource class to instantiate
	 * @return the new resource
	 * @throws IOException
	 */
	protected <T extends AbstractResource> T fillResourceFromURL(URLConnection con, T resource)
			throws IOException {
		resource.fill(con);
		return resource;
	}

	/**
	 * Create a JSONPathQuery to extract data from a JSON object. This is usually
	 * used to extract a URI and use it in json|text|xml(JSONPathQuery...) methods
	 * of JSONResource. <code>
	 * Resty r = new Resty();
	 * r.json(someUrl).json(path("path.to.url.in.json"));
	 * </code>
	 * 
	 * @param string
	 * @return
	 */
	public static JSONPathQuery path(String string) {
		return new JSONPathQuery(string);
	}

	/**
	 * Create an XPathQuery to extract data from an XML document. This is usually
	 * used to extract a URI and use it in json|text|xml(XPathQuery...) methods.
	 * In this case, your XPath must result in a String value, i.e. it can't just
	 * extract an Element.
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
	 * Create a content object from JSON. Use this to POST the content to a URL.
	 * 
	 * @param someJson
	 *          the JSON to use
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
	 * Create a content object from plain text. Use this to POST the content to a
	 * URL.
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
	 * Create a content object from a byte array. Use this to POST the content to a
	 * URL with mime type application/octet-stream.
	 * 
	 * @param bytes the bytes to send
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
	
	/** Create form content to be sent as multipart/form-data. 
	 * Useful if you want to upload files or have tons of form data that looks really ugly in a URL.
	 *  
	 * 
	 */
	public static MultipartContent form(FormData... formData) {
		MultipartContent mc = new MultipartContent("form-data", formData);
		return mc;
	}
	
	/** Create a plain/text form data entry for a multipart form.
	 * 
	 * @param name the name of the control of the form
	 * @param plainTextValue the plain text value
	 * @return the FormData part used in a multipart/form-data upload
	 */
	public static FormData data(String name, String plainTextValue) {
		return data(name, content(plainTextValue));
	}
	
	/** Create a form data entry for a multipart form with any kind of content type.
	 * 
	 * @param name the name of the control or variable in a form
	 * @param content the content to send
	 * @return
	 */
	public static FormData data(String name, AbstractContent content) {
		return new FormData(name, content);
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
	
	/** Tell Resty to replace the specified content on the server, resulting in a PUT operation instead of a POST operation.
	 * Example use: r.json(uri, put(content("bubu")));
	 */
	public static AbstractContent put(Content someContent) {
		return new Replacement(someContent);
	}
	
	/** Tell Resty to delete the URL content on the server, resulting in a DELETE.
	 * Example use: r.json(uri,delete());
	 */
	public static AbstractContent delete() {
		return new Deletion();
	}

}
