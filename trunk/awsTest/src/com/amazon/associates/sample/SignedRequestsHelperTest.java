package com.amazon.associates.sample;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.junit.Test;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class SignedRequestsHelperTest {
	@Test
	public void test1() throws MalformedURLException, Exception {
		Map<String, String> params = new HashMap<String, String>();
		params.put("Service", "AWSECommerceService");
		// params.put("Operation", "ItemSearch");
		// params.put("ResponseGroup", "Request,Medium");
		// params.put("Keywords", "人間失格");
		// params.put("SearchIndex", "Blended");

		// params.put("Operation", "ItemLookup");
		// params.put("ItemId", "4873114799");

		params.put("Operation", "ItemLookup");
		params.put("IdType", "ISBN");
		params.put("ItemId", "9784873114798");
		params.put("SearchIndex", "Books");
//		params.put("ResponseGroup", "SalesRank");
		params.put("ResponseGroup", "Medium");

		SignedRequestsHelper srh = new SignedRequestsHelper();
		String url = srh.sign(params);
		String content = getContent(new URL(url));

		System.out.println(content);

		parseResponse(content);
	}

	private static void parseResponse(String s)
			throws ParserConfigurationException, SAXException, IOException,
			XPathExpressionException {
		DocumentBuilder builder = DocumentBuilderFactory.newInstance()
				.newDocumentBuilder();
		Document doc = builder.parse(new InputSource(new StringReader(s)));
		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();

		System.out.println(xpath.evaluate("/ItemLookupResponse/Items/Item/ItemAttributes/ISBN", doc));
		System.out.println(xpath.evaluate("/ItemLookupResponse/Items/Item/ItemAttributes/Title", doc));
		System.out.println(xpath.evaluate("/ItemLookupResponse/Items/Item/SalesRank", doc));
	}

	private static String getContent(URL url) throws Exception {

		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");
		InputStream is = con.getInputStream();
		InputStreamReader isr = new InputStreamReader(is, "UTF-8");
		BufferedReader br = new BufferedReader(isr);
		StringBuffer buf = new StringBuffer();
		String s;
		while ((s = br.readLine()) != null) {
			buf.append(s);
			buf.append("\r\n");
		}

		br.close();
		con.disconnect();

		return buf.toString();
	}
}
