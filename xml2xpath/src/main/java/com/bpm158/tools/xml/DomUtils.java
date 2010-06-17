package com.bpm158.tools.xml;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public final class DomUtils {

	private static final Log LOG = LogFactory.getLog(DomUtils.class);

	public static DocumentBuilder createDocumentBuilder() {

		try {
			return DocumentBuilderFactory.newInstance().newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			throw new RuntimeException(e);
		}
	}

	public static Document parseString(StringWriter writer) {

		try {
			return createDocumentBuilder()
				.parse(
					new InputSource(new StringReader(writer.getBuffer()
						.toString())));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static Document parseString(String string) {

		try {
			return createDocumentBuilder().parse(
				new InputSource(new StringReader(string)));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static Document parseFile(String path) {

		try {
			return createDocumentBuilder().parse(new File(path));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static Document overwriteAttribute(	Node swappee,
												String name,
												String value) {

		Node parent = swappee.getParentNode();

		// 要素を削除
		parent.removeChild(swappee);
		// 新規に要素を作成
		Element swapper = parent.getOwnerDocument().createElement(
			swappee.getNodeName());
		// 属性を追加
		swapper.setAttribute(name, value);
		// 親に追加
		parent.appendChild(swapper);
		// 子を追加
		Node child = swappee.getFirstChild();
		while (child != null) {
			swapper.appendChild(child.cloneNode(true));
			child = child.getNextSibling();
		}

		return parent.getOwnerDocument();
	}

	public static Document overwriteAttributeByXpath(	Document doc,
														String xpathString,
														String name,
														String value) throws XPathExpressionException {

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		NodeList entries = (NodeList) xpath.evaluate(xpathString, doc,
			XPathConstants.NODESET);

		if (0 == entries.getLength()) {
			LOG.warn("警告: xpathで指定された削除対象ノードが見つかりません。xpath:" + xpathString);
		} else {
			overwriteAttribute(entries.item(0), name, value);
		}

		return doc;
	}

	public static Document removeElement(	Document doc,
											String xpathString) throws XPathExpressionException {

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		NodeList entries = (NodeList) xpath.evaluate(xpathString, doc,
			XPathConstants.NODESET);

		if (0 == entries.getLength()) {
			LOG.warn("警告: xpathで指定された削除対象ノードが見つかりません。xpath:" + xpathString);
		} else {
			for (int i = 0; i < entries.getLength(); i++) {
				Node item = entries.item(i);
				if (item.getNodeType() == Node.ATTRIBUTE_NODE) {
					((Attr) item).getOwnerElement().getAttributes()
						.removeNamedItem(item.getNodeName());
				} else {
					Node parent = item.getParentNode().removeChild(
						entries.item(i));
					int elemCount = parent.getChildNodes().getLength();
					if (1 < elemCount)
						LOG
							.warn("警告: xpathで指定された削除対象ノードに複数の子ノードが存在します。xpathは最終要素まで指定してください。"
								+ elemCount
								+ " の要素が比較対象から削除されました。 xpath:"
								+ xpathString);
				}
			}
		}

		return doc;
	}

	public static String toXmlString(	Node node,
										String encoding) {

		try {
			TransformerFactory tfactory = TransformerFactory.newInstance();
			Transformer transformer = tfactory.newTransformer();

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			transformer.transform(new DOMSource(node), new StreamResult(baos));

			return baos.toString(encoding);
		} catch (TransformerException e) {
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}
}
