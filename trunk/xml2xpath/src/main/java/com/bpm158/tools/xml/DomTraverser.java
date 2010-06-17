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
public class DomTraverser {

	/**
	 * テンプレートメソッド。<br>
	 * サブクラスでオーバーライドすることにより1つのノードが処理されるたびコールバック呼び出しされます。<br>
	 * 
	 * @param node 見つかったノード
	 * @return 処理を中断する場合 true
	 */
	public boolean found(Node node) {

		// 処理を中断する
		return true;
	}

	/**
	 * トラバースを開始します。<br>
	 * 
	 * @param root トラバースを開始するノード
	 * @return 最後まで処理した場合 ture
	 */
	public boolean start(Node root) {

		LinkedList<Node> q = new LinkedList<Node>();

		q.offer(root);

		// 全ノードをトラバースする
		while (!q.isEmpty()) {
			Node current = q.poll();

			// 現在のノードを処理する
			if (found(current)) return false;

			// 子ノードをキューに積む
			List<Node> list = new ArrayList<Node>();
			NodeList nl = current.getChildNodes();
			for (int i = 0, size = nl.getLength(); i < size; i++)
				list.add(nl.item(i));
			q.addAll(0, list);
		}

		// 最後まで処理した
		return true;
	}
}
