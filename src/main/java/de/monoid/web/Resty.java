package de.monoid.web;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.Authenticator;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.URI;
import java.net.URLConnection;
import java.net.URLEncoder;

import javax.xml.xpath.XPathException;


import de.monoid.json.JSONObject;
import de.monoid.web.auth.RestyAuthenticator;

/**
 * Resty is a small, convenient interface to talk to RESTful services. Its focus
 * is on simplicity and ease-of-use, often requiring only two lines of code to
 * access any web service. It supports chaining several requests which is very
 * useful in RESTful application employing HATEOS.
 * 
 * Basic usage is very simple: Create a Resty instance, use authenticate methode
 * to add credentials, then call one of the content type specific methods. The
 * idea is that the method name will convey the expected content type you can
 * then operate on.
 * 
 * Here is an example on how to use the geonames web service. It retrieves the
 * json object (see json.org for details) and gets the name of a place from the
 * zip code:
 * 
 * <code>
	Resty r = new Resty();
	Object name = r.json("http://ws.geonames.org/postalCodeLookupJSON?postalcode=66780&country=DE").get("postalcodes[0].placeName");
	assertEquals(name, "Rehlingen-Siersburg");
 * </code>
 * 
 * Resty supports complex path queries to navigate into a json object. This is
 * mainly used for extracting URIs to surf along a series of REST resources for
 * web services following the HATEOS paradigm.
 * 
 * @author beders
 *
 */

public class Resty {
	protected static String MOZILLA = "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
	protected static String DEFAULT_USER_AGENT = "Resty 0.1 (Java)";
	static RestyAuthenticator rath = new RestyAuthenticator();
	static {
		// set up content handlers. note: this is not ideal as it might conflict
		// with existing content factories
		// got rid of it: System.setProperty("java.content.handler.pkgs", "de.monoid.web.content.handler");
		CookieHandler.setDefault(new CookieManager());
		Authenticator.setDefault(rath);
	}

	protected String userAgent = DEFAULT_USER_AGENT;

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

	public void authenticate(String string, String aLogin, char[] charArray) {
		authenticate(URI.create(string), aLogin, charArray);
	}

	/** Sets the User-Agent to identify as Mozilla/Firefox. Otherwise a Resty specific User-Agent is used */
	public void identifyAsMozilla() {
		userAgent = MOZILLA;
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
	public JSONResource json(URI anUri, Content requestContent) throws IOException {
		return doPOST(anUri, requestContent, new JSONResource());
	}

	/** @see Resty#json(URI, Content) */
	public JSONResource json(String anUri, Content content) throws IOException {
		return json(URI.create(anUri), content);
	}

	/** Get a plain text resource for the specified URI.
	 * 
	 * @param anUri the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(URI anUri) throws IOException {
		return doGET(anUri, new TextResource());
	}

	/** Get a plain text resource for the specified URI by POSTing to it.
	 * 
	 * @param anUri the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(URI anUri, Content content) throws IOException {
		return doPOST(anUri, content, new TextResource());
	}
	
	/** Get a plain text resource for the specified URI.
	 * 
	 * @param anUri the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(String anUri) throws IOException {
		return text(URI.create(anUri));
	}

	/** Get a plain text resource for the specified URI by POSTing to it.
	 * 
	 * @param anUri the URI to follow
	 * @return a plain text resource, if available
	 * @throws IOException if content type sent is not a plain text, if the connection could not be made and gazillion other reasons
	 */
	public TextResource text(String anUri, Content content) throws IOException {
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
	public XMLResource xml(URI anUri, Content requestContent) throws IOException {
		return doPOST(anUri, requestContent, new XMLResource());
	}

	/** @see Resty#xml(URI, Content) */
	public XMLResource xml(String anUri, Content content) throws IOException {
		return xml(URI.create(anUri), content);
	}
	
	/** Get the resource specified by the uri and return a binary resource for it.
	 * 
	 * @param anUri the uri to follow
	 * @return
	 * @throws IOException 
	 */
	public BinaryResource bytes(String anUri) throws IOException {
		return bytes(URI.create(anUri));
	}
	
	/** Get the resource specified by the uri and return a binary resource for it.
	 * 
	 * @param uri the uri to follow
	 * @return
	 * @throws IOException 
	 */
	public BinaryResource bytes(URI anUri) throws IOException {
		return doGET(anUri, new BinaryResource());
	}
	
	/** POST to the URI and get the resource as binary resource.
	 * 
	 * @param anUri the uri to follow
	 * @return
	 * @throws IOException 
	 */
	public BinaryResource bytes(String anUri, Content someContent) throws IOException {
		return bytes(URI.create(anUri), someContent);
	}
	
	/** POST to the URI and get the resource as binary resource.
	 * 
	 * @param uri the uri to follow
	 * @return
	 * @throws IOException 
	 */
	public BinaryResource bytes(URI anUri, Content someContent) throws IOException {
		return doPOST(anUri, someContent, new BinaryResource());
	}

	protected <T extends AbstractResource> T doGET(URI anUri, T resource) throws IOException {
		URLConnection con = anUri.toURL().openConnection();
		addStandardHeaders(con, resource);
	
		return fillResourceFromURL(con, resource);
	}

	protected <T extends AbstractResource> void addStandardHeaders(URLConnection con, T resource) {
		con.setRequestProperty("User-Agent", userAgent);
		con.setRequestProperty("Accept", resource.getAcceptedTypes());
	}

	protected <T extends AbstractResource> T doPOST(URI anUri, Content requestContent, T resource)
			throws IOException {
		URLConnection con = anUri.toURL().openConnection();
		requestContent.addContent(con);
		return fillResourceFromURL(con, resource);
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

	/** Create a JSONPathQuery to extract data from a JSON object. This is usually used to extract a URI
	 * and use it in json|text|xml(JSONPathQuery...) methods of JSONResource.
	 * <code>
	 * Resty r = new Resty();
	 * r.json(someUrl).json(path("path.to.url.in.json"));
	 * </code>
	 * @param string
	 * @return
	 */
	public static JSONPathQuery path(String string) {
		return new JSONPathQuery(string);
	}

	/** Create an XPathQuery to extract data from an XML document. This is usually used to extract a URI and use it
	 * in json|text|xml(XPathQuery...) methods.
	 * In this case, your XPath must result in a String value, i.e. it can't just extract an Element.
	 * @param anXPathExpression
	 * @return the query
	 * @throws XPathException
	 */
	public static XPathQuery xpath(String anXPathExpression) throws XPathException {
		return new XPathQuery(anXPathExpression);
	}
	
	public static Content content(JSONObject someJson) {
		Content c = null;
		try {
			c = new Content("application/json; charset=UTF-8", someJson.toString().getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) { /* UTF-8 is never unsupported */
		}
		return c;
	}

	public static Content content(String somePlainText) {
		Content c = null;
		try {
			c = new Content("text/plain; charset=UTF-8", somePlainText.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) { /* UTF-8 is never unsupported */
		}
		return c;
	}
	
	/** Create form content as application/x-www-form-urlencoded (i.e. a=b&c=d&...)
	 * 
	 * @param query the preformatted, properly encoded form data
	 * @return a content object to be useable for upload
	 */
	public static FormContent form(String query) {
		FormContent fc = new FormContent(query);
		return fc;
	}
	
	public static String enc(String unencodedString) {
		try {
			return URLEncoder.encode(unencodedString, "UTF-8");
		} catch (UnsupportedEncodingException e) {} // UTF-8 is never unsupported
		return null;
	}

}
