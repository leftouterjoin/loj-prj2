package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

class DomTraverserFunctionImpl implements
								DomTraverserFunction<List<XpathExpression>> {

	private static final Log LOG = LogFactory
		.getLog(DomTraverserFunctionImpl.class);

	private List<XpathExpression> list = new ArrayList<XpathExpression>();

	@Override
	public boolean whenFoundNode(Node node) {

		// 属性を編集する
		NamedNodeMap nnm = node.getAttributes();
		if (nnm != null) {
			String xpath = DomTraverserFunctionFragment.calculateXPath(node,
				false);
			for (int i = 0; i < nnm.getLength(); i++) {
				Node n = nnm.item(i);
				String value = (n.getNodeValue() == null) ? "" : n
					.getNodeValue().trim();
				list.add(new XpathExpression(xpath + "/@" + n.getNodeName(),
					value));
			}
		}

		// ボディを編集する
		if (DomTraverserFunctionFragment.isIgnoreNode(node)) {
			LOG.debug("ignored. " + node.getNodeName() + node.getNodeValue());
			return false;
		}

		String xpath = DomTraverserFunctionFragment.calculateXPath(node, false);
		String value = (node.getNodeValue() == null) ? "" : node.getNodeValue()
			.trim();
		list.add(new XpathExpression(xpath, value));

		return false;
	}

	@Override
	public List<XpathExpression> whenDoneTraverse() {

		return list;
	}

}
