/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

/*
 * タブコンテナ tabcontainer.js
 *
 * [既知の問題]
 *    ・なし
 * 
 * @author LittleSoft Corporation
 * @version 1.0.0
 */
lsg.TabContainer = Class.create({

	/**
	 * オブジェクトの初期処理を行います。
	 *
	 * @method initialize
	 * @param  {String} id      オブジェクトID
	 * @param  {Array}  options オプション配列
	 */
	initialize: function(menu_id, container_id, options) {
		//オブジェクトID
		this.menu_id      = menu_id;
		this.container_id = container_id;
		//オブジェクトID
		this.menu      = $(this.menu_id);
		this.container = $(this.container_id);
		
		this.menu._lsUIWidget = this;
		this._currentStart = 0;
		//オプション
		this.options = Object.extend({
						 tabs       : ["タブ"]
						,defaultTab : 0
						,onTabClick : null
						,onBackPrev : null
						,onBeforeTabClick : this.onBeforeTabClick.bind(this)
						,maxRight   : 0
						}, options);
		if (this.options.tabs.length < (this.options.defaultTab + 1))
			throw('defaultTab setting error.');
		this.currentTab  = this.options.defaultTab;
		this.prevTab  = new Array();
		this.tabTitles   = new Array();
		this.tabContents = new Array();
		var contents = this.container.immediateDescendants(); 
		//タイトル追加
		var titleSrc = '';
		for (var i = 0; i < this.options.tabs.length; i++) {
			this.tabTitles.push(this.menu_id + '_title_' + i);
			if (i==this.currentTab) {
				titleSrc += '<div id="' + this.menu_id + '_title_' + i + '" _lstabidx="'+i+'" class="lsTabTitleForward" title="' + this.options.tabs[i] + '">'+this.options.tabs[i]+'</div>';
			}
			else {
				titleSrc += '<div id="' + this.menu_id + '_title_' + i + '" _lstabidx="'+i+'" class="lsTabTitleHide" title="' + this.options.tabs[i] + '">'+this.options.tabs[i]+'</div>';
			}
		}
		new Insertion.Top(this.menu, titleSrc);
		if (contents.length != this.options.tabs.length)
			throw('tab\'s count and content\'s count not match !!!');
		for (var i = 0; i < contents.length; i++) {
			var id = contents[i].getAttribute('id');
			var index = parseFloat(contents[i].getAttribute('_lstabidx'));
			if (id==null || id=='') {
				id = this.container_id + '_content_' + i;
				$(contents[i]).setAttribute('id', id);
			}
			this.tabContents[index] = id;
			if (i!=this.options.defaultTab) {
				$(id).hide();
			}
		}
		this._initializeSize(true);
	},
	doLayout: function() {
		this._initializeSize(false);
	},
	_initializeSize: function(setWidth) {
		if (setWidth) {
			var _w = 0;
			var _mh = 0;
			for (var i = 0; i < this.tabTitles.length; i++) {
				Event.observe($(this.tabTitles[i]), 'click', this._onBeforeClickTitle.bindAsEventListener(this));
				_w += $(this.tabTitles[i]).getWidth();
				_mh = $(this.tabTitles[i]).getHeight();
			}
			var _mw = document.viewport.getDimensions().width - this.menu.cumulativeOffset().left - this.options.maxRight;
			if (_w > _mw) {
				this.menu.setStyle({
					 'width' : (_mw + 'px')
				});
			}
			var _h = this.menu.getHeight();
			if (_h > _mh) {
				this.menu.setStyle({
					 'height' : (_mh + 'px')
				});
			}
		}
		var _containerW = this.menu.getWidth();
		var _tabsW = 0;
		var _containerNewW = 0;
		var _end = 0;
		for (var i = 0; i < this.tabTitles.length; i++) {
			var col = $(this.tabTitles[i]);
			if (i >= this._currentStart) {
				_tabsW += col.getWidth();
				if (_tabsW > _containerW) {
					col.hide();
				}
				else {
					col.show();
					_containerNewW += col.getWidth();
					_end = i;
				}
			}
			else {
				col.hide();
			}
		}
		var _start = this._currentStart;
		if (_tabsW <= _containerW && this._currentStart > 0) {
			for (var i = this._currentStart - 1; 0 <= i; i--) {
				var col = $(this.tabTitles[i]);
				_tabsW += col.getWidth();
				if (_tabsW > _containerW) {
					break;
				}
				else {
					col.show();
					_containerNewW += col.getWidth();
					_start = i;
				}
			}
		}
		this.menu.setStyle({
			 'width' : (_containerNewW + 'px')
		});
		this._currentStart = _start;
		this._currentEnd = _end;
		//if (setWidth) {
		//	if (this.currentTab < this._currentStart) {
		//		this.prev(true);
		//	}
		//	else if (this._currentEnd < this.currentTab) {
		//		this.next(true);
		//	}
		//}
	},
	
	onBeforeTabClick: function(event) {
		this.continueClick();
	},
	
	_onBeforeClickTitle: function(event) {
		var title = Event.element(event);
		this._waitIndex = parseFloat(title.getAttribute('_lstabidx'));
		this.options.onBeforeTabClick();
	},
	
	continueClick: function() {
		if (this._waitIndex == null) return; 
		this.prevTab.push(this.currentTab);
		$(this.tabContents[this.currentTab]).hide();
		this.currentTab = this._waitIndex;
		$(this.tabContents[this.currentTab]).show();
		this._move();
		this._waitIndex = null;
	},
	
	cancelClick: function() {
		this._waitIndex = null;
	},
	
	_onClickTitle: function(event) {
		var title = Event.element(event);
		this.prevTab.push(this.currentTab);
		$(this.tabContents[this.currentTab]).hide();
		this.currentTab = parseFloat(title.getAttribute('_lstabidx'));
		$(this.tabContents[this.currentTab]).show();
		this._move();
	},
	backPrevTab: function() {
		$(this.tabContents[this.currentTab]).hide();
		this.currentTab = this.prevTab.pop();
		$(this.tabContents[this.currentTab]).show();
		for (var i = 0; i < this.tabTitles.length; i++) {
			$(this.tabTitles[i]).addClassName('lsTabTitleHide');
			$(this.tabTitles[i]).removeClassName('lsTabTitleForward');
			if (this.currentTab == i) {
				$(this.tabTitles[i]).removeClassName('lsTabTitleHide');
				$(this.tabTitles[i]).addClassName('lsTabTitleForward');
			}
		}
		if (this.options.onBackPrev != null) {
			this.options.onBackPrev(this.currentTab);
		}
	},
	next: function(setWidth) {
		if (this._currentEnd == (this.tabTitles.length - 1)) return;
		var _setWidth = false;
		if (setWidth) _setWidth = true;
		this._currentStart++;
		if (this._currentStart == this.tabTitles.length) {
			this._currentStart--;
		}
		this._initializeSize(_setWidth);
	},
	prev: function(setWidth) {
		if (this._currentStart == 0) return;
		var _setWidth = false;
		if (setWidth) _setWidth = true;
		this._currentStart--;
		if (this._currentStart == -1) {
			this._currentStart = 0;
		}
		this._initializeSize(false);
	},
	updateContent: function(index, content) {
		$(this.tabContents[index]).update(content);
	},
	open: function(index) {
		$(this.tabContents[this.currentTab]).hide();
		this.currentTab = index;
		$(this.tabContents[this.currentTab]).show();
		this._move();
	},
	_move: function() {
		for (var i = 0; i < this.tabTitles.length; i++) {
			$(this.tabTitles[i]).addClassName('lsTabTitleHide');
			$(this.tabTitles[i]).removeClassName('lsTabTitleForward');
			if (this.currentTab == i) {
				$(this.tabTitles[i]).removeClassName('lsTabTitleHide');
				$(this.tabTitles[i]).addClassName('lsTabTitleForward');
			}
		}
		if (this.options.onTabClick != null) {
			this.options.onTabClick(this.currentTab);
		}
	},
	getTabIndex: function() {
		return this.currentTab;
	},
	isHidden: function() {
		return ((this._currentEnd - this._currentStart + 1)!=this.options.tabs.length);
	}
});