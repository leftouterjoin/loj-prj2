package com.googlecode.loj.tools.xml;

import java.util.Stack;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Domをトラーバスするテンプレートです。<br>
 * 順序付けは{@link org.w3c.dom.Node#getChildNodes() org.w3c.dom.Node.getChildNodes()}の順に一致します。<br>
 * 
 * @param <F> DomTraverserFunctionの実装クラス
 * @param <R> 処理結果クラス
 */
public class DomTraverser<F extends DomTraverserFunction<R>, R> {

	/** DomTraverserFunction */
	private F function;

	/**
	 * DomTraverserFunctionの実装クラスを指定します。
	 * 
	 * @param function DomTraverserFunctionの実装クラスのインスタンス
	 */
	public DomTraverser(F function) {

		this.function = function;
	}

	/**
	 * トラバースします。<br>
	 * 
	 * @param root トラバースを開始するノード
	 * @return 処理結果
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

			// 子ノードをstackに積む
			NodeList nl = current.getChildNodes();
			for (int i = nl.getLength() - 1; 0 <= i; i--)
				stack.push(nl.item(i));
		}

		return function.whenDoneTraverse();
	}
}
