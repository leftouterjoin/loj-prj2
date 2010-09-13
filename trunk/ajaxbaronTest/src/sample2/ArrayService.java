package sample2;

import com.web2driver.abaron.service.AbaronServiceBaseUnit;

/**
 * 配列を返すサンプル
 * 配列サイズcntのString型配列を返す
 * 
 * (extends AbaronServiceBaseServlet とすればサーブレットになります。)
 */
public class ArrayService extends AbaronServiceBaseUnit {
    public ArrayServiceOutput doExecute(ArrayServiceInput in) {

        int sizeOfArray = in.getCnt();
        String[] str = new String[sizeOfArray];
        for (int i = 0; i < sizeOfArray; i++) {
            str[i] = new String("Value" + i);
        }
        ArrayServiceOutput out = new ArrayServiceOutput();
        out.setValue(str);
        return out;
    }
}
