package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Dom���g���[�o�X����e���v���[�g�ł��B<br>
 * �����t����{@link org.w3c.dom.Node#getChildNodes() org.w3c.dom.Node.getChildNodes()}�̏��Ɉ�v���܂��B<br>
 */
public class DomTraverser<F extends DomTraverseFunction<R>, R> {

	private F function;

	public DomTraverser(F function) {

		this.function = function;
	}

	/**
	 * �g���o�[�X���J�n���܂��B<br>
	 * 
	 * @param root �g���o�[�X���J�n����m�[�h
	 * @return �Ō�܂ŏ��������ꍇ ture
	 */
	public R traverse(Node root) {

		LinkedList<Node> q = new LinkedList<Node>();

		q.offer(root);

		// �S�m�[�h���g���o�[�X����
		while (!q.isEmpty()) {
			Node current = q.poll();

			// ���݂̃m�[�h����������
			if (function.whenFound(current)) return function.get();

			// �q�m�[�h���L���[�ɐς�
			List<Node> list = new ArrayList<Node>();
			NodeList nl = current.getChildNodes();
			for (int i = 0, size = nl.getLength(); i < size; i++)
				list.add(nl.item(i));
			q.addAll(0, list);
		}

		// �Ō�܂ŏ�������
		return function.get();
	}
}
