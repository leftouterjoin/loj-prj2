package sample5;

import com.web2driver.abaron.service.AbaronServiceBaseUnit;
/**
 * 例外をスローするサンプル
 * スローする例外はcom.web2driver.abaron.service.AbaronGeneralExceptionクラス
 * を継承する必要があります。
 *
 *(extends AbaronServiceBaseServlet とすればサーブレットになります。)
 */
public class ExceptionTestService extends AbaronServiceBaseUnit{

    public ExceptionTestServiceOutput doExecute(ExceptionTestServiceInput in) throws TestException{
        ExceptionTestServiceOutput out=null;
        
        //trueにすると明示的に自作の例外をスローします。
        //falseにすると実行時にNullPointerExceptionがスローされます。
        if(false){
            throw new TestException("0","ErrorMessage");
        }
        //変数outにはオブジェクト参照が設定されていないため、com.web2driver.abaron.service.AbaronGeneralExceptionとなります。
        out.setProduct(in.getNum1()*in.getNum2());
        return out;
    }
}
