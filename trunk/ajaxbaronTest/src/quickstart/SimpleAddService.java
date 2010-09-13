package quickstart;


import com.web2driver.abaron.service.AbaronServiceBaseUnit;

/**
 * 「足し算」を実現するシンプルなサービス
 * 
 * (extends AbaronServiceBaseServlet とすればサーブレットになります。)
 */
public class SimpleAddService extends AbaronServiceBaseUnit {
   
    public OutputBean doExecute(InputBean in) {

        // 足し算の計算を行う
        int sum = in.getFirstValue() + in.getSecondValue();

        // 結果を出力用Beanを作って結果をセットする
        OutputBean outBean = new OutputBean();
        outBean.setSum(sum);

        return outBean;
    }
}
