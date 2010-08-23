package test;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;

import javax.servlet.http.*;

@SuppressWarnings("serial")
public class Sql4gtest2Servlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		try {
			test();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		resp.getWriter().println("Hello, world");
	}
	
	private void test() throws Exception {
		  // JDBCドライバーをロード
		  Class.forName("jp.littlesoft.sql4g.Driver");
		  // コネクションオブジェクトを取得
		  Connection conn = DriverManager.getConnection("MYSQL4G_DB", "SA", "password");
	}
}
