package sample5;

import com.web2driver.abaron.service.AbaronUserException;

public class TestException extends AbaronUserException {

    private String errMsg;
    private String errCode;
    
    public TestException(String code, String msg) {
        super();
        errCode = code;
        errMsg = msg;
    }
    public String getErrCode() {
        return errCode;
    }
    public void setErrCode(String errCode) {
        this.errCode = errCode;
    }
    public String getErrMsg() {
        return errMsg;
    }
    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }
    
}
