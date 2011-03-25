package com.amazon.associates.sample;

import java.io.IOException;
import java.util.Iterator;

import org.apache.xerces.stax.events.NamespaceImpl;
import org.cyberneko.html.parsers.DOMParser;
import org.junit.Test;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import javax.xml.namespace.NamespaceContext;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import javax.xml.xpath.XPathExpression;

public class HtmlParseTest {
	@Test
	public void test1() throws SAXException, IOException,
			XPathExpressionException {
		DOMParser parser = new DOMParser();
		parser.parse("https://www.oreilly.co.jp/ebook/");

		Document document = parser.getDocument();

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();

		xpath.setNamespaceContext(new NamespaceContext() {

			@Override
			public String getNamespaceURI(String arg0) {
				if (arg0.equals("x"))
					return "http://www.w3.org/1999/xhtml";
				return null;
			}

			@Override
			public String getPrefix(String arg0) {
				return null;
			}

			@Override
			public Iterator<String> getPrefixes(String arg0) {
				return null;
			}
		});

		XPathExpression expr = xpath.compile("//x:TABLE[@id='bookTable']//x:TD[@class='isbn']");

		Object result = expr.evaluate(document, XPathConstants.NODESET);
		NodeList nodeList = (NodeList) result;

		for (int i = 0; i < nodeList.getLength(); i++) {
			Node node = nodeList.item(i);
			String title = xpath.evaluate("text()",
					node);
			System.out.println(title);
		}
	}
}
