package com.googlecode.loj.tools.xml;

import java.util.Stack;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Dom���g���[�o�X����e���v���[�g�ł��B<br>
 * �����t����{@link org.w3c.dom.Node#getChildNodes() org.w3c.dom.Node.getChildNodes()}�̏��Ɉ�v���܂��B<br>
 * 
 * @param <F> DomTraverserFunction�̎����N���X
 * @param <R> �������ʃN���X
 */
public class DomTraverser<F extends DomTraverserFunction<R>, R> {

	/** DomTraverserFunction */
	private F function;

	/**
	 * DomTraverserFunction�̎����N���X���w�肵�܂��B
	 * 
	 * @param function DomTraverserFunction�̎����N���X�̃C���X�^���X
	 */
	public DomTraverser(F function) {

		this.function = function;
	}

	/**
	 * �g���o�[�X���܂��B<br>
	 * 
	 * @param root �g���o�[�X���J�n����m�[�h
	 * @return ��������
	 */
	public R traverse(Node root) {

		Stack<Node> stack = new Stack<Node>();
		stack.push(root);

		// �S�m�[�h���g���o�[�X����
		while (!stack.isEmpty()) {
			Node current = stack.pop();

			// ���݂̃m�[�h����������
			if (function.whenFoundNode(current))
				return function.whenDoneTraverse();

			// �q�m�[�h��stack�ɐς�
			NodeList nl = current.getChildNodes();
			for (int i = nl.getLength() - 1; 0 <= i; i--)
				stack.push(nl.item(i));
		}

		return function.whenDoneTraverse();
	}
}
