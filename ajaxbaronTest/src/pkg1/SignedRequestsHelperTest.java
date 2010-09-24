package pkg1;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;

import org.junit.Test;

import com.web2driver.abaron.client.AbaronRESTClient;
import com.web2driver.abaron.client.AbaronResultNode;

public class SignedRequestsHelperTest {

	public void doRequest(String urlString) {
		try {
			URL url = new URL(urlString);
			URLConnection uc = url.openConnection();
			uc.setDoOutput(true);// POST可能にする

			uc.setRequestProperty("User-Agent", "@IT java-tips URLConnection");// ヘッダを設定
			uc.setRequestProperty("Accept-Language", "ja");// ヘッダを設定
			// OutputStream os = uc.getOutputStream();// POST用のOutputStreamを取得
			//
			// String postStr = "foo1=bar1&foo2=bar2";// POSTするデータ
			// PrintStream ps = new PrintStream(os);
			// ps.print(postStr);// データをPOSTする
			// ps.close();

			InputStream is = uc.getInputStream();// POSTした結果を取得
			BufferedReader reader = new BufferedReader(
					new InputStreamReader(is));
			String s;
			while ((s = reader.readLine()) != null) {
				System.out.println(s);
			}
			reader.close();
		} catch (MalformedURLException e) {
			System.err.println("Invalid URL format: " + urlString);
			System.exit(-1);
		} catch (IOException e) {
			System.err.println("Can't connect to " + urlString);
			System.exit(-1);
		}
	}

	@Test
	public void test1() {
		String id = "dummy";
		String secretkey = "dummy";

		SignedRequestsHelper helper = new SignedRequestsHelper(id, secretkey);
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("Service", "AWSECommerceService");
		map.put("AWSAccessKeyId", id);

		map.put("Operation", "ItemSearch");
		map.put("SearchIndex", "Books");
		map.put("Keywords", "直観でわかる数学");

		// map.put("Operation", "ItemLookup");
		// map.put("ItemId", "4062145901");
		// map.put("ResponseGroup", "Small,Reviews");
		// map.put("Version", "2009-03-31");
		// map.put("ReviewPage", "" + "1");
		String request = helper.sign(map);
		doRequest(request);

		AbaronRESTClient restClient = new AbaronRESTClient();
		AbaronResultNode result = restClient.doRequest();
		System.out
				.println("住所:"
						+ result._("kml")._("Response").__("Placemark")[0]
								._("address"));
	}

	@Test
	public void test2() {
		String id = "";
		String secretkey = "G+";

		SignedRequestsHelper helper = new SignedRequestsHelper(id, secretkey);
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("Service", "AWSECommerceService");
		map.put("AWSAccessKeyId", id);

		map.put("Operation", "ItemLookup");
		map.put("ItemId", "4000056794");
		map.put("Condition", "Used");
		// map.put("ResponseGroup", "Small,Reviews");
		// map.put("Version", "2009-03-31");
		// map.put("ReviewPage", "" + "1");

		String request = helper.sign(map);
		doRequest(request);
	}
}
