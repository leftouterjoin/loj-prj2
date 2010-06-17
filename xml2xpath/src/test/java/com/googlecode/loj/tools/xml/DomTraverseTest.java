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
 * �ċA�Ɣ�ċA�̃T���v��<br>
 * <br>
 * �؍\��(�f�B���N�g����DOM�c���[�Ȃ�)���g���o�[�X����ہA�ċA���g����<br>
 * �ȒP�Ɏ������ł���B<br>
 * <br>
 * �ł��AJava VM�̃f�t�H���g�̃X�^�b�N�T�C�Y��512KB�B<br>
 * <br>
 * �܂�AJava �̍l�����Ƃ��Ắu�q�[�v���g���v�ƌ����Ă����Ǝv���B<br>
 * <br>
 * int m(int i)�݂����ȃ��\�b�h�ł��A10000��ɖ����Ȃ��ċA�Ăяo����<br>
 * java.lang.StackOverflowError��throw�����炵���B<br>
 * <br>
 * �����ł͗�Ƃ���DOM�c���[�̃g���o�[�X���ċA�A��ċA�Ŏ������Ă݂�B<br>
 * <br>
 * �P���ɍċA���ċA�ɂ�����@��Stack���q�[�v�ɂƂ邱��(�ςȕ\�������ǊԈ�<br>
 * ������Ȃ�)�B<br>
 * <br>
 * testRecursive��3438���java.lang.StackOverflowError��throw���ꂽ�B<br>
 * testNonRecursive�͍Ō�܂ŏ������ꂽ�B<br>
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

		// �ړI�̏���
		System.out.format("%d nodeName=%s, nodeValue=%s\n", ++counter, node
			.getNodeName(), node.getNodeValue());

		// �q�v�f�̍ċA�Ăяo��
		NodeList nl = node.getChildNodes();
		for (int i = 0; i < nl.getLength(); i++)
			traverseNodeByRecursive(nl.item(i));
	}

	private void traverseNodeByNonRecursive(Node node) {

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
