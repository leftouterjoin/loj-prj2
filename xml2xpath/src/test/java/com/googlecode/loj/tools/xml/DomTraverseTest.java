package com.googlecode.loj.tools.xml;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Stack;

import javax.xml.parsers.DocumentBuilderFactory;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * 再帰と非再帰のサンプル<br>
 * <br>
 * 木構造(ディレクトリやDOMツリーなど)をトラバースする際、再帰を使うと<br>
 * 簡単に実装ができる。<br>
 * <br>
 * でも、Java VMのデフォルトのスタックサイズは512KB。<br>
 * <br>
 * つまり、Java の考え方としては「ヒープを使え」と言っていいと思う。<br>
 * <br>
 * int m(int i)みたいなメソッドでも、10000回に満たない再帰呼び出しで<br>
 * java.lang.StackOverflowErrorがthrowされるらしい。<br>
 * <br>
 * ここでは例としてDOMツリーのトラバースを再帰、非再帰で実装してみる。<br>
 * <br>
 * 単純に再帰を非再帰にする方法はStackをヒープにとること(変な表現だけど間違<br>
 * いじゃない)。<br>
 * <br>
 * testRecursiveは3438回でjava.lang.StackOverflowErrorがthrowされた。<br>
 * testNonRecursiveは最後まで処理された。<br>
 * <br>
 */
public class DomTraverseTest {

	int counter;

	@Test
	public void testRecursive() throws Exception {

		InputStream is = new FileInputStream("./manyChild.xml");
		Document document = DocumentBuilderFactory.newInstance()
			.newDocumentBuilder().parse(is);

		traverseNodeByRecursive(document);
	}

	@Test
	public void testNonRecursive() throws Exception {

		InputStream is = new FileInputStream("./manyChild.xml");
		Document document = DocumentBuilderFactory.newInstance()
			.newDocumentBuilder().parse(is);

		traverseNodeByNonRecursive(document);
	}

	private void traverseNodeByRecursive(Node node) {

		// 目的の処理
		System.out.format("%d nodeName=%s, nodeValue=%s\n", ++counter, node
			.getNodeName(), node.getNodeValue());

		// 子要素の再帰呼び出し
		NodeList nl = node.getChildNodes();
		for (int i = 0; i < nl.getLength(); i++)
			traverseNodeByRecursive(nl.item(i));
	}

	private void traverseNodeByNonRecursive(Node node) {

		Stack<Node> stack = new Stack<Node>();
		stack.push(node);

		while (!stack.isEmpty()) {
			Node curNode = stack.pop();

			// 目的の処理
			System.out.format("%d nodeName=%s, nodeValue=%s\n", ++counter,
				curNode.getNodeName(), curNode.getNodeValue());

			// 子要素をstackに積む
			NodeList nl = curNode.getChildNodes();
			for (int i = nl.getLength() - 1; 0 <= i; i--)
				stack.push(nl.item(i));
		}
	}
}
