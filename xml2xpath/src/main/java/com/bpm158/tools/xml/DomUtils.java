package com.bpm158.tools.xml;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

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
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public final class DomUtils {

	private static final Log LOG = LogFactory.getLog(DomUtils.class);

	private static DocumentBuilderFactory domFactory;

	public static DocumentBuilderFactory getDomFactory() {

		if (domFactory == null) {
			domFactory = DocumentBuilderFactory.newInstance();
		}

		return domFactory;
	}

	public static DocumentBuilder createDocumentBuilder() {

		try {
			return getDomFactory().newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			throw new RuntimeException(e);
		}
	}

	public Document parseString(StringWriter writer) {

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

	protected Document parseFile(String path) {

		try {
			return createDocumentBuilder().parse(new File(path));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static List<Node> sanitize(NodeList nodes) {

		ArrayList<Node> list = new ArrayList<Node>();

		L1: for (int i = 0, size = nodes.getLength(); i < size; i++) {
			Node n = nodes.item(i);

			switch (n.getNodeType()) {
				case Node.TEXT_NODE:
					if (n.getNodeValue() != null) {
						list.add(n);
						continue L1;
					}
				case Node.COMMENT_NODE:
					LOG.info("ignored. " + n.getNodeName() + n.getNodeValue());
					continue L1;
				default:
					list.add(n);
			}
		}

		return list;
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
			System.err.println("警告: xpathで指定された削除対象ノードが見つかりません。xpath:"
				+ xpathString);
		} else {
			overwriteAttribute(entries.item(0), name, value);
		}

		return doc;
	}

	public static final Document removeElement(	Document doc,
												String xpathString) throws XPathExpressionException {

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		NodeList entries = (NodeList) xpath.evaluate(xpathString, doc,
			XPathConstants.NODESET);

		if (0 == entries.getLength()) {
			System.err.println("警告: xpathで指定された削除対象ノードが見つかりません。xpath:"
				+ xpathString);
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
						System.err
							.println("警告: xpathで指定された削除対象ノードに複数の子ノードが存在します。xpathは最終要素まで指定してください。"
								+ elemCount
								+ " の要素が比較対象から削除されました。 xpath:"
								+ xpathString);
				}
			}
		}

		return doc;
	}

	public static final String document2String(Node node) {

		try {
			TransformerFactory tfactory = TransformerFactory.newInstance();
			Transformer transformer = tfactory.newTransformer();

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			transformer.transform(new DOMSource(node), new StreamResult(baos));

			return baos.toString("utf-8");
		} catch (TransformerException e) {
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}

	private static int calculateNodeIndex(Node node) {

		int count = 1;
		NodeList nl = node.getParentNode().getChildNodes();
		for (int i = 0; i < nl.getLength(); i++) {
			if (nl.item(i).getNodeName().equals(node.getNodeName())) {
				// Found the right node?
				if (nl.item(i) == node) break;
				else {
					//System.out.println(nl.item(i));
					count++;
				}
			}
		}
		return count;
	}

	public static String calculateXPath(	Node node,
												boolean inlineAttr) {

		StringBuffer sb = new StringBuffer();

		while (node != null) {
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				String attr;
				if (inlineAttr && 0 < (attr = calculateAttr(node)).length()) {
					sb.insert(0, attr);
				} else {
					int count = calculateNodeIndex(node);
					sb.insert(0, "]");
					sb.insert(0, count);
					sb.insert(0, "[");
				}
				sb.insert(0, node.getNodeName());
				sb.insert(0, "/");
			}
			node = node.getParentNode();
		}

		return sb.toString();
	}

	private static String calculateAttr(Node node) {

		NamedNodeMap nnm = node.getAttributes();

		if (nnm == null) return "";

		StringBuffer sb = new StringBuffer();

		for (int i = 0; i < nnm.getLength(); i++) {
			sb.append("[@");
			Node n = nnm.item(i);
			sb.append(n.getNodeName());
			sb.append("='");
			sb.append(n.getNodeValue().trim());
			sb.append("']");
		}

		return sb.toString();
	}

	public static LinkedHashMap<String, String> toXpath(InputStream is,
														boolean fullFlat) {

		try {
			if (fullFlat) {
				return toXpathFullFlat(createDocumentBuilder().parse(is));
			} else {
				return toXpathIndexed(createDocumentBuilder().parse(is));
			}
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static LinkedHashMap<String, String> toXpathFullFlat(Document document) {

		final LinkedHashMap<String, String> list = new LinkedHashMap<String, String>();

		new DomTraverser() {

			@Override
			public boolean found(Node node) {

				if (isOutputNode(node)) {
					String xpath = calculateXPath(node, true);
					String value = (node.getNodeValue() == null) ? "" : node
						.getNodeValue().trim();
					if (list.containsKey(xpath))
						LOG.info("xpathの重複を検出。" + xpath);
					list.put(xpath, value);
				}

				return false;
			}
		}.traverseAllNodes(document);

		return list;
	}

	public static LinkedHashMap<String, String> toXpathIndexed(Document document) {

		final LinkedHashMap<String, String> list = new LinkedHashMap<String, String>();

		new DomTraverser() {

			@Override
			public boolean found(Node node) {

				// 属性を編集する
				NamedNodeMap nnm = node.getAttributes();
				if (nnm != null) {
					String xpath = calculateXPath(node, false);
					for (int i = nnm.getLength() - 1; 0 <= i; i--) {
						Node n = nnm.item(i);
						String value = (n.getNodeValue() == null) ? "" : n
							.getNodeValue().trim();
						xpath = xpath + "/@" + n.getNodeName();
						if (list.containsKey(xpath))
							LOG.info("xpathの重複を検出。" + xpath);
						list.put(xpath, value);
					}
				}

				// ボディを編集する
				if (isOutputNode(node)) {
					String xpath = calculateXPath(node, false);
					String value = (node.getNodeValue() == null) ? "" : node
						.getNodeValue().trim();
					if (list.containsKey(xpath))
						LOG.info("xpathの重複を検出。" + xpath);
					list.put(xpath, value);
				}

				return false;
			}
		}.traverseAllNodes(document);

		return list;
	}

	private static boolean isOutputNode(Node node) {

		if (node.getNodeType() == Node.ELEMENT_NODE && !node.hasChildNodes()) {
			return true;
		}

		if (node.getNodeType() != Node.TEXT_NODE) {
			return false;
		}

		NodeList nl = node.getParentNode().getChildNodes();
		return (1 == nl.getLength());
	}
}
