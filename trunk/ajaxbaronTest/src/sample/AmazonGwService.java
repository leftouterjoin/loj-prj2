package sample;

import java.util.Map;

import com.web2driver.abaron.service.AbaronContext;
import com.web2driver.abaron.service.AbaronGatewayBaseUnit;

public class AmazonGwService extends AbaronGatewayBaseUnit {

	    public String doExecute(Map parameterMap) {

	    	//parameterMapにはクエリパラメータが格納されます。パラメータに固定値を設定したい場合にはここでparameterMapを上書き設定することができます。
	        parameterMap.put("Service", new String[] { "AWSECommerceService" });
	        
	        //Amazonから取得済みの登録IDを指定します
	        parameterMap.put("AWSAccessKeyId", new String[] { "AKIAIPHM4QKK4E4Y4LZA" });
	        parameterMap.put("Signature", "");
	        //アフィリエイトを行いたい場合にはAmazonから取得済みのAmazonアソシエイトIDを指定します
//	        parameterMap.put("AssociateTag", new String[] { "onlineselects-22" });
	        
	        //resultXmlTextを加工すれば返信するXMLデータを変更することができます。
	        String resultXmlText=super.doExecute(parameterMap);

	        return resultXmlText;
	    }

	    public void initialize(AbaronContext abaronContext) {
	    	//ここに各種初期化処理を記述します。
	    }
}
