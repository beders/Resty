package de.monoid.web;

import java.io.IOException;
import java.net.Authenticator;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.MalformedURLException;
import java.net.URI;

import org.json.JSONObject;

import de.monoid.web.auth.RestyAuthenticator;

/**
 * Resty is a small, convenient interface to talk to RESTful services.
 * Its focus is on simplicity and ease-of-use, often requiring only two lines of code to access any web service.
 * It supports chaining several requests which is very useful in RESTful application employing HATEOS.
 * 
 * Basic usage is very simple: Create a Resty instance, use authenticate methode to add credentials, then call one of the content type specific methods.
 * The idea is that the method name will convey the expected content type you can then operate on.
 * 
 * Here is an example on how to use the geonames web service. It retrieves the json object (see json.org for details) and gets the name of a place from the zip code:
 * 
 * <code>
	Resty r = new Resty();
	Object name = r.json("http://ws.geonames.org/postalCodeLookupJSON?postalcode=66780&country=DE").get("postalcodes[0].placeName");
	assertEquals(name, "Rehlingen-Siersburg");
 * </code>
 * 
 * Resty supports complex path queries to navigate into a json object.
 * This is mainly used for extracting URIs to surf along a series of REST resources for web services following the HATEOS paradigm.
 * 
 * @author beders
 * @version 0.1 - basic GET and JSON support. basic JSONPath support
 */

public class Resty {
	static RestyAuthenticator rath = new RestyAuthenticator();
	static {
		// set up content handlers. note: this is not ideal as it might conflict with existing content factories
		System.setProperty("java.content.handler.pkgs", "de.monoid.web.content.handler");
		CookieHandler.setDefault(new CookieManager());
		Authenticator.setDefault(rath);
	}
	public Resty() {
		// no options
	}
	
	/** Register this root URI for authentication. Whenever a URL is requested that starts with this root,
	 * the credentials given are used for HTTP AUTH.
	 * Note that currently authentication information is shared across all Resty instances.
	 * This is due to the shortcomings of the java.net authentication mechanism.
	 * This might change should Resty adopt HttpClient and is the reason why this method is not a static one.
	 * 
	 * @param aSite the root URI of the site
	 * @param aLogin the login name
	 * @param aPwd the password. The array will not be internally copied. Whenever you null it, the password is gone within Resty
	 */
	public void authenticate(URI aSite, String aLogin, char[] aPwd) {
		rath.addSite(aSite, aLogin, aPwd);
	}

	public void authenticate(String string, String aLogin, char[] charArray) {
		authenticate(URI.create(string), aLogin, charArray);
	}
	
//	public JSONResource json(Object object) throws IOException {
//		if (object instanceof String) {
//			return json((String)object);
//		} else if (object instanceof URI) {
//			return json((URI)object);
//		}
//		throw new IOException("Can't convert object to an URI:" + object);
//	}
	
	/** 
	 * GET a URI given by string and parse the result as JSON.
	 * @param string - the string to use as URI
	 * @see Resty#json(URI) for more docs
	 */
	public JSONResource json(String string) throws IOException {
		return json(URI.create(string));
	}

	/** GET a URI and parse the result as JSON.
	 * JSONObject, part of the json.org libraries is used to represent the JSON.
	 * 
	 * @param anUri the URI to request
	 * @return the JSONObject, wrapped in a neat JSONResource
	 * @throws IOException
	 * @throws MalformedURLException
	 */
	public JSONResource json(URI anUri) throws IOException, MalformedURLException {
		JSONObject json = JSONObject.class.cast(anUri.toURL().openConnection().getContent());
		return new JSONResource(json);
	}
	
	public static JSONPathQuery path(String string) {
		return new JSONPathQuery(string);
	}

	

}
