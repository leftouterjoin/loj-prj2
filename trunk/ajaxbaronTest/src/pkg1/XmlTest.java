package pkg1;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

public class XmlTest {

	@Test
	public void test1() {
		try {
			// ===== XML 文書の読み込み =====
			DocumentBuilder builder = DocumentBuilderFactory.newInstance()
					.newDocumentBuilder();
			Document doc = builder.parse(new File("file.xml"));
			// ===== javax.xml.xpath.XPath を使う方法 =====
			// 準備
			XPathFactory factory = XPathFactory.newInstance();
			XPath xpath = factory.newXPath();
			// 単一ノード取得
			String location = "/test/t1/text/text()";
			System.out.println(xpath.evaluate(location, doc));
			// 複数ノード取得
			location = "//t1/t2[2]/text()";
			NodeList entries = (NodeList) xpath.evaluate(location, doc,
					XPathConstants.NODESET);
			for (int i = 0; i < entries.getLength(); i++) {
				System.out.println(entries.item(i).getNodeValue());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
