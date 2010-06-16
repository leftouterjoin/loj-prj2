package com.bpm158.tools.xml;

import java.util.LinkedList;
import java.util.List;

import org.w3c.dom.Node;

public class DomTraverser {

	public boolean found(Node node) {

		// 処理中断する
		return true;
	}

	public boolean traverseAllNodes(Node root) {

		LinkedList<Node> q = new LinkedList<Node>();
		q.offer(root);

		// 全ノードをtraverseする
		while (!q.isEmpty()) {
			Node current = q.poll();
			// 現在のノードを処理する
			if (found(current)) return false;
			// 子ノードをキューに積む
			List<Node> nodeList = DomUtils.sanitize(current.getChildNodes());
			q.addAll(0, nodeList);
		}

		// 最後まで処理した
		return true;
	}

}
