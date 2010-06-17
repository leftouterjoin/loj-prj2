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
public class DomTraverser {

	private DomTraverserFunction function;

	public DomTraverser(DomTraverserFunction function) {

		this.function = function;
	}

	/**
	 * �g���o�[�X���J�n���܂��B<br>
	 * 
	 * @param root �g���o�[�X���J�n����m�[�h
	 * @param function �m�[�h���o���̃t�@���N�V����
	 * @return �Ō�܂ŏ��������ꍇ ture
	 */
	public boolean traverse(Node root) {

		LinkedList<Node> q = new LinkedList<Node>();

		q.offer(root);

		// �S�m�[�h���g���o�[�X����
		while (!q.isEmpty()) {
			Node current = q.poll();

			// ���݂̃m�[�h����������
			if (function.found(current)) return false;

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
