package sample6;

import com.web2driver.abaron.service.AbaronServiceBaseUnit;

/**
 * 各種設定のサンプル
 * 
 * 1.「サービスクラス名.properties」ファイルでサービスクラスに関する設定を行います。
 * 2.「Abaron.properties」ファイルでAjaxBaronの動作に関する設定を行います。
 * （AjaxBaronの設定は同一クラスローダにロードされたサービスクラス全てに適用されます。）
 * 3.引数Beanで 「about+プロパティ名」となるメソッドでプロパティの説明を記述できます。
 * 4.スタンドアロンサーバAbaronServiceServerのsetDocumentRootメソッドでドキュメントルートを設定します。
 * 
 *(extends AbaronServiceBaseServlet とすればサーブレットになります。)
 */
public class ConfTestService extends AbaronServiceBaseUnit {

    public ConfTestServiceOutput doExecute(ConfTestServiceInput in) {
        
        ConfTestServiceOutput out=new ConfTestServiceOutput();
        
        out.setAnswer(in.getNum1()/in.getNum2());
        return out;
        
    }
}
