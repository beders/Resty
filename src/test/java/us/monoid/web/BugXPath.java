/**
 * 
 */
package us.monoid.web;

import java.io.File;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * @author beders
 *
 */
public class BugXPath {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		XPathFactory factory = XPathFactory.newInstance();
		XPath xPath = factory.newXPath();
		XPathExpression xPathExpression = xPath.compile("/user/gender");
		Document parse = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new File("src/test/java/us/monoid/web/NewFile.xml"));
		NodeList evaluate = (NodeList) xPathExpression.evaluate(parse, XPathConstants.NODESET);
		//System.out.println(evaluate.getLength());
		//System.out.println(evaluate.equals(evaluate.item(0).getNodeValue()));
		System.out.println(evaluate.item(0).getTextContent());
	}

}
