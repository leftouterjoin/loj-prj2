package com.bpm158.tools.xml;

import java.util.Stack;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Domをトラーバスするテンプレートです。<br>
 * 順序付けは{@link org.w3c.dom.Node#getChildNodes() org.w3c.dom.Node.getChildNodes()}の順に一致します。<br>
 */
public class DomTraverser<F extends DomTraverseFunction<R>, R> {

	private F function;

	public DomTraverser(F function) {

		this.function = function;
	}

	/**
	 * トラバースを開始します。<br>
	 * 
	 * @param root トラバースを開始するノード
	 * @return 最後まで処理した場合 ture
	 */
	public R traverse(Node root) {

		Stack<Node> stack = new Stack<Node>();
		stack.push(root);

		// 全ノードをトラバースする
		while (!stack.isEmpty()) {
			Node current = stack.pop();

			// 現在のノードを処理する
			if (function.whenFoundNode(current))
				return function.whenDoneTraverse();

			// 子ノードをキューに積む
			NodeList nl = current.getChildNodes();
			for (int i = nl.getLength() - 1; 0 <= i; i--)
				stack.push(nl.item(i));
		}

		// 最後まで処理した
		return function.whenDoneTraverse();
	}
}
