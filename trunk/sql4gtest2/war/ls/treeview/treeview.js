/*
 *	Copyright (c) 2006-2010 LittleSoft Corporation
 *	http://www.littlesoft.jp/lsj/license.html
 */

/**
 * [LSJFramework JSコンポーネント]
 *    ・ツリービュー treeview.js
 *
 * [既知の課題]
 *	 ・ドラッグ時の下位置制限がうまくいかない（Floatingの高さがとれない）
 *   ・Drag時のIFRAMEを使用に無いようにしたがOKか？（IE6セレクトボックス対応でいれたはず…）
 * 
 * @author LittleSoft Corporation
 * @version 1.3.0
 */
ls.TreeViewInstance = {};
ls.TreeView = Class.create({

	/**
	 * オブジェクトの初期処理を行います。
	 *
	 * @method initialize
	 * @param {String} id オブジェクトID
	 * @param {Array} options オプション配列
	 */
	initialize: function(id, options) {
		this.id = id;
		ls.TreeViewInstance[this.id] = this;
		this.area = $(this.id);
		this.area._lsUIWidget = this;
		this.toggleOpenClassName  = 'lsTreeViewToggleOpen';
		this.toggleCloseClassName = 'lsTreeViewToggleClose';
		this.toggleLabelClassName = 'lsTreeViewToggleLabel';
		this.ItemClassName = 'lsTreeViewItem';
		this.options = Object.extend({
							onCollapse   : function(){},
							onExpand     : function(){},
							onBeforeMove : function(){return true;},
							onAfterMove  : function(){},
							movable      : true,
							linkedTree   : new Array(),
							updateWrapper: null
						}, options);
		this.options.linkedTree.push(this.id);
		this._updateWrapper = (this.options.updateWrapper != null) ? $(this.options.updateWrapper) : this.area;
		this._seq = 0;
		this._toggleLabels = {};
		this._adjust(this.area, -1);
		this._isMove = null;
		// 移動可の場合は、フロートレイヤを追加
		this._floatingArea = null;
		this._floatingAreaDummy = null;
		if (this.options.movable) {
			new Insertion.Bottom(document.body,
				'<ul id="' + this.id + '_FloatingArea" style="display:none;" class="lsTreeViewFloatingArea"></ul>'+
				'<div id="' + this.id + '_FloatingAreaDummy" style="position:absolute;display:none;top:0px;left:0px;"></div>');
			this._floatingArea = $(this.id + '_FloatingArea');
			this._floatingAreaDummy = $(this.id + '_FloatingAreaDummy');
			//フロートレイヤの位置、サイズ設定
			this._floatingArea.setOpacity(0.6);
			this._floatingArea.setStyle({
						 'zIndex' : '9999'
			});
			this._floatingAreaDummy.setStyle({
						 'width' : (Element.getWidth(document.body) + 'px')
						,'height' : (Element.getHeight(document.body) + 'px')
						,'zIndex' : '9998'
			});
			// 移動イベント設定
			var eventTarget = window;
			if (Prototype.Browser.IE) eventTarget = window.document;
			Event.observe(eventTarget, "mousedown", this._onMouseDown.bindAsEventListener(this));
			Event.observe(eventTarget, "mousemove", this._onMouseMove.bindAsEventListener(this));
			Event.observe(eventTarget, "mouseup",	this._onMouseUp.bindAsEventListener(this));
		}
		// トグルクリックイベント設定
		this._areaClickHdl = this._onClick.bindAsEventListener(this);
		Event.observe(this.area, 'click', this._areaClickHdl);
	},

	doLayout: function() {
		if (this.options.movable) {
			this._floatingAreaDummy.setStyle({
					'width': (Element.getWidth(document.body) + 'px'),
					'height': (Element.getHeight(document.body) + 'px')
			});
		}
	},

	update: function(html) {
		this._updateWrapper.update(html);
		this._toggleLabels = {};
		Event.stopObserving(this.area, 'click', this._areaClickHdl);
		this.area = $(this.id);
		if (this.area) {
			Event.observe(this.area, 'click', this._areaClickHdl);
			this._adjust(this.area, -1);
		}
	},

	_onMouseDown: function(event) {
		// 発生エレメントがトグルで非ドラッグ状態の場合のみ
		if (this._isMove != null || this._isMoveWait != null) return;
		var toggle = Event.element(event);
		if (!this._isToggleLabel(toggle) && !this._isTreeViewItem(toggle)) return;
		//------------------
		// 複数ツリーの場合のイベント制御
		if (toggle.getAttribute('_treeid') != this.id) return;
		//------------------
		// 選択不可
		if (Prototype.Browser.IE) {
			document.body.onselectstart = function(e) { return false };
		}
		else {
			try { event.preventDefault(); } catch(e) {}
		}
		//フロートレイヤに選択要素を追加
		var parent;
		try {
			if (this._isToggleLabel(toggle)) {
				parent = toggle.parentNode.parentNode;
			}
			else if (this._isTreeViewItem(toggle)) {
				parent = toggle.parentNode;
			}
			if (parent.tagName.toLowerCase() != 'li') return;
		}
		catch (e) {
			throw(e);
		}
		new Insertion.Bottom(this._floatingArea, '<li>' + parent.innerHTML + '</li>');
		this._floatingArea.setStyle({
					 'top' : ((Event.pointerY(event || window.event)) + 'px')
					,'left' : ((Event.pointerX(event || window.event) + 10) + 'px')
		});
		//ドラッグ状態
		// ・id : 発生要素（ラベル）のID
		// ・lv : 発生要素（ラベル）の階層レベル
		// ・tid : 発生要素（ラベル）のツリーID
		this._isMove = {id:toggle.id, lv:parseInt(toggle.getAttribute('_lv')), tid:toggle.getOffsetParent().id};
	},

	_onMouseMove: function(event) {
		//ドラッグ状態の場合のみ
		if (this._isMove != null && this._isMoveWait == null) {
			// 自ラベル内の場合、終了
			if (this._withIn($(this._isMove.id), event) &&
				!this._floatingArea.visible()) {
				return;
			}
			document.body.style.cursor = 'pointer';
			//フロートレイヤを表示
			if (!this._floatingArea.visible()) {
				this._floatingArea.show();
				this._floatingAreaDummy.show();
			}
			//フロートレイヤの位置設定
			var posY = (Event.pointerY(event || window.event));
			var posX = (Event.pointerX(event || window.event));
			var _aco = Position.cumulativeOffset(this.area);
			//上＆左の制限
			//if (Prototype.Browser.IE && (posX % 2 == 1 || posY % 2 == 1 )) return;
			if (posX < 0) posX = 0;
			if (posY < 0) posY = 0;
			//右の制限
			var currentRight = posX + this._floatingArea.getWidth()+5;
			var maxRight = $(document.body).getWidth() - this._floatingArea.getWidth() - 5;
			if (posX > maxRight) posX = maxRight;
			//下の制限
			var currentBottom = posY + this._floatingArea.getHeight();
			var maxBottom = $(document.body).getHeight() - this._floatingArea.getHeight();
			if (posY > maxBottom) posY = maxBottom;
			this._floatingArea.setStyle({
						 'top' : (posY + 'px')
						,'left' : ((posX + 5) + 'px')
			});
			//選択状態（ラベル背景色）の設定
			var id;
			var labels = this._getAllToggleLabels();
			this._isSelected = false;
			for (id in labels) {
				var label = $(id);
				if (label) {
					var scrollPos = Element.Methods.cumulativeScrollOffset(label);
					if (this._withIn(label, event) && (this._isMove.id != id)) {
						if (this._checkMoveNode(id)) {
							label.addClassName('lsTreeViewToggleLabelSelected');
							this._isSelected = true;
						}
						else {
							label.removeClassName('lsTreeViewToggleLabelSelected');
						}
					}
					else {
						label.removeClassName('lsTreeViewToggleLabelSelected');
					}
				}
			}
		}
	},
	
	continueMove: function() {
		if (this._isMoveWait != null) {
			var inserted = false;
			var newTreeId;
			var id;
			var labels = this._getAllToggleLabels();
			var orgLabel, aftLabel;
			for (id in labels) {
				var label = $(id);
				newTreeId = label.getAttribute('_treeid');
				if (this._withInPos(label, this._cancelX, this._cancelY) && (this._isMoveWait.id != id)) {
					if (!this._checkMoveNode(id)) {
						break;
					}
					var removeParent;
					if (this._isToggleLabel($(this._isMoveWait.id))) {
						removeParent = $(this._isMoveWait.id).parentNode.parentNode;
					}
					else if (this._isTreeViewItem($(this._isMoveWait.id))) {
						removeParent = $(this._isMoveWait.id).parentNode;
					}
					var html = removeParent.innerHTML;
					orgLabel = $(removeParent.parentNode.parentNode).firstDescendant().firstDescendant().id;
					$(removeParent).remove();
					var addParent = label.parentNode.parentNode;
					var child;
					for (var i = 0; i < addParent.childNodes.length; i++) {
						child = addParent.childNodes[i];
						if(this._isList(child)) {
							new Insertion.Top(child, '<li>' + html + '</li>');
							aftLabel = $(child.parentNode).firstDescendant().firstDescendant().id;
							inserted = true;
							break;
						}
					}
					if (!inserted) {
						new Insertion.Bottom(addParent, '<ul><li>' + html + '</li></ul>');
						aftLabel = $(addParent).firstDescendant().firstDescendant().id;
						inserted = true;
					}
					break;
				}
			}
			for (id in this._toggleLabels) {
				$(id).removeClassName('lsTreeViewToggleLabelSelected');
			}
			if (inserted) {
				this._toggleLabels = {};
				this._adjust(this.area, -1);
				if (this.id != newTreeId) {
					var _nt = ls.TreeViewInstance[newTreeId];
					for (id in _nt._toggleLabels) {
						$(id).removeClassName('lsTreeViewToggleLabelSelected');
					}
					_nt._toggleLabels = {};
					_nt._adjust(_nt.area, -1);
				}
			}
			this._removeFloatAreaAll();
			if (inserted) {
				if (this.options.onAfterMove != null) {
					this.options.onAfterMove(this._isMoveWait.id, orgLabel, aftLabel);
				}
			}
		}
		this._moveReset();
	},

	cancelMove: function() {
		if (this._isMoveWait != null) {
			this._removeFloatAreaAll();
			var id;
			for (id in this._toggleLabels) {
				if($(id)) $(id).removeClassName('lsTreeViewToggleLabelSelected');
			}
		}
		this._moveReset();
	},

	_moveReset: function() {
		if (Prototype.Browser.IE) document.body.onselectstart = function(e) { return true };
		//ドラッグ状態
		this._cancelX = null;
		this._cancelY = null;
		this._isMove     = null;
		this._isMoveWait = null;
		this._isSelected = false;
	},

	_removeFloatAreaAll: function() {
		this._floatingArea.hide();
		this._floatingArea.update('');
		this._floatingAreaDummy.hide();
	},

	_removeFloatAreaDummy: function() {
		this._floatingAreaDummy.hide();
	},

	_onMouseUp: function(event) {
		//ドラッグ状態の場合
		if (this._isMove != null && this._isMoveWait == null) {
			// 自ラベル内、未選択状態の場合は終了
			if (this._withIn($(this._isMove.id), event) ||
				!this._floatingArea.visible() ||
				!this._isSelected) {
				this._removeFloatAreaAll();
				this._moveReset();
				return;
			}
			this._isMoveWait = this._isMove;
			this._cancelY = (Event.pointerY(event || window.event));
			this._cancelX = (Event.pointerX(event || window.event));
			var _exec = this.options.onBeforeMove();
			if (_exec == null) {
				// no imple
			}
			else if (_exec == true) {
				this.continueMove();
			}
			else if (_exec == false) {
				this.cancelMove();
			}
			this._removeFloatAreaDummy();
			if (Prototype.Browser.IE) document.body.onselectstart = function(e) { return true };
			this._isMove = null;
		}
		document.body.style.cursor = 'default';
	},

	_checkMoveNode: function (elementId) {
		var isDifferentNode = true;
		var _move = (this._isMoveWait != null) ? this._isMoveWait : this._isMove;
		//階層レベルが「移動ノード」＜「移動先ノード」
		var labels = this._getAllToggleLabels();
		if (_move.lv < labels[elementId].lv) {
			var node = labels[elementId];
			//「移動先ノード」からさかのぼって親ノードidを調べ、「移動ノード」と同じ場合は
			// 同一ノードとする
			while (true) {
				var pid = node.pid;
				if (pid == null || pid == '') break; //ルート
				if (pid == _move.id) {
					isDifferentNode = false;
					break;
				}
				node = labels[pid];
			}
		}
		//違うノードの場合[ true ]
		return isDifferentNode;
	},

	_withIn: function (element, event) {
		//画面スクロール位置
		var scrollPos = Element.Methods.cumulativeScrollOffset(element);
		//イベント発生位置
		var posY = (Event.pointerY(event || window.event));
		var posX = (Event.pointerX(event || window.event));
		//イベント発生位置が要素内の場合[ true ]
		return (Position.within(element, (posX + scrollPos.left), (posY + scrollPos.top)));
	},

	_withInPos: function (element, x, y) {
		var scrollPos = Element.Methods.cumulativeScrollOffset(element);
		return (Position.within(element, (x + scrollPos.left), (y + scrollPos.top)));
	},

	_getAllToggleLabels: function() {
		//連携先も含めたラベル配列
		var labels = {};
		for(var i = 0; i < this.options.linkedTree.length; i++) {
			labels = Object.extend(labels, ls.TreeViewInstance[this.options.linkedTree[i]]._toggleLabels);
		}
		return labels;
	},

	/**
	 * [ Private ] 引数で指定された要素直下の要素の表示／非表示を設定します。
	 *
	 * @method _adjust
	 * @param {Object} node 要素オブジェクト
	 */
	_adjust: function(node, level, parent) {
		var hide = false;
		var child;
		var lv = level + 1;
		var _id;
		for (var i = 0; i < node.childNodes.length; i++) {
			child = node.childNodes[i];
			if (this._isToggle(child)) {
			
				var toggleChileds = child.childNodes;
				for (var j = 0; j < toggleChileds.length; j++) {
					var _e = toggleChileds[j];
					if (this._isToggleLabel(_e)) {
						_id = _e.getAttribute('id');
						if (_id == null || _id == '') {
							_id = this.id + '_' + (this._seq++);
							_e.setAttribute('id', _id);
						}
						_e.setAttribute('_lv', lv);
						_e.setAttribute('_treeid', this.id);
						
						this._toggleLabels[_id] = {lv: lv, pid: parent};
					}
				}
			}
			else if (this._isTreeViewItem(child)) {
				var _e = $(child);
				_id = _e.getAttribute('id');
				if (_id == null || _id == '') {
					_id = this.id + '_' + (this._seq++);
					_e.setAttribute('id', _id);
				}
				_e.setAttribute('_lv', lv);
				_e.setAttribute('_treeid', this.id);
			}
			if (this._isCloseToggle(child)) {
				hide = true;
			}
		}
		for (var k = 0; k < node.childNodes.length; k++) {
			child = node.childNodes[k];
			if (this._isList(child)) {
				for (var x = 0; x < child.childNodes.length; x++) {
					if (this._isItem(child.childNodes[x])) {
						this._adjust(child.childNodes[x], lv, _id);
					}
				}
				if (hide == true) Element.Methods.hide(child);
			}
		}
	},

	/**
	 * [ Private ] ツリービューをクリックした際の処理を行います。
	 *
	 * @method _onClick
	 * @param {Object} event イベントオブジェクト
	 */
	_onClick: function(event) {
		var toggle = Event.element(event);
		if (this._isToggle(toggle)){
			var nodes = toggle.parentNode.childNodes;
			if (this._isCloseToggle(toggle)) {
				if (this.options.onExpand) this.options.onExpand(toggle.parentNode);
				toggle.removeClassName(this.toggleCloseClassName);
				toggle.addClassName(this.toggleOpenClassName);
			}
			else if (this._isOpenToggle(toggle)) {
				if (this.options.onCollapse) this.options.onCollapse(toggle.parentNode);
				toggle.removeClassName(this.toggleOpenClassName);
				toggle.addClassName(this.toggleCloseClassName);
			}
			for (var i = 0; i < nodes.length; i++) {
				this._doToggle(toggle, nodes[i]);
			}
		}
	},

	/**
	 * [ Private ] ツリーの展開、縮小を行います。
	 *
	 * @method _doToggle
	 * @param {Object} toggle トグル要素オブジェクト
	 * @param {Array} list 子要素オブジェクトの配列
	 */
	_doToggle: function(toggle, list) {
		if (this._isList(list)) {
			if (this._isCloseToggle(toggle)) {
				Element.Methods.hide(list);
			}
			else {
				Element.Methods.show(list);
			}
		}
	},

	/**
	 * [ Private ] 引数で指定された要素が「ul」または「ol」タグか否かを判定します。
	 *
	 * @method _isList
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} 「ul」または「ol」タグか否か
	 */
	_isList: function(element) {
		return (element.tagName == 'ul' || element.tagName == 'UL' || element.tagName == 'ol' || element.tagName == 'OL');
	},

	/**
	 * [ Private ] 引数で指定された要素が「li」タグか否かを判定します。
	 *
	 * @method _isItem
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} 「li」タグか否か
	 */
	_isItem: function(element) {
		return (element.tagName == 'li' || element.tagName == 'LI');
	},

	/**
	 * [ Private ] 引数で指定された要素がトグルか否かを判定します。
	 *
	 * @method _isToggle
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} トグルか否か
	 */
	_isToggle: function(element) {
		return (element.className == this.toggleOpenClassName || element.className == this.toggleCloseClassName);
	},

	/**
	 * [ Private ] 引数で指定された要素が開いた状態のトグルか否かを判定します。
	 *
	 * @method _isOpenToggle
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} 開いた状態のトグルか否か
	 */
	_isOpenToggle: function(element) {
		return (element.className == this.toggleOpenClassName);
	},

	/**
	 * [ Private ] 引数で指定された要素が閉じた状態のトグルか否かを判定します。
	 *
	 * @method _isCloseToggle
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} 閉じた状態のトグルか否か
	 */
	_isCloseToggle: function(element) {
		return (element.className == this.toggleCloseClassName);
	},

	/**
	 * [ Private ] 引数で指定された要素がトグルラベルか否かを判定します。
	 *
	 * @method _isToggleLabel
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} トグルラベルか否か
	 */
	_isToggleLabel: function(element) {
		return (element.className == this.toggleLabelClassName);
	},

	/**
	 * [ Private ] 引数で指定された要素がツリーアイテムか否かを判定します。
	 *
	 * @method _isTreeViewItem
	 * @param {Object} element 要素オブジェクト
	 * @return {Boolean} ツリーアイテムか否か
	 */
	_isTreeViewItem: function(element) {
		return (element.className == this.ItemClassName);
	}

});