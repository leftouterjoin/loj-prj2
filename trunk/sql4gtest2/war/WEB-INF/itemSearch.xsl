<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:header="http://api.rakuten.co.jp/rws/rest/Header" xmlns:itemSearch="http://api.rakuten.co.jp/rws/rest/ItemSearch/2007-10-25">
<!-- パラメータ取得 -->
<xsl:param name="keyword" />
<xsl:template match="/">
<html>
<head>
<title>商品検索</title>
</head>
<body>
<form>
<input type="text" name="keyword" size="30" >
<xsl:attribute name="value">
<xsl:value-of select="$keyword" />
</xsl:attribute>
</input>
<input type="submit" name="submit" value="商品検索" />
</form>

<!-- ステータス取得 -->
<xsl:variable name="status" select="Response/header:Header/Status" />
<xsl:choose>
<xsl:when test="$status='Success'"> <!-- Successの場合 -->
<b>検索結果:<xsl:value-of select="Response/Body/itemSearch:ItemSearch/count" />件 
<xsl:value-of select="Response/Body/itemSearch:ItemSearch/page" />ページ目を表示</b> <br/>

<table border="0">
<!-- 商品毎にループ開始 -->
<xsl:for-each select="Response/Body/itemSearch:ItemSearch/Items/Item">
<tr>
<td>
<!-- 画像表示 -->
<img>
<xsl:attribute name="src">
<xsl:value-of select="smallImageUrl" />
</xsl:attribute>
</img>
</td>
<td>

<!-- 商品名表示 -->
<a>
<xsl:attribute name="href">
<xsl:value-of select="itemUrl" />
</xsl:attribute>
<xsl:value-of select="itemName" /><br/>
</a>
</td>
</tr>
</xsl:for-each>
<!-- 商品毎にループ終了 -->
</table>

</xsl:when>
<xsl:when test="$status='NotFound'">　<!-- NotFoundの場合 -->
商品は見つかりませんでした
</xsl:when>
<xsl:when test="$status='ClientError'"> <!-- ClientErrorの場合 -->
キーワードを入力してください
</xsl:when>
<xsl:when test="$status='ServerError'"> <!-- ServerErrorの場合 -->
サーバーエラーが発生しました
</xsl:when>
</xsl:choose>


</body>
</html>
</xsl:template>
</xsl:stylesheet>
