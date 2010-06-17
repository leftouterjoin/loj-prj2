package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class DomTraverser {

	public boolean found(Node node) {

		// �����𒆒f����
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
			List<Node> list = new ArrayList<Node>();
			NodeList nl = current.getChildNodes();
			for (int i = 0, size = nl.getLength(); i < size; i++)
				list.add(nl.item(i));
			q.addAll(0, list);
		}

		// �Ō�܂ŏ�������
		return true;
	}
}
