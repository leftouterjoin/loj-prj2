package com.bpm158.tools.xml;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

import org.junit.Test;
import org.w3c.dom.Document;

public class XpathMapperTest {

	@Test
	public void test1() throws Exception {

		InputStream is = new FileInputStream("./web.xml");
//		InputStream is = new FileInputStream(
//			"ChoiceStationMobileActionTest__perform_7.data.in.1.xml");

		Document document = DomUtils.createDocumentBuilder().parse(is);

		List<XpathExpression> list = new DomTraverser<XpathConverterWithSeparatedAttr, List<XpathExpression>>(
			new XpathConverterWithSeparatedAttr()).traverse(document);

		for (XpathExpression x : list) {
			System.out.format("%s\t%s\n", x.getXpath(), x.getNodeValue());
		}
	}

	@Test
	public void test2() throws Exception {

		InputStream is = new FileInputStream("./web.xml");
//		InputStream is = new FileInputStream(
//			"ChoiceStationMobileActionTest__perform_7.data.in.1.xml");

		Document document = DomUtils.createDocumentBuilder().parse(is);

		List<XpathExpression> list = new DomTraverser<XpathConverterWithAttrInline, List<XpathExpression>>(
			new XpathConverterWithAttrInline()).traverse(document);

		for (XpathExpression x : list) {
			System.out.format("%s\t%s\n", x.getXpath(), x.getNodeValue());
		}
	}

}
