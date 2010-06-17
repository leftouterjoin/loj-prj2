package com.googlecode.loj.tools.xml;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * DOM����̔ėp�@�\�ł��B
 */
public final class DomUtils {

	/** ���O */
	private static final Log LOG = LogFactory.getLog(DomUtils.class);

	/**
	 * �C���X�^���X���֎~
	 */
	private DomUtils() {

	}

	/**
	 * DocumentBuilder���쐬���܂��B
	 * 
	 * @return DocumentBuilder �̃C���X�^���X
	 */
	public static DocumentBuilder createDocumentBuilder() {

		try {
			return DocumentBuilderFactory.newInstance().newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * xml�𕶎��񂩂�p�[�X���܂��B<br>
	 * 
	 * @param writer StringWriter
	 * @return Document�̃C���X�^���X
	 */
	public static Document parseString(StringWriter writer) {

		try {
			return createDocumentBuilder()
				.parse(
					new InputSource(new StringReader(writer.getBuffer()
						.toString())));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * xml��StringWriter����p�[�X���܂��B<br>
	 * 
	 * @param string xml������
	 * @return Document�̃C���X�^���X
	 */
	public static Document parseString(String string) {

		try {
			return createDocumentBuilder().parse(
				new InputSource(new StringReader(string)));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * xml���t�@�C������p�[�X���܂��B<br>
	 * 
	 * @param path xml�t�@�C���̃p�X
	 * @return Document�̃C���X�^���X
	 */
	public static Document parseFile(String path) {

		try {
			return createDocumentBuilder().parse(new File(path));
		} catch (SAXException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * �������㏑�����܂��B<br>
	 * 
	 * @param swappee �m�[�h
	 * @param name ������
	 * @param value �����l
	 * @return ���������m�[�h
	 */
	public static Document overwriteAttribute(	Node swappee,
												String name,
												String value) {

		Node parent = swappee.getParentNode();

		// �v�f���폜
		parent.removeChild(swappee);
		// �V�K�ɗv�f���쐬
		Element swapper = parent.getOwnerDocument().createElement(
			swappee.getNodeName());
		// ������ǉ�
		swapper.setAttribute(name, value);
		// �e�ɒǉ�
		parent.appendChild(swapper);
		// �q��ǉ�
		Node child = swappee.getFirstChild();
		while (child != null) {
			swapper.appendChild(child.cloneNode(true));
			child = child.getNextSibling();
		}

		return parent.getOwnerDocument();
	}

	/**
	 * xml�h�L�������g��xpath�Ŏw�肵���������㏑�����܂��B<br>
	 * 
	 * @param doc �h�L�������g
	 * @param xpathString xpath������
	 * @param name ������
	 * @param value �����l
	 * @return ���������h�L�������g
	 * @throws XPathExpressionException ��O
	 */
	public static Document overwriteAttributeByXpath(	Document doc,
														String xpathString,
														String name,
														String value) throws XPathExpressionException {

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		NodeList entries = (NodeList) xpath.evaluate(xpathString, doc,
			XPathConstants.NODESET);

		if (0 == entries.getLength()) {
			LOG.warn("�x��: xpath�Ŏw�肳�ꂽ�폜�Ώۃm�[�h��������܂���Bxpath:" + xpathString);
		} else {
			overwriteAttribute(entries.item(0), name, value);
		}

		return doc;
	}

	/**
	 * xml�h�L�������g��xpath�Ŏw�肵���������㏑�����܂��B<br>
	 * 
	 * @param doc �h�L�������g
	 * @param xpathString xpath������
	 * @return ���������h�L�������g
	 * @throws XPathExpressionException XPathExpressionException
	 */
	public static Document removeElement(	Document doc,
											String xpathString) throws XPathExpressionException {

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		NodeList entries = (NodeList) xpath.evaluate(xpathString, doc,
			XPathConstants.NODESET);

		if (0 == entries.getLength()) {
			LOG.warn("�x��: xpath�Ŏw�肳�ꂽ�폜�Ώۃm�[�h��������܂���Bxpath:" + xpathString);
		} else {
			for (int i = 0; i < entries.getLength(); i++) {
				Node item = entries.item(i);
				if (item.getNodeType() == Node.ATTRIBUTE_NODE) {
					((Attr) item).getOwnerElement().getAttributes()
						.removeNamedItem(item.getNodeName());
				} else {
					Node parent = item.getParentNode().removeChild(
						entries.item(i));
					int elemCount = parent.getChildNodes().getLength();
					if (1 < elemCount)
						LOG
							.warn("�x��: xpath�Ŏw�肳�ꂽ�폜�Ώۃm�[�h�ɕ����̎q�m�[�h�����݂��܂��Bxpath�͍ŏI�v�f�܂Ŏw�肵�Ă��������B"
								+ elemCount
								+ " �̗v�f����r�Ώۂ���폜����܂����B xpath:"
								+ xpathString);
				}
			}
		}

		return doc;
	}

	/**
	 * �m�[�h��xml������ɂ��ĕԂ��܂��B<br>
	 * 
	 * @param node �m�[�h
	 * @param encoding �G���R�[�h
	 * @return xml������
	 */
	public static String toXmlString(	Node node,
										String encoding) {

		try {
			TransformerFactory tfactory = TransformerFactory.newInstance();
			Transformer transformer = tfactory.newTransformer();

			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			transformer.transform(new DOMSource(node), new StreamResult(baos));

			return baos.toString(encoding);
		} catch (TransformerException e) {
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}
}
