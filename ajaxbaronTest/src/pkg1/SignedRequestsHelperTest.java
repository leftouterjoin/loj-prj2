package pkg1;

import java.util.HashMap;

import org.junit.Test;

public class SignedRequestsHelperTest {
	
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
		map.put("Keywords", "続 直観でわかる数学");
		
//		map.put("Operation", "ItemLookup");
//		map.put("ItemId", "4062145901");
//		map.put("ResponseGroup", "Small,Reviews");
//		map.put("Version", "2009-03-31");
//		map.put("ReviewPage", "" + "1");
		String request = helper.sign(map);
		System.out.println(request);
	}

	@Test
	public void test2() {
		String id = "AKIAIPHM4QKK4E4Y4LZA";
		String secretkey = "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";

		SignedRequestsHelper helper = new SignedRequestsHelper(id, secretkey);
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("Service", "AWSECommerceService");
		map.put("AWSAccessKeyId", id);
		
		map.put("Operation", "ItemLookup");
		map.put("ItemId", "4000056794");
		map.put("Condition", "Used");
//		map.put("ResponseGroup", "Small,Reviews");
//		map.put("Version", "2009-03-31");
//		map.put("ReviewPage", "" + "1");

		String request = helper.sign(map);
		System.out.println(request);
	}
}
