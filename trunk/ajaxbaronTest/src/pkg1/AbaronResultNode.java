package pkg1;

import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class AbaronResultNode {
	private Map h = new LinkedHashMap();
	private Map i = new HashMap();
	public String str;
	public String name;
	String a = "";
	String b = "";
	static final String c = "<";
	static final String d = ">";
	static final String e = "</";
	static final String f = ">";
	static final String g = "  ";

	static class Pp {
		public static void pp(List l) {
			for (Object v : l) {
				pp_(v);
			}
		}

		public static void pp(Map l) {
			Iterator<String> i = l.keySet().iterator();
			while (i.hasNext()) {
				String k = i.next();
				Object v = l.get(k);
				pp_(v);
			}
		}

		private static void pp_(Object v) {
			if (v instanceof List) {
				Pp.pp((List) v);
			} else if (v instanceof Map) {
				Pp.pp((Map) v);
			} else if (v instanceof AbaronResultNode) {
				AbaronResultNode a = (AbaronResultNode) v;
				Pp.pp((Map) a.h);
			} else {
				System.out.println(v);
			}
		}
	}

	public AbaronResultNode _(String paramString) {
		{
//			this.print();
//			Pp.pp(this.h);
		}
		ArrayList localArrayList = (ArrayList) this.h.get(paramString);
		AbaronResultNode localAbaronResultNode = null;
		if (localArrayList != null) {
			AbaronResultNode[] arrayOfAbaronResultNode = (AbaronResultNode[]) (AbaronResultNode[]) localArrayList
					.toArray(new AbaronResultNode[0]);
			localAbaronResultNode = arrayOfAbaronResultNode[0];
		} else {
			localAbaronResultNode = new AbaronResultNode();
		}
		return localAbaronResultNode;
	}

	public AbaronResultNode[] __(String paramString) {
		List localList = (List) this.h.get(paramString);
		Object localObject = null;
		if (localList != null) {
			AbaronResultNode[] arrayOfAbaronResultNode = (AbaronResultNode[]) (AbaronResultNode[]) localList
					.toArray(new AbaronResultNode[0]);
			localObject = arrayOfAbaronResultNode;
		} else {
			localObject = new AbaronResultNode[0];
		}
		return ((AbaronResultNode[]) localObject);
	}

	public String[] getChildElementNames() {
		Set localSet = this.h.keySet();
		String[] arrayOfString = (String[]) (String[]) localSet
				.toArray(new String[0]);
		return arrayOfString;
	}

	public String toString() {
		return this.str;
	}

	public void addChildXmlElement(String paramString,
			AbaronResultNode paramAbaronResultNode) {
		Object localObject = (List) this.h.get(paramString);
		if (localObject == null) {
			localObject = new ArrayList();
			this.h.put(paramString, localObject);
		}
		((List) localObject).add(paramAbaronResultNode);
	}

	public void print() {
		i(null, false);
	}

	public void print(boolean paramBoolean) {
		i(null, paramBoolean);
	}

	private void i(AbaronResultNode paramAbaronResultNode, boolean paramBoolean) {
		if (paramAbaronResultNode == null)
			paramAbaronResultNode = this;
		String[] arrayOfString = paramAbaronResultNode.getChildElementNames();
		for (int j = 0; j < arrayOfString.length; ++j) {
			AbaronResultNode[] arrayOfAbaronResultNode = paramAbaronResultNode
					.__(arrayOfString[j]);
			for (int k = 0; k < arrayOfAbaronResultNode.length; ++k) {
				AbaronResultNode localAbaronResultNode = arrayOfAbaronResultNode[k];
				AbaronResultNode tmp58_56 = localAbaronResultNode;
				tmp58_56.a = tmp58_56.a + paramAbaronResultNode.a + "  ";
				if (arrayOfAbaronResultNode.length > 1)
					localAbaronResultNode.b = paramAbaronResultNode.b
							+ ".__(\"" + localAbaronResultNode.name + "\")["
							+ k + "]";
				else
					localAbaronResultNode.b = paramAbaronResultNode.b + "._(\""
							+ localAbaronResultNode.name + "\")";
				System.out.print(paramAbaronResultNode.a + "<"
						+ localAbaronResultNode.name + ">");
				if (localAbaronResultNode.str != null) {
					System.out.print(localAbaronResultNode.str);
					System.out.print("</" + localAbaronResultNode.name + ">");
					if (paramBoolean)
						System.out.print("  --->  result"
								+ localAbaronResultNode.b);
					System.out.println();
				} else {
					if (paramBoolean)
						System.out.print("  --->  result"
								+ localAbaronResultNode.b);
					System.out.println();
					i(localAbaronResultNode, paramBoolean);
					System.out.print(paramAbaronResultNode.a);
					System.out.println("</" + localAbaronResultNode.name + ">");
				}
			}
		}
	}

	public String attr(String paramString) {
		String str1 = null;
		ArrayList localArrayList = (ArrayList) this.i.get(paramString);
		if (localArrayList == null)
			str1 = null;
		else
			str1 = (String) localArrayList.get(0);
		return str1;
	}

	public String[] attrValues(String paramString) {
		String[] arrayOfString = null;
		ArrayList localArrayList = (ArrayList) this.i.get(paramString);
		if (localArrayList == null)
			arrayOfString = new String[0];
		else
			arrayOfString = (String[]) (String[]) localArrayList
					.toArray(new String[0]);
		return arrayOfString;
	}

	public void addAttribute(String paramString1, String paramString2) {
		ArrayList localArrayList = (ArrayList) this.i.get(paramString1);
		if (localArrayList == null) {
			localArrayList = new ArrayList();
			this.i.put(paramString1, localArrayList);
		}
		localArrayList.add(paramString2);
	}
}
