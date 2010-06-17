package com.bpm158.tools.xml;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class XpathMapper {

	private static final Log LOG = LogFactory.getLog(XpathMapper.class);

	public static List<XpathExpression> toXpath(InputStream is,
												boolean fullFlat) {

		try {
			if (fullFlat) {
				return toXpathFullFlat(DomUtils.createDocumentBuilder().parse(
					is));
			} else {
				return toXpathIndexed(DomUtils.createDocumentBuilder()
					.parse(is));
			}
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static List<XpathExpression> toXpathFullFlat(Document document) {

		final List<XpathExpression> list = new ArrayList<XpathExpression>();

		new DomTraverser() {

			@Override
			public boolean found(Node node) {

				if (isIgnoreNode(node)) {
					LOG.debug("ignored. " + node.getNodeName()
						+ node.getNodeValue());
					return false;
				}

				String xpath = XpathMapper.calculateXPath(node, true);
				String value = (node.getNodeValue() == null) ? "" : node
					.getNodeValue().trim();
				list.add(new XpathExpression(xpath, value));

				return false;
			}
		}.start(document);

		return list;
	}

	public static List<XpathExpression> toXpathIndexed(Document document) {

		final List<XpathExpression> list = new ArrayList<XpathExpression>();

		new DomTraverser() {

			@Override
			public boolean found(Node node) {

				// 属性を編集する
				NamedNodeMap nnm = node.getAttributes();
				if (nnm != null) {
					String xpath = XpathMapper.calculateXPath(node, false);
					for (int i = 0; i < nnm.getLength(); i++) {
						Node n = nnm.item(i);
						String value = (n.getNodeValue() == null) ? "" : n
							.getNodeValue().trim();
						list.add(new XpathExpression(xpath + "/@"
							+ n.getNodeName(), value));
					}
				}

				// ボディを編集する
				if (isIgnoreNode(node)) {
					LOG.debug("ignored. " + node.getNodeName()
						+ node.getNodeValue());
					return false;
				}

				String xpath = XpathMapper.calculateXPath(node, false);
				String value = (node.getNodeValue() == null) ? "" : node
					.getNodeValue().trim();
				list.add(new XpathExpression(xpath, value));

				return false;
			}
		}.start(document);

		return list;
	}

	private static boolean isIgnoreNode(Node node) {

		if (node.getNodeType() == Node.COMMENT_NODE) {
			return true;
		}

		if (node.getNodeType() == Node.ELEMENT_NODE && !node.hasChildNodes()) {
			return false;
		}

		if (node.getNodeType() != Node.TEXT_NODE) {
			return true;
		}

		NodeList nl = node.getParentNode().getChildNodes();
		return (1 != nl.getLength());
	}

	private static int calculateNodeIndex(Node node) {

		int count = 1;
		NodeList nl = node.getParentNode().getChildNodes();

		for (int i = 0; i < nl.getLength(); i++) {
			if (nl.item(i).getNodeName().equals(node.getNodeName())) {
				if (nl.item(i) == node) {
					break;
				} else {
					count++;
				}
			}
		}

		return count;
	}

	private static String calculateXPath(	Node node,
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

}
