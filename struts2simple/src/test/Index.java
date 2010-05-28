package test;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.RequestAware;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.SessionAware;

public class Index implements RequestAware, SessionAware, ServletRequestAware{

	protected Map<String, Object> requestMap;
	protected Map<String, Object> sessionMap;
	protected HttpServletRequest request;
	
	@Override
	public void setRequest(Map<String, Object> arg0) {
		this.requestMap = arg0;
	}

	@Override
	public void setSession(Map<String, Object> arg0) {
		this.sessionMap = arg0;
	}

	@Override
	public void setServletRequest(HttpServletRequest arg0) {
		this.request = arg0;
	}
	
	public String execute() throws Exception {
		requestMap.put("MESSAGE", "こんにちは。" + request.getRemoteAddr());
		
		return "success";
	}
}

