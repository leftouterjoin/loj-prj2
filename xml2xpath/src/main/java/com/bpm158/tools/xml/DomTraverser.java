package com.bpm158.tools.xml;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class DomTraverser {

	public boolean found(Node node) {

		// 処理を中断する
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
