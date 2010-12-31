package de.monoid.web;

import javax.xml.namespace.QName;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathException;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class XPathQuery extends PathQuery<XMLResource,NodeList> {
	protected XPathExpression xPathExpression;

	public XPathQuery(String anXPath) throws XPathException {
		XPathFactory factory = XPathFactory.newInstance();
		XPath xPath = factory.newXPath();
		xPathExpression = xPath.compile(anXPath);
	}

	private <T> QName getConstant(Class<T> aReturnType) {
		QName returnType = null;
		if (aReturnType == String.class) {
			returnType = XPathConstants.STRING;
		} else if (aReturnType == Boolean.class) {
			returnType = XPathConstants.BOOLEAN;
		} else if (aReturnType == Double.class) {
			returnType = XPathConstants.NUMBER;
		} else if (aReturnType == NodeList.class) {
			returnType = XPathConstants.NODESET;
		} else if (aReturnType == Node.class) {
			returnType = XPathConstants.NODE;
		} else throw new IllegalArgumentException("" + aReturnType + " is not supported as result of an XPath expression");
		return returnType;
	}

	/** Eval to a NodeList */
	@Override
	NodeList eval(XMLResource resource) throws Exception {
		NodeList retVal = (NodeList) xPathExpression.evaluate(resource.doc(), XPathConstants.NODESET);
		return retVal;
	}
	
	<T> T eval(XMLResource resource, Class<T>aReturnType) throws Exception {
		T retVal = (T) xPathExpression.evaluate(resource.doc(), getConstant(aReturnType));
		return retVal;
	}

}
