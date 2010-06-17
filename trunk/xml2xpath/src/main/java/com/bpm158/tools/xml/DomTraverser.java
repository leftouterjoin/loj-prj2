package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

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

		LinkedList<Node> q = new LinkedList<Node>();

		q.offer(root);

		// 全ノードをトラバースする
		while (!q.isEmpty()) {
			Node current = q.poll();

			// 現在のノードを処理する
			if (function.whenFound(current)) return function.get();

			// 子ノードをキューに積む
			List<Node> list = new ArrayList<Node>();
			NodeList nl = current.getChildNodes();
			for (int i = 0, size = nl.getLength(); i < size; i++)
				list.add(nl.item(i));
			q.addAll(0, list);
		}

		// 最後まで処理した
		return function.get();
	}
}
