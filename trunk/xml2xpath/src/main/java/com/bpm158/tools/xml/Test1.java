package com.bpm158.tools.xml;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.Test;

public class Test1 {

	@Test
	public void test1() throws Exception {

//		InputStream is = new FileInputStream("./web.xml");
		InputStream is = new FileInputStream(
			"ChoiceStationMobileActionTest__perform_7.data.in.1.xml");

		LinkedHashMap<String, String> lhm = XpathMapper.toXpath(is, false);

		for (Map.Entry<String, String> e : lhm.entrySet()) {
			System.out.format("%s\t%s\n", e.getKey(), e.getValue());
		}
	}

}
