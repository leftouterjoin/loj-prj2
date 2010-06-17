package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

/**
 * �g���o�[�X�@�\�̎����ł��B<br>
 * �����͕ʂ�xpath�ɕ������܂��B<br>
 */
class XpathConverterWithSeparatedAttr
										implements
										DomTraverserFunction<List<XpathExpression>> {

	/** ���O */
	private static final Log LOG = LogFactory
		.getLog(XpathConverterWithSeparatedAttr.class);

	/** �������� */
	private List<XpathExpression> list = new ArrayList<XpathExpression>();

	@Override
	public boolean whenFoundNode(Node node) {

		// ������ҏW����
		NamedNodeMap nnm = node.getAttributes();
		if (nnm != null) {
			String xpath = XpathConverterFragment.calculateXPath(node, false);
			for (int i = 0; i < nnm.getLength(); i++) {
				Node n = nnm.item(i);
				String value = (n.getNodeValue() == null) ? "" : n
					.getNodeValue().trim();
				list.add(new XpathExpression(xpath + "/@" + n.getNodeName(),
					value));
			}
		}

		// �{�f�B��ҏW����
		if (XpathConverterFragment.isIgnoreNode(node)) {
			LOG.debug("ignored. " + node.getNodeName() + node.getNodeValue());
			return false;
		}

		String xpath = XpathConverterFragment.calculateXPath(node, false);
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