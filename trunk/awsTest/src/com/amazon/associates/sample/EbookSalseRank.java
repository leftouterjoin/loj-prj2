package com.amazon.associates.sample;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;

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
		XPathFactory factory = XPathFactory.newInstance();
		final XPath xpath = factory.newXPath();

		List<Document> list = new ArrayList<Document>();

		for (String isbn : new String[] { "4873110505", "4873110610",
				"4873110637", "4873110785", "4873110793", "4873110998",
				"487311134X", "4873111471", "4873111544", "487311165X",
				"4873111714", "4873111811", "4873111978", "4873112125",
				"487311215X", "4873112222", "4873112265", "4873112281",
				"487311232X", "4873112346", "4873112354", "4873112370",
				"4873112389", "4873112435", "487311246X", "4873112516",
				"4873112524", "4873112540", "4873112567", "4873112575",
				"4873112664", "4873112680", "4873112702", "4873112729",
				"4873112737", "4873112753", "4873112796", "4873112818",
				"4873112826", "4873112842", "4873112850", "4873112869",
				"4873112885", "4873112893", "4873112907", "4873112915",
				"487311294X", "4873112990", "4873113008", "4873113024",
				"4873113032", "4873113059", "4873113067", "4873113075",
				"4873113083", "4873113091", "4873113105", "4873113113",
				"4873113121", "9784873112763", "9784873112770",
				"9784873113135", "9784873113159", "9784873113166",
				"9784873113173", "9784873113210", "9784873113234",
				"9784873113241", "9784873113258", "9784873113265",
				"9784873113272", "9784873113289", "9784873113296",
				"9784873113302", "9784873113319", "9784873113326",
				"9784873113333", "9784873113340", "9784873113364",
				"9784873113371", "9784873113418", "9784873113425",
				"9784873113432", "9784873113456", "9784873113463",
				"9784873113487", "9784873113494", "9784873113500",
				"9784873113524", "9784873113531", "9784873113548",
				"9784873113555", "9784873113562", "9784873113586",
				"9784873113593", "9784873113616", "9784873113623",
				"9784873113630", "9784873113654", "9784873113661",
				"9784873113678", "9784873113692", "9784873113708",
				"9784873113715", "9784873113722", "9784873113739",
				"9784873113746", "9784873113760", "9784873113814",
				"9784873113821", "9784873113838", "9784873113845",
				"9784873113852", "9784873113869", "9784873113876",
				"9784873113883", "9784873113890", "9784873113906",
				"9784873113913", "9784873113920", "9784873113937",
				"9784873113944", "9784873113951", "9784873113968",
				"9784873113975", "9784873113982", "9784873113999",
				"9784873114002", "9784873114026", "9784873114033",
				"9784873114101", "9784873114125", "9784873114132",
				"9784873114156", "9784873114163", "9784873114170",
				"9784873114194", "9784873114200", "9784873114224",
				"9784873114231", "9784873114248", "9784873114255",
				"9784873114262", "9784873114279", "9784873114286",
				"9784873114293", "9784873114309", "9784873114316",
				"9784873114323", "9784873114347", "9784873114354",
				"9784873114385", "9784873114408", "9784873114439",
				"9784873114446", "9784873114453", "9784873114460",
				"9784873114477", "9784873114507", "9784873114514",
				"9784873114521", "9784873114538", "9784873114569",
				"9784873114583", "9784873114590", "9784873114606",
				"9784873114620", "9784873114644", "9784873114651",
				"9784873114668", "9784873114675", "9784873114682",
				"9784873114699", "9784873114712", "9784873114729",
				"9784873114767", "9784873114774", "9784873114798" }) {
			params.put("ItemId", isbn);
			String content = getContent(new URL(srh.sign(params)));
			list.add(builder.parse(new InputSource(new StringReader(content))));
		}

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
		System.out.println("----------+--------------+------------------------------");
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
}
