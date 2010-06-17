package com.bpm158.tools.xml;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Stack;

import javax.xml.parsers.DocumentBuilderFactory;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class TraverserSample {

	int counter;

	@Test
	public void test1() throws Exception {

		InputStream is = new FileInputStream("./manyA.xml");
		Document document = DocumentBuilderFactory.newInstance()
			.newDocumentBuilder().parse(is);

		traverseByRecursive(document);
	}

	private void traverseByRecursive(Node node) {

		// �ړI�̏���
		System.out.format("%d nodeName=%s, nodeValue=%s\n", ++counter, node
			.getNodeName(), node.getNodeValue());

		// �q�v�f�̍ċA�Ăяo��
		NodeList nl = node.getChildNodes();
		for (int i = 0; i < nl.getLength(); i++)
			traverseByRecursive(nl.item(i));
	}

	@Test
	public void test2() throws Exception {

		InputStream is = new FileInputStream("./manyA.xml");
		Document document = DocumentBuilderFactory.newInstance()
			.newDocumentBuilder().parse(is);

		traverseByLifo(document);
	}

	private void traverseByLifo(Node node) {

		Stack<Node> stack = new Stack<Node>();
		stack.push(node);

		while (!stack.isEmpty()) {
			Node curNode = stack.pop();

			// �ړI�̏���
			System.out.format("%d nodeName=%s, nodeValue=%s\n", ++counter,
				curNode.getNodeName(), curNode.getNodeValue());

			// �q�v�f��stack�ɐς�
			NodeList nl = curNode.getChildNodes();
			for (int i = nl.getLength() - 1; 0 <= i; i--)
				stack.push(nl.item(i));
		}
	}
}
