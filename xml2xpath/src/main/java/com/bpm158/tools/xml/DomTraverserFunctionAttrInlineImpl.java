package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Node;

class DomTraverserFunctionAttrInlineImpl
										implements
										DomTraverseFunction<List<XpathExpression>> {

	private static final Log LOG = LogFactory
		.getLog(DomTraverserFunctionAttrInlineImpl.class);

	private List<XpathExpression> list = new ArrayList<XpathExpression>();

	@Override
	public boolean whenFoundNode(Node node) {

		if (DomTraverseFunctionFragment.isIgnoreNode(node)) {
			LOG.debug("ignored. " + node.getNodeName() + node.getNodeValue());
			return false;
		}

		String xpath = DomTraverseFunctionFragment.calculateXPath(node, true);
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
