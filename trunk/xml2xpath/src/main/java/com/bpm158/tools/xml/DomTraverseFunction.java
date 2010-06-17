package com.bpm158.tools.xml;

import org.w3c.dom.Node;

/**
 * Domトラーバス時の機能テンプレートです。<br>
 */
public interface DomTraverseFunction<R> {

	/**
	 * テンプレートメソッド。<br>
	 * サブクラスでオーバーライドすることにより1つのノードが処理されるたびコールバック呼び出しされます。<br>
	 * 
	 * @param node 見つかったノード
	 * @return 処理を中断する場合 true
	 */
	boolean whenNodeFound(Node node);

	R whenDoneTraverse();
}
