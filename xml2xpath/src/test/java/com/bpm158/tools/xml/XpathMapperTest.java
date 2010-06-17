package com.bpm158.tools.xml;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

import org.junit.Test;

public class XpathMapperTest {

	@Test
	public void test1() throws Exception {

		InputStream is = new FileInputStream("./web.xml");
//		InputStream is = new FileInputStream(
//			"ChoiceStationMobileActionTest__perform_7.data.in.1.xml");

		List<XpathExpression> list = XpathMapper.toXpath(is, false);

		for (XpathExpression x : list) {
			System.out.format("%s\t%s\n", x.getXpath(), x.getNodeValue());
		}
	}

}
