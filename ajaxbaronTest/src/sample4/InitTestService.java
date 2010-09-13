package sample4;

import com.web2driver.abaron.service.AbaronContext;
import com.web2driver.abaron.service.AbaronServiceBaseUnit;
/**
 * initializeメソッドのサンプル
 * サービスクラスがロードされた時点で initialize が呼び出されます。
 *
 *(extends AbaronServiceBaseServlet とすればサーブレットになります。)
 */
public class InitTestService extends AbaronServiceBaseUnit {

    private String[] message;

    public InitTestServiceOutput doExecute(InitTestServiceInput in) {
        int msgNum = in.getMsgNum();
        InitTestServiceOutput out = new InitTestServiceOutput();
        if (msgNum > 2) {
            msgNum = 2;
        }
        out.setMsg(this.message[msgNum]);
        return out;
    }

    public void initialize(AbaronContext context) {
    	//フィールド変数を初期化します。
    	this.message = new String[] { "hoge", "foo", "bar" };
    }
}
