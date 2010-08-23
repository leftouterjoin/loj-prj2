/*
 *	画面共通Javascript common.js
 *
 * [既知の問題]
 *    ・IE6/7でメニューの表示位置がおかしい。
 *    ・IE6/7でタブオープン時にObjectError。
 */

var menu, tab;

var menuTitle;

var tabMaxRight = 160;

var bottomFix = 32;

var tabTitle = [];

var resizeElement = [];

var userName = '磯野カツオ';

var groupName = '磯野家';

var currentDate = '';

var menuInfo = [
	 {title:'LSGroup ポータル',		link:'../portal/ls_groupware_portal.html'}
	,{title:'LSGroup スケジュール',	link:'../schedule/ls_groupware_schedule.html'}
	,{title:'LSGroup ワークフロー',	link:'../workflow/ls_groupware_workflow.html'}
	,{title:'LSGroup アンケート',	link:'../inquiries/ls_groupware_inquiries.html'}
//	,{title:'LSGroup Webメール'}
//	,{title:'LSGroup 掲示板'}
//	,{title:'LSGroup ライブラリ'}
];

var menuHeight = 185;

// window load 時の処理
Event.observe(document, 'dom:loaded', function() {
	if (ls.isMSIE6()) {
		bottomFix = bottomFix + 3;
	}
	// 今日の日付
	var _date = new Date();
	var _y = _date.getFullYear().toString();
	var _m = ((_date.getMonth() + 1) < 10) ? ('0' + (_date.getMonth() + 1)) : (_date.getMonth() + 1).toString();
	var _d = (_date.getDate() < 10) ? ('0' + _date.getDate()) : _date.getDate().toString();
	currentDate = (_y + '/' + _m + '/' + _d);
	// ヘッダ、フッタを追加
	if (!ls.isPopup()) {
		var _header =
			'	<div id="ls_header">' +
//			'		<a class="btn_back" href="javascript:void(0);" title="前の画面に戻る"></a>' +
			'		<div id="menu_container" class="menu_container">' +
			'			<span class="menu_text"id="menu_txt"></span>' +
			'			<span class="menu_btn" id="menu_btn" title="メニューを表示する"></span>' +
			'		</div>' +
			'		<a class="btn_ptab" href="javascript:void(0);" title="前のタブを表示する" onclick="tab.prev();"></a>' +
			'		<div id="main_tab_menu" class="lsTabMenu"></div>' +
			'		<a class="btn_ntab" href="javascript:void(0);" title="次のタブを表示する" onclick="tab.next();"></a>' +
			'		<a id="ls_header_logo" href="http://www.littlesoft.jp/" target="_blank"></a>' +
			'	</div>';
    	new Insertion.Top($('ls_container'), _header);
		var _footer =
			'	<div id="ls_footer">' +
			'		<div id="login_info">' +
			'			<marquee id="login_info_text" scrolldelay="100">[ ' + dateFormat(currentDate) + ' ] ' + userName + ' さんが ログイン中．．．</marquee>' +
			'		</div>' +
			'		<div id="ls_footer_copy">Copyright (C) 2006-2009 LittleSoft Corporation. All Rights Reserved. </div>' +
			'	</div>';
    	new Insertion.Bottom($('ls_container'), _footer);
    }
	// リサイズマネージャー オブジェクト生成
	if (!ls.isPopup()) {
		new ls.ResizeManager({minWidth:700, minHeight:500, timer:25});
		ls.ResizeInstance.setAnchor('ls_container', {bottom: 0, right: 0});
		ls.ResizeInstance.setAnchor('ls_contents',  {bottom: bottomFix, right: 0});
		ls.ResizeInstance.setAnchor('main_tab',     {bottom: bottomFix});
		ls.ResizeInstance.setAnchor('main_tab_menu',{right: tabMaxRight});
	}
	// リサイズ設定
	for (var i = 0; i < resizeElement.length; i++) {
		var _arr = resizeElement[i];
		ls.ResizeInstance.setAnchor(_arr[0], _arr[1]);
	}
	// メニューを生成
	menu = new lsg.SelectableMenu('menu_btn', 'menu_txt');
	for (var i = 0; i < menuInfo.length; i++) {
		menu.add(menuInfo[i].title, menuInfo[i].link);
	}
	menu.add(null);
	menu.add('メンテナンス', '../maintenance/ls_groupware_maintenance.html');
	menu.add('個人設定', '../personal/ls_groupware_personal.html');
	menu.add('ログアウト', '../login/ls_groupware_login.html');
	// メニュー名を設定
	setMenuName(tabTitle[0]);
	// [タブコンテナ] オブジェクトを生成
	tab = new lsg.TabContainer('main_tab_menu', 'main_tab', {tabs: tabTitle, defaultTab: 0, onTabClick: onMainTabClick, maxRight: tabMaxRight});
	// コールバック
	windowLoaded();
});

