package pkg1;

import java.util.HashMap;

import org.junit.Test;

public class AbaronRESTClientTest {
	@Test
	public void test1() {
		SignedRequestsHelper helper = new SignedRequestsHelper();
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("Service", "AWSECommerceService");

		map.put("Operation", "ItemSearch");
		map.put("SearchIndex", "Books");
		map.put("Keywords", "直観でわかる数学");

		String request = helper.sign(map);

		AbaronRESTClient stub = new AbaronRESTClient();

		stub.setEndpointUrl(request);

		// stub.setParameter("Service", "AWSECommerceService");

		AbaronResultNode result = stub.doRequest();

		System.out.println(result._("ItemSearchResponse").__("Items")[0]._(
				"Item")._("ItemAttributes")._("Title").str);
	}

}
