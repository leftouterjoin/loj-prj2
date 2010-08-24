package shopping;

import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.stream.StreamSource;
import javax.xml.transform.stream.StreamResult;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ItemSearchServlet extends HttpServlet {
	private static final String DEVELOPER_ID = "jrdxz33k";

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		try {
			// パラメータを取得
			String keyword = request.getParameter("keyword");
			if (keyword == null) {
				keyword = "";
			} else {
				keyword = new String(keyword.getBytes("UTF-8"), "UTF-8");
				// keyword = new String(keyword.getBytes("ISO-8859-1"),
				// "JISAutoDetect");
			}

			// XSL Transformerの作成
			TransformerFactory factory = TransformerFactory.newInstance();
			Transformer transformer = factory.newTransformer(new StreamSource(
					this.getServletContext().getRealPath(
							"WEB-INF/itemSearch.xsl")));

			transformer.setOutputProperty(OutputKeys.METHOD, "html");
			transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
			transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,
					"yes");
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			transformer.setParameter("keyword", keyword);

			// 入力ストリーム取得
			String requestPath = "http://api.rakuten.co.jp/rws/3.0/rest?"
					+ "developerId=" + URLEncoder.encode(DEVELOPER_ID, "UTF-8")
					+ "&operation=ItemSearch" + "&version=2010-08-05"
					+ "&keyword=" + URLEncoder.encode(keyword, "UTF-8")
					+ "&sort=%2BitemPrice";

			URL requestUrl = new URL(requestPath);
			URLConnection connection = requestUrl.openConnection();
			InputStream input = connection.getInputStream();
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					input, "UTF-8"));

			// XSLT処理
			transformer.transform(new StreamSource(reader), new StreamResult(
					response.getOutputStream()));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
