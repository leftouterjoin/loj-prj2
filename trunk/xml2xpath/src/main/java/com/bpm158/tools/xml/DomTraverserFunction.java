package com.bpm158.tools.xml;

import org.w3c.dom.Node;

/**
 * トラバース機能テンプレートです。<br>
 * 
 * @param <R> 処理結果クラス
 */
public interface DomTraverserFunction<R> {

	/**
	 * 1つのノードが処理されるたびコールバック呼び出しされます。<br>
	 * 
	 * @param node 見つかったノード
	 * @return 処理を中断する場合 true
	 */
	boolean whenFoundNode(Node node);

	/**
	 * トラバースの完了時に呼び出されます。<b>
	 * 
	 * @return 処理結果クラスのインスタンス
	 */
	R whenDoneTraverse();
}
