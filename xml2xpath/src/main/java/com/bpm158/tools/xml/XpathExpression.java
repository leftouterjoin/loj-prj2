package com.bpm158.tools.xml;

/**
 * xpath式とノード値の表現です。<br>
 */
public class XpathExpression implements Comparable<XpathExpression> {

	/** xpath */
	private String xpath;
	/** nodeValue */
	private String nodeValue;

	/**
	 * コンストラクタ
	 */
	public XpathExpression() {

	}

	/**
	 * インスタンス化と同時に初期化します。
	 * 
	 * @param xpath 設定するxpath
	 * @param nodeValue 設定するnodeValue
	 */
	public XpathExpression(	String xpath,
							String nodeValue) {

		this.xpath = xpath;
		this.nodeValue = nodeValue;
	}

	/**
	 * @return xpath
	 */
	public String getXpath() {

		return xpath;
	}

	/**
	 * @param xpath セットする xpath
	 */
	public void setXpath(String xpath) {

		this.xpath = xpath;
	}

	/**
	 * @return nodeValue
	 */
	public String getNodeValue() {

		return nodeValue;
	}

	/**
	 * @param nodeValue セットする nodeValue
	 */
	public void setNodeValue(String nodeValue) {

		this.nodeValue = nodeValue;
	}

	/*
	 * (非 Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {

		return "XpathExpression [nodeValue=" + nodeValue + ", xpath=" + xpath
			+ "]";
	}

	/*
	 * (非 Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {

		final int prime = 31;
		int result = 1;
		result = prime * result
			+ ((nodeValue == null) ? 0 : nodeValue.hashCode());
		result = prime * result + ((xpath == null) ? 0 : xpath.hashCode());
		return result;
	}

	/*
	 * (非 Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {

		if (this == obj) return true;
		if (obj == null) return false;
		if (getClass() != obj.getClass()) return false;
		XpathExpression other = (XpathExpression) obj;
		if (nodeValue == null) {
			if (other.nodeValue != null) return false;
		} else if (!nodeValue.equals(other.nodeValue)) return false;
		if (xpath == null) {
			if (other.xpath != null) return false;
		} else if (!xpath.equals(other.xpath)) return false;
		return true;
	}

	@Override
	public int compareTo(XpathExpression o) {

		int diff = 0;

		if (o == null) throw new NullPointerException();

		if (this.getXpath() != null && o.getXpath() == null) return 1;
		if (this.getXpath() == null && o.getXpath() != null) return -1;
		if (this.getXpath() != null && o.getXpath() != null
			&& ((diff = this.getXpath().compareTo(o.getXpath())) != 0))
			return diff;

		if (this.getNodeValue() != null && o.getNodeValue() == null) return 1;
		if (this.getNodeValue() == null && o.getNodeValue() != null) return -1;
		if (this.getNodeValue() != null && o.getNodeValue() != null
			&& ((diff = this.getNodeValue().compareTo(o.getNodeValue())) != 0))
			return diff;

		return 0;
	}
}
