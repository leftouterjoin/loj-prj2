package com.googlecode.loj.tools.xml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Node;

/**
 * �g���o�[�X�@�\�̎����ł��B<br>
 * ������xpath�ɃC�����C�������܂��B<br>
 */
class XpathConverterWithAttrInline implements
									DomTraverserFunction<List<XpathExpression>> {

	/** ���O */
	private static final Log LOG = LogFactory
		.getLog(XpathConverterWithAttrInline.class);

	/** �������� */
	private List<XpathExpression> list = new ArrayList<XpathExpression>();

	@Override
	public boolean whenFoundNode(Node node) {

		if (XpathConverterFragment.isIgnoreNode(node)) {
			LOG.debug("ignored. " + node.getNodeName() + node.getNodeValue());
			return false;
		}

		String xpath = XpathConverterFragment.calculateXPath(node, true);
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
