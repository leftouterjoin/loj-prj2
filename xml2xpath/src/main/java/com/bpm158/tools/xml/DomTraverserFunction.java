package com.bpm158.tools.xml;

import org.w3c.dom.Node;

/**
 * Dom�g���[�o�X���̋@�\�e���v���[�g�ł��B<br>
 */
public interface DomTraverserFunction {

	/**
	 * �e���v���[�g���\�b�h�B<br>
	 * �T�u�N���X�ŃI�[�o�[���C�h���邱�Ƃɂ��1�̃m�[�h����������邽�уR�[���o�b�N�Ăяo������܂��B<br>
	 * 
	 * @param node ���������m�[�h
	 * @return �����𒆒f����ꍇ true
	 */
	boolean found(Node node);
}
