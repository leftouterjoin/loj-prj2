package pkg1;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;


public class AbaronRESTClient {
	private String a;
	private String b = "8080";
	private String c = "UTF8";
	private String d = "http";
	private String e;
	private Map f = new LinkedHashMap();

	public AbaronResultNode doRequest() {
		AbaronResultNode localAbaronResultNode = new AbaronResultNode();
		if (this.e != null) {
//			Document localDocument = k(l());
			Document localDocument = k(m(this.e));
			Element localElement = localDocument.getDocumentElement();
			i(localElement, null, localAbaronResultNode, null);
		}
		return localAbaronResultNode;
	}

	public AbaronResultNode doRequest(File paramFile) {
		AbaronResultNode localAbaronResultNode = new AbaronResultNode();
		Document localDocument = j(paramFile);
		Element localElement = localDocument.getDocumentElement();
		i(localElement, null, localAbaronResultNode, null);
		return localAbaronResultNode;
	}

	public AbaronResultNode doRequest(String paramString) {
		AbaronResultNode localAbaronResultNode = new AbaronResultNode();
		Document localDocument = k(m(paramString));
		Element localElement = localDocument.getDocumentElement();
		i(localElement, null, localAbaronResultNode, null);
		return localAbaronResultNode;
	}

	public void setRequestParameter(Map paramMap) {
		this.f = paramMap;
	}

	public void setParameter(String paramString1, String paramString2) {
		this.f.put(paramString1, new String[] { paramString2 });
	}

	public void setParameter(String paramString, String[] paramArrayOfString) {
		this.f.put(paramString, paramArrayOfString);
	}

	private boolean h(Node paramNode) {
		boolean i = false;
		for (int j = 0; j < paramNode.getChildNodes().getLength(); ++j) {
			Node localNode = paramNode.getChildNodes().item(j);
			if (localNode.getNodeType() != 1)
				continue;
			i = true;
			break;
		}
		return i;
	}

	private void i(Node paramNode1, Node paramNode2,
			AbaronResultNode paramAbaronResultNode1,
			AbaronResultNode paramAbaronResultNode2) {
		Object localObject1;
		int i;
		Object localObject2;
		Object localObject3;
		if (paramNode1.hasChildNodes()) {
			localObject1 = new AbaronResultNode();
			((AbaronResultNode) localObject1).name = paramNode1.getNodeName();
			NamedNodeMap localNamedNodeMap = paramNode1.getAttributes();
			i = localNamedNodeMap.getLength();
			if (i > 0)
				for (int j = 0; j < i; ++j) {
					Node localNode = localNamedNodeMap.item(j);
					((AbaronResultNode) localObject1).addAttribute(localNode
							.getNodeName(), localNode.getNodeValue());
				}
			if (h(paramNode1))
				paramAbaronResultNode1.addChildXmlElement(paramNode1
						.getNodeName(), (AbaronResultNode) localObject1);
			localObject2 = paramNode1.getChildNodes();
			for (int k = 0; k < ((NodeList) localObject2).getLength(); ++k) {
				localObject3 = ((NodeList) localObject2).item(k);
				i((Node) localObject3, paramNode1,
						(AbaronResultNode) localObject1, paramAbaronResultNode1);
			}
		} else {
			if (paramNode1.getNodeType() != 3)
				return;
			localObject1 = paramNode1.getNodeValue();
			char c1 = '\r';
			i = 10;
			localObject2 = String.valueOf(c1);
			String str1 = String.valueOf(i);
			localObject3 = ((String) localObject1).replace(" ", "");
			String str2 = ((String) localObject3).replace(str1, "");
			String str3 = str2.replace((CharSequence) localObject2, "");
			String str4 = str3;
			int l = str4.length();
			if (l <= 0)
				return;
			paramAbaronResultNode1.str = paramNode1.getNodeValue();
			paramAbaronResultNode2.addChildXmlElement(paramNode2.getNodeName(),
					paramAbaronResultNode1);
		}
	}

	private Document j(File paramFile) {
		Document localDocument = null;
		try {
			DocumentBuilderFactory localDocumentBuilderFactory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder localDocumentBuilder = localDocumentBuilderFactory
					.newDocumentBuilder();
			FileInputStream localFileInputStream = new FileInputStream(
					paramFile);
			localDocument = localDocumentBuilder.parse(localFileInputStream);
		} catch (Exception localException) {
			localException.printStackTrace();
		}
		return localDocument;
	}

	private Document k(String paramString) {
		Document localDocument = null;
		try {
			DocumentBuilderFactory localDocumentBuilderFactory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder localDocumentBuilder = localDocumentBuilderFactory
					.newDocumentBuilder();
			localDocument = localDocumentBuilder.parse(new InputSource(
					new StringReader(paramString)));
		} catch (Exception localException) {
			localException.printStackTrace();
		}
		return localDocument;
	}

	private String l() {
		String str1 = "";
		try {
			Set localSet = this.f.keySet();
			Iterator localIterator = localSet.iterator();
			StringBuffer localStringBuffer = new StringBuffer();
			while (localIterator.hasNext()) {
				String str2 = (String) localIterator.next();
				Object[] localObject = (String[]) (String[]) this.f.get(str2);
				if ((localObject != null) && (localObject.length > 0))
					for (int i = 0; i < localObject.length; ++i) {
						localStringBuffer.append(str2);
						localStringBuffer.append("=");
						localStringBuffer.append(URLEncoder.encode(
								(String) localObject[i], this.c));
						localStringBuffer.append("&");
					}
			}
			String str2 = localStringBuffer.toString();
			str2 = str2.substring(0, str2.length() - 1);
			Object localObject = this.e + "?" + str2;
			str1 = m((String) localObject);
		} catch (UnsupportedEncodingException localUnsupportedEncodingException) {
			localUnsupportedEncodingException.printStackTrace();
		}
		return ((String) str1);
	}

	private String m(String paramString) {
		String str1 = this.a;
		String str2 = this.b;
		String str3 = this.c;
		String str4 = this.d;
		int i = Integer.parseInt(str2);
		URL localURL = null;
		HttpURLConnection localHttpURLConnection = null;
		BufferedReader localBufferedReader = null;
		StringBuffer localStringBuffer = new StringBuffer("");
		try {
			if (str1 == null)
				localURL = new URL(paramString);
			else
				localURL = new URL(str4, str1, i, paramString);
			localHttpURLConnection = (HttpURLConnection) localURL
					.openConnection();
			localHttpURLConnection.setRequestMethod("GET");
			localBufferedReader = new BufferedReader(new InputStreamReader(
					localHttpURLConnection.getInputStream(), str3));
			String str5 = null;
			while ((str5 = localBufferedReader.readLine()) != null)
				localStringBuffer.append(str5);
			localBufferedReader.close();
			localHttpURLConnection.disconnect();
		} catch (Exception localException) {
			localException.printStackTrace();
		}
		return localStringBuffer.toString();
	}

	public String getEncoding() {
		return this.c;
	}

	public void setEncoding(String paramString) {
		this.c = paramString;
	}

	public String getProtocol() {
		return this.d;
	}

	public void setProtocol(String paramString) {
		this.d = paramString;
	}

	public String getProxyHost() {
		return this.a;
	}

	public void setProxyHost(String paramString) {
		this.a = paramString;
	}

	public String getProxyPort() {
		return this.b;
	}

	public void setProxyPort(String paramString) {
		this.b = paramString;
	}

	public String getEndpointUrl() {
		return this.e;
	}

	public void setEndpointUrl(String paramString) {
		this.e = paramString;
	}
}