// ダミー関数
function windowLoaded() {}
function mainTabClick(index) {}

// タブがクリックされた際にコールバックされるファンクション
var onMainTabClick = function(index) {
	// メニュー名を設定
	setMenuName(tabTitle[index]);
	// リサイズ再設定
	ls.ResizeInstance._updateBounds(true);
	// コールバック
	mainTabClick(index);
}

// メニューラベル設定
function setMenuName(name) {
	menu.setText(menuTitle + '&nbsp;[&nbsp;' + name + '&nbsp;]&nbsp;');
}

// 日付フォーマット
function dateFormat(date) {
	var _date = (date.length == 7) ? (date.replace('/', '年') + '月') : (date.replace('/', '年').replace('/', '月') + '日');
	return _date;
}

// メニュークラス定義
if (!ls.isPopup()) {
	lsg.SelectableMenu = Class.create({
		initialize: function(id, text_id) {
			this.id = id;
			this.text = $(text_id);
			this._seq = 0;
			new Insertion.Bottom($('menu_container'),
				'<div id="' + id + '_menu_wrapper" style="top:30px;left:5px;position:absolute;height:0px;overflow:hidden;border:1px solid #009B9B;" class="lsSelectableMenu"></div>'+
				'<iframe id="' + id + '_menu_floating_frame" class="lsSelectableMenuFrame" name="_menu_floating_frame" frameborder="0" marginwidth="0" marginheight="0" style="top:34px;position:absolute;"></iframe>'
			);
			this._menu_btn  = $(id);
			this._menu_wrapper = $(id + '_menu_wrapper');
			this._menuframe    = $(id + '_menu_floating_frame');
			var _eventTarget = (Prototype.Browser.IE) ? window.document : window;
			Event.observe(_eventTarget, "click", this._onClick.bindAsEventListener(this));
			this._menuframe.setOpacity(0.5);
			this._menuframe.hide();
			this._menu_wrapper.hide();
			this._menuAnim = new Animator({transition: Animator.makeEaseOut(2),duration: 250, onComplete: this._onComplete.bind(this)});
			this._menuAnim.addSubject(new NumericalStyleSubject(this._menu_wrapper, 'height', 0, menuHeight));
		},
		_onComplete: function() {
			if (this._menu_wrapper.getHeight() > 2) {
				var _o = this._menu_wrapper.cumulativeOffset();
				this._menuframe.setStyle({
					 'top'   : ((_o.top) + 'px')
					,'left'  : ((_o.left - 2) + 'px')
					,'width' : ((this._menu_wrapper.getWidth()+4) + 'px')
					,'height': ((this._menu_wrapper.getHeight()+2) + 'px')
				});
				this._menuframe.show();
			}
		},
		add: function(title, action) {
			if (title == null) {
				new Insertion.Bottom(this._menu_wrapper, '<div class="sep"></div>');
	
			}
			else {
				var _id = this.id + '_' + this._seq++;
				var _loc = '';
				if (action) {
					_loc = action;
				}
				new Insertion.Bottom(this._menu_wrapper, '<a id="' + _id + '"class="menu_link" style="" href="javascript:void(0);" onclick="location.href=\'' + _loc + '\'">' + title + '</a>');
			}
		},
		_onClick: function(event) {
			if (!Prototype.Browser.IE) {
				window.getSelection().removeAllRanges();
			}
			else {
				event.returnValue = false;
			}
			var _e = Event.element(event);
			if (_e == this._menu_btn) {
				if (this._menu_wrapper.getHeight() > 2) {
					this._menuframe.hide();
					this._menuAnim.reverse();
				}
				else {
					if (!this._menu_wrapper.visible()) this._menu_wrapper.show();
					this._menuAnim.play();
				}
			}
			else {
				if (this._menu_wrapper.getHeight() > 2) {
					this._menuframe.hide();
					this._menuAnim.reverse();
				}
			}
		},
		setText: function(text) {
			this.text.update(text);
		}
	});
}
