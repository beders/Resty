package us.monoid.web;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import us.monoid.json.JSONException;



/** Resource presentation for an XML document. 
 * You can access the XML as a DOM document. I know, DOM sucks, but you are free to change this class to support
 * your favorite XML parser.
 * 
 * What is not so sucky is access to the XML via XPath with the convenient get(...) methods.
 * 
 * @author beders
 *
 */
public class XMLResource extends TextResource {
	protected Document document;

	public XMLResource(Option... options) {
		super(options);
	}

	/** Return the DOM of the XML resource.
	 * 
	 * @return
	 * @throws IOException
	 */
	public Document doc() throws IOException {
		// if the stream has already been read, use the text format
		InputSource is;
		if (document == null) {
			if (text == null) {
				is = new InputSource(inputStream);
				is.setEncoding(getCharSet().name());
			} else {
				is = new InputSource(new StringReader(text));
			}
			try {
				document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
			} catch (SAXException e) {
				e.printStackTrace();
			} catch (ParserConfigurationException e) {
				e.printStackTrace();
			}
			inputStream.close();
		}
		return document;
	}
	
	/** Execute the given path query on the XML, GET the returned URI expecting JSON as content
	 * 
	 * @param path path to the URI to follow, must be a String QName result
	 * @return a new resource, as a result of getting it from the server in JSON format
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public JSONResource json(XPathQuery path) throws Exception {
		String uri = path.eval(this, String.class);
		return json(uri);
	}
	
	/** Execute the given path query on the XML, POST the returned URI expecting JSON
	 * 
	 * @param path path to the URI to follow, must be a String QName result
	 * @param aContent the content to POST 
	 * @return a new resource, as a result of getting it from the server in JSON format
	 * @throws Exception 
	 * @throws JSONException 
	 */
	public JSONResource json(XPathQuery path, Content aContent) throws Exception {
		String uri = path.eval(this, String.class);
		return json(uri, aContent);
	}

	/** Execute the given path query on the XML, GET the returned URI expecting text/* as content
	 * 
	 * @param path path to the URI to follow, must be a String QName result
	 * @return a new resource, as a result of getting it from the server in text format
	 * @throws Exception 
	 */
	public TextResource text(XPathQuery path) throws Exception {
		String uri = path.eval(this, String.class);
		return text(uri);
	}
	
	/** Execute the given path query on the XML, POST the returned URI expecting text/*
	 * 
	 * @param path path to the URI to follow, must be a String QName result
	 * @param aContent the content to POST 
	 * @return a new resource, as a result of getting it from the server in text format
	 * @throws Exception 
	 */
	public TextResource text(XPathQuery path, Content aContent) throws Exception {
		String uri = path.eval(this, String.class);
		return text(uri, aContent);
	}

	/** Execute the given path query on the XML, GET the returned URI expecting xml/* as content
	 * 
	 * @param path path to the URI to follow, must be a String QName result
	 * @return a new resource, as a result of getting it from the server in text format
	 * @throws Exception 
	 */
	public XMLResource xml(XPathQuery path) throws Exception {
		String uri = path.eval(this, String.class);
		return xml(uri);
	}
	
	/** Execute the given path query on the XML, POST the returned URI expecting XML
	 * 
	 * @param path path to the URI to follow, must be a String QName result
	 * @param aContent the content to POST 
	 * @return a new resource, as a result of getting it from the server in text format
	 * @throws Exception 
	 */
	public XMLResource xml(XPathQuery path, Content aContent) throws Exception {
		String uri = path.eval(this, String.class);
		return xml(uri, aContent);
	}

	
	/** Access the XML evaluating an XPath on it, returning the resulting NodeList.
	 * @throws Exception */
	public NodeList get(String xPath) throws Exception {
		XPathQuery xp = new XPathQuery(xPath);
		return xp.eval(this);
	}
	
	/** Access the XML evaluating an XPath on it, returning the resulting Object of the desired type
	 * Supported types are NodeList, String, Boolean, Double, Node. 
	 * @throws Exception */
	public <T> T get(String xPath, Class<T> returnType) throws Exception {
		XPathQuery xp = new XPathQuery(xPath);
		return xp.eval(this, returnType);
	}
	
	@Override
	public String getAcceptedTypes() {
		return "text/xml,application/xml,application/*+xml";
	}

}
