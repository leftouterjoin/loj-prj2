package com.amazon.associates.sample;

import java.io.IOException;

import org.cyberneko.html.parsers.DOMParser;
import org.junit.Test;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

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
		parser.parse("http://d.hatena.ne.jp/d-kami/");

		Document document = parser.getDocument();

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		XPathExpression expr = xpath
				.compile("//UL[@class='hatena-section']/LI");

		Object result = expr.evaluate(document, XPathConstants.NODESET);
		NodeList nodeList = (NodeList) result;

		for (int i = 0; i < nodeList.getLength(); i++) {
			Node node = nodeList.item(i);
			String title = xpath.evaluate("A/text()", node);
			System.out.println(title);
		}
	}
}
