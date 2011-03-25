package com.amazon.associates.sample;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

//http://commons.apache.org/codec/download_codec.cgi
//... commons-codec-1.4.jar
//http://sourceforge.net/projects/nekohtml/
//... nekohtml.jar
//http://xerces.apache.org/#xerces2-j/
//... xercesImpl.jar
//... xml-apis.jar
public class EbookSalseRank {

	public static void main(String[] args) throws MalformedURLException,
			Exception {
		Map<String, String> params = new HashMap<String, String>();

		params.put("Service", "AWSECommerceService");
		params.put("Operation", "ItemLookup");
		params.put("IdType", "ISBN");
		params.put("SearchIndex", "Books");
		params.put("ResponseGroup", "Medium");

		SignedRequestsHelper srh = new SignedRequestsHelper();

		DocumentBuilder builder = DocumentBuilderFactory.newInstance()
				.newDocumentBuilder();

		List<Document> list = new ArrayList<Document>();

		for (String isbn : getIsbnList()) {
			params.put("ItemId", isbn);
			String content = getContent(new URL(srh.sign(params)));
			list.add(builder.parse(new InputSource(new StringReader(content))));
		}

		showList(list);
	}

	private static List<String> getIsbnList() throws SAXException, IOException,
			XPathExpressionException {
		DOMParser parser = new DOMParser();
		parser.parse("https://www.oreilly.co.jp/ebook/");

		Document document = parser.getDocument();

		XPathFactory factory = XPathFactory.newInstance();
		XPath xpath = factory.newXPath();

		xpath.setNamespaceContext(new NamespaceContext() {

			@Override
			public String getNamespaceURI(String arg0) {
				if (arg0.equals("x"))
					return "http://www.w3.org/1999/xhtml";
				return null;
			}

			@Override
			public String getPrefix(String arg0) {
				return null;
			}

			@Override
			public Iterator<String> getPrefixes(String arg0) {
				return null;
			}
		});

		XPathExpression expr = xpath
				.compile("//x:TABLE[@id='bookTable']//x:TD[@class='isbn']");

		NodeList nodeList = (NodeList) expr.evaluate(document, XPathConstants.NODESET);

		List<String> list = new ArrayList<String>();

		for (int i = 0; i < nodeList.getLength(); i++) {
			Node node = nodeList.item(i);
			list.add(xpath.evaluate("text()", node).replaceAll("-", ""));
		}

		return list;
	}

	private static String getContent(URL url) throws Exception {
		StringBuffer sb = new StringBuffer();
		HttpURLConnection con = null;
		BufferedReader br = null;
		try {
			con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			br = new BufferedReader(new InputStreamReader(con.getInputStream(),
					"UTF-8"));

			String s;
			while ((s = br.readLine()) != null) {
				sb.append(s);
				sb.append("\r\n");
			}
		} finally {
			if (br != null)
				br.close();
			if (con != null)
				con.disconnect();
		}

		return sb.toString();
	}

	private static void showList(List<Document> list)
			throws XPathExpressionException {
		XPathFactory factory = XPathFactory.newInstance();
		final XPath xpath = factory.newXPath();

		Document[] docs = list.toArray(new Document[list.size()]);
		Arrays.sort(docs, new Comparator<Document>() {
			@Override
			public int compare(final Document o1, final Document o2) {
				int i = 0;
				try {
					i = Integer.parseInt(xpath.evaluate(
							"/ItemLookupResponse/Items/Item/SalesRank", o1))
							- Integer.parseInt(xpath.evaluate(
									"/ItemLookupResponse/Items/Item/SalesRank",
									o2));
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
				return i;
			}
		});

		System.out.println("SalesRank |ISBN          |Title");
		System.out
				.println("----------+--------------+------------------------------");
		for (Document doc : docs)
			System.out
					.format("%10s| %13s| %s\n",
							xpath.evaluate(
									"/ItemLookupResponse/Items/Item/SalesRank",
									doc),
							xpath.evaluate(
									"/ItemLookupResponse/Items/Item/ItemAttributes/ISBN",
									doc),
							xpath.evaluate(
									"/ItemLookupResponse/Items/Item/ItemAttributes/Title",
									doc));
	}
}
