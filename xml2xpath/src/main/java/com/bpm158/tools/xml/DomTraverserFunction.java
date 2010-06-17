package com.bpm158.tools.xml;

import org.w3c.dom.Node;

/**
 * �g���o�[�X�@�\�e���v���[�g�ł��B<br>
 * 
 * @param <R> �������ʃN���X
 */
public interface DomTraverserFunction<R> {

	/**
	 * 1�̃m�[�h����������邽�уR�[���o�b�N�Ăяo������܂��B<br>
	 * 
	 * @param node ���������m�[�h
	 * @return �����𒆒f����ꍇ true
	 */
	boolean whenFoundNode(Node node);

	/**
	 * �g���o�[�X�̊������ɌĂяo����܂��B<b>
	 * 
	 * @return �������ʃN���X�̃C���X�^���X
	 */
	R whenDoneTraverse();
}
