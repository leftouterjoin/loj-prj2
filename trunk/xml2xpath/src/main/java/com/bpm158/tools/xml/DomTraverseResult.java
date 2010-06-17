package com.bpm158.tools.xml;

/**
 * Domトラーバス結果テンプレートです。<br>
 * 
 * @param <T>
 */
public interface DomTraverseResult<T> {

	/**
	 * 処理結果の取得<br>
	 * 
	 * @return <T> 処理結果
	 */
	T get();
}
