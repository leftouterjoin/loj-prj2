package com.bpm158.tools.xml;

import java.util.LinkedList;
import java.util.List;

import org.w3c.dom.Node;

public class DomTraverser {

	public boolean found(Node node) {

		// �������f����
		return true;
	}

	public boolean traverseAllNodes(Node root) {

		LinkedList<Node> q = new LinkedList<Node>();
		q.offer(root);

		// �S�m�[�h��traverse����
		while (!q.isEmpty()) {
			Node current = q.poll();
			// ���݂̃m�[�h����������
			if (found(current)) return false;
			// �q�m�[�h���L���[�ɐς�
			List<Node> nodeList = DomUtils.sanitize(current.getChildNodes());
			q.addAll(0, nodeList);
		}

		// �Ō�܂ŏ�������
		return true;
	}

}
