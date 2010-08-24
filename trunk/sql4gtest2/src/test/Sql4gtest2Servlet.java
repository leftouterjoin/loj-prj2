package test;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.logging.Logger;

import javax.servlet.http.*;

import org.h2.jdbc.JdbcSQLException;

import jp.littlesoft.sql4g.GAdministrator;
import jp.littlesoft.sql4g.GAdministrator.DatabaseNotFoundException;

@SuppressWarnings("serial")
public class Sql4gtest2Servlet extends HttpServlet {
	private static final Logger logger = Logger
			.getLogger(Sql4gtest2Servlet.class.getName());

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");

		PrintWriter pw = resp.getWriter();
		pw.println("Hello, world");
		try {
			try {
				new GAdministrator("DB1", "sa", "sa", false);
			} catch (DatabaseNotFoundException e) {
				new GAdministrator("DB1", "sa", "sa", true);
			}

			Class.forName("jp.littlesoft.sql4g.Driver");
			Connection conn = DriverManager.getConnection("DB1", "sa", "sa");

			try {
				conn.prepareStatement("drop table t1").execute();
			} catch (JdbcSQLException e) {
			}

			conn.prepareStatement(
					"create table t1 (c1 number, c2 varchar(4000))").execute();
			PreparedStatement ps = conn
					.prepareStatement("insert into t1 values(?, ?)");

			logger.info("insert開始");

			final int max = 10000;
			for (int i = 0; i < max; i++) {
				ps.setInt(1, i % 10);
				ps.setString(2, String.format("%1$050d", i));
				ps.executeUpdate();
			}

			logger.info(max + "件insert完了");

			conn.commit();

			logger.info("commit完了");

			// ps = conn.prepareStatement("select * from t1");
			// ResultSet rs = ps.executeQuery();
			// while (rs.next()) {
			// pw.println(rs.getInt(1) + ", " + rs.getString(2));
			// pw.flush();
			// }
			logger.info("select開始");

			ps = conn
					.prepareStatement("select c1, count(*) cnt from t1 group by c1");
			ResultSet rs = ps.executeQuery();

			logger.info("select完了");

			while (rs.next()) {
				pw.println(rs.getInt(1) + ", " + rs.getString(2));
				pw.flush();
			}

		} catch (Exception e) {
			logger.warning(e.getMessage());
		}
	}
}
