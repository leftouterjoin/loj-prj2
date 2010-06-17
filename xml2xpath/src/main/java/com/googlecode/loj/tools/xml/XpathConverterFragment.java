package com.googlecode.loj.tools.xml;

import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Xpath変換機能の断片です。<br>
 */
public final class XpathConverterFragment {

	/**
	 * インスタンス化禁止
	 */
	private XpathConverterFragment() {

	}

	/**
	 * 対象外ノードか判定します。<br>
	 * 
	 * @param node ノード
	 * @return 無視する場合 true
	 */
	static boolean isIgnoreNode(Node node) {

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

	/**
	 * ノードのインデックスを計算します。<br>
	 * 
	 * @param node ノード
	 * @return インデックス
	 */
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

	/**
	 * xpathを求めます。<br>
	 * 
	 * @param node ノード
	 * @param inlineAttr 属性をインライン化するか否か
	 * @return xpath
	 */
	static String calculateXPath(	Node node,
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

	/**
	 * 属性を求めます。<br>
	 * 
	 * @param node ノード
	 * @return xpathの属性表現
	 */
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
