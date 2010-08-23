/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

/*
 * シンプルメッセージ simplemsg.js
 *
 * [既知の問題]
 *    ・なし
 * 
 * @author LittleSoft Corporation
 * @version 1.0.0
 */
lsg.SimpleMsg = Class.create({
	Level: {
		INFO    : 'ls_smsg_info',
		CONFIRM : 'ls_smsg_confirm',
		ERROR   : 'ls_smsg_error'
	},
	initialize: function() {
		this.id = '__lsg_smsg__';
		this.level = null;
		this.isIE6 = lsg.isMSIE6();
	},
	info: function(msg, f) {
		this.level = this.Level.INFO;
		if (f != undefined) {
			if (f.confirmTrue != undefined) this._confirmTrueF = f.confirmTrue;
		}
		this._out(msg);
	},
	confirm: function(msg, f) {
		this.level = this.Level.CONFIRM;
		if (f != undefined) {
			if (f.confirmTrue != undefined) this._confirmTrueF = f.confirmTrue;
			if (f.confirmFalse != undefined) this._confirmFalseF = f.confirmFalse;
		}
		this._out(msg);
	},
	error: function(msg) {
		this.level = this.Level.ERROR;
		if (this.isIE6) {
			alert(msg.replace(/\\n/g, '\n'));
		}
		else {
			this._out(msg);
		}
	},
	_out: function(msg) {
		if ($(this.id)) {
			var _lv = this.level;
			this.hide();
			this.level = _lv;
		}
		var _t = '';
		if (this.level == this.Level.INFO) {
			_t = '情報';
		}
		else if (this.level == this.Level.CONFIRM) {
			_t = '確認';
		}
		else if (this.level == this.Level.ERROR) {
			_t = 'エラー';
		}
		var layer = 
			'<div id="' + this.id + '" class="ls_smsg ' + this.level + '" style="z-index:9999;">' +
			'	<div id="' + this.id + '_move" class="ls_smsg_title">' + _t + '</div>' +
			'	<table  class="ls_smsg_table">' +
			'		<tr>' +
			'			<td class="ls_smsg_icon_td"></td>' +
			'			<td class="ls_smsg_msg_td">' +
			'				<div class="ls_smsg_msg_td_div">' +
			'					<table style="width:100%;height:100%;">' +
			'						<tr>' +
			'							<td>' +
											msg.replace(/\n/g, '<br/>').replace(/\\n/g, '<br/>') +
			'							</td>' +
			'						</tr>' +
			'					</table>' +
			'				</div>' +
			'			</td>' +
			'		</tr>';
		if (this.level == this.Level.INFO || this.level == this.Level.ERROR) {
			layer +=
			'		<tr>' +
			'			<td colspan="2" style="text-align:center;">' +
			'				<input id="' + this.id + '_btn_true" style="margin:5px 0;width:70px;" type="button" value="OK" />' +
			'			</td>' +
			'		</tr>';
		}
		else if (this.level == this.Level.CONFIRM) {
			layer +=
			'		<tr>' +
			'			<td colspan="2" style="text-align:center;">' +
			'				<input id="' + this.id + '_btn_true" style="margin:5px 0;width:70px;" type="button" value="はい" />&nbsp;&nbsp;<input id="' + this.id + '_btn_false" style="margin:5px 0;width:70px;" type="button" value="いいえ" />' +
			'			</td>' +
			'		</tr>';
		}
		layer +=
			'	</table>' +
			'</div>';
		this.owner = (lsg.isPopup()) ? parent.document : document;
		new Insertion.Top(this.owner.body, layer);
		new Insertion.Top(this.owner.body, '<div id="' + this.id + '_bg" style="z-index:9998;background-color:#666666;left:0;position:absolute;top:0;"></div>');
		if (this.isIE6) new Insertion.Top(this.owner.body, '<iframe src="/lsg/dummy.htm" id="' + this.id + '_fm" class="" name="' + this.id + '_bg" frameborder="0" marginwidth="0" marginheight="0" style="z-index:9997;left:0;position:absolute;top:0;"></iframe>');
		_target = this.owner.body.getElementsBySelector('div[id="' + this.id + '_bg"]');
		this.bg;
		if (_target.length > 0) {
			this.bg = _target[0];
		}
		if (this.isIE6) {
			_target = this.owner.body.getElementsBySelector('iframe[id="' + this.id + '_fm"]');
			this.fm;
			if (_target.length > 0) {
				this.fm = _target[0];
			}
		}
		if (this.level == this.Level.INFO ||
			this.level == this.Level.CONFIRM) {
			this.bg.setOpacity(0.2);
			if (this.isIE6) this.fm.setOpacity(0.0);
		}
		else {
			this.bg.setOpacity(0.0);
			if (this.isIE6) this.fm.setOpacity(0.0);
			this.bg.hide();
			if (this.isIE6) this.fm.hide();
		}
		this.bg.setStyle({
			 'width'  : (this.owner.viewport.getWidth() + 'px')
			,'height' : (this.owner.viewport.getHeight() + 'px')
		});
		if (this.isIE6) {
			this.fm.setStyle({
				 'width'  : (this.owner.viewport.getWidth() + 'px')
				,'height' : (this.owner.viewport.getHeight() + 'px')
			});
		}
		if (ls.ResizeInstance != null) ls.ResizeInstance.setAnchor(this.id + '_bg', {bottom:0, right:0});
		if (this.isIE6 && ls.ResizeInstance != null) ls.ResizeInstance.setAnchor(this.id + '_fm', {bottom:0, right:0});
		var eventTarget = (lsg.isPopup()) ? parent.window : window;
		if (Prototype.Browser.IE) eventTarget = (lsg.isPopup()) ? parent.window.document : window.document;
		Event.observe(eventTarget, "mousedown", this._onMouseDown.bindAsEventListener(this));
		Event.observe(eventTarget, "mousemove", this._onMouseMove.bindAsEventListener(this));
		Event.observe(eventTarget, "mouseup",   this._onMouseUp.bindAsEventListener(this));
		var viewOffset = this.owner.viewport.getScrollOffsets();
		var x = viewOffset.left + (this.owner.viewport.getWidth()  - 400)  / 2;
		var y = viewOffset.top  + (this.owner.viewport.getHeight() - 135) / 2;
		this.layer;
		_target = this.owner.body.getElementsBySelector('div[id="' + this.id + '"]');
		if (_target.length > 0) {
			this.layer = _target[0];
		}
		this.layer.setStyle({
			 'top'  : (y + 'px')
			,'left' : (x + 'px')
		});
		this.layer_move;
		_target = this.owner.body.getElementsBySelector('div[id="' + this.id + '_move"]');
		if (_target.length > 0) {
			this.layer_move = _target[0];
		}
		if (this.level == this.Level.INFO || this.level == this.Level.ERROR) {
			this.btn_true;
			_target = this.owner.body.getElementsBySelector('input[id="' + this.id + '_btn_true"]');
			if (_target.length > 0) {
				this.btn_true = _target[0];
			}
			if (this.level == this.Level.INFO) {
				Event.observe(this.btn_true,  "click", this._confirmTrue.bindAsEventListener(this));
			}
			else if (this.level == this.Level.ERROR) {
				Event.observe(this.btn_true,  "click", this._confirmFalse.bindAsEventListener(this));
			}
			Event.observe(this.btn_true,  "blur", this._setFocusTrue.bindAsEventListener(this));
			this.btn_true.focus();
			new Insertion.Bottom(this.owner.body, '<a id="' + this.id + '_dmy_focus" href="javascript:void(0);"></a>');
			this.dmy_focus;
			_target = this.owner.body.getElementsBySelector('a[id="' + this.id + '_dmy_focus"]');
			if (_target.length > 0) {
				this.dmy_focus = _target[0];
			}
			Event.observe(this.dmy_focus,  "focus", this._setFocusTrue.bindAsEventListener(this));
		}
		else if (this.level == this.Level.CONFIRM) {
			this.btn_true;
			_target = this.owner.body.getElementsBySelector('input[id="' + this.id + '_btn_true"]');
			if (_target.length > 0) {
				this.btn_true = _target[0];
			}
			this.btn_false;
			_target = this.owner.body.getElementsBySelector('input[id="' + this.id + '_btn_false"]');
			if (_target.length > 0) {
				this.btn_false = _target[0];
			}
			Event.observe(this.btn_true,  "click", this._confirmTrue.bindAsEventListener(this));
			Event.observe(this.btn_false, "click", this._confirmFalse.bindAsEventListener(this));
			Event.observe(this.btn_true,  "blur", this._setFocusFalse.bindAsEventListener(this));
			Event.observe(this.btn_false, "blur", this._setFocusTrue.bindAsEventListener(this));
			this.btn_true.focus();
			new Insertion.Bottom(this.owner.body, '<a id="' + this.id + '_dmy_focus" href="javascript:void(0);"></a>');
			this.dmy_focus;
			_target = this.owner.body.getElementsBySelector('a[id="' + this.id + '_dmy_focus"]');
			if (_target.length > 0) {
				this.dmy_focus = _target[0];
			}
			Event.observe(this.dmy_focus,  "focus", this._setFocusFalse.bindAsEventListener(this));
		}
	},
	hide: function() {
		if (this.bg) this.bg.remove();
		if (this.fm) this.fm.remove();
		if (this.dmy_focus) this.dmy_focus.remove();
		if (this.layer) this.layer.remove();
		this.bg = null;
		this.fm = null;
		this.owner = null;
		this.layer = null;
		this.layer_move = null;
		this.btn_true = null;
		this.btn_false = null;
		this.dmy_focus = null;
		this.level = null;
	},
	_confirmTrue: function() {
		this.hide();
		this._confirmTrueF();
		this._confirmTrueF = function(){};
		this._confirmFalseF = function(){};
		return true;
	},
	_confirmFalse: function() {
		this.hide();
		this._confirmFalseF();
		this._confirmTrueF = function(){};
		this._confirmFalseF = function(){};
		return false;
	},
	_confirmTrueF: function() {
	},
	_confirmFalseF: function() {
	},
	_setFocusTrue: function() {
		if (this.btn_true) this.btn_true.focus();
	},
	_setFocusFalse: function() {
		if (this.btn_false) this.btn_false.focus();
	},
	_onMouseDown: function(event) {
		if (Event.element(event) == this.layer_move) {
			if (this.isMove) return;
			if (this.level != this.Level.INFO &&
				this.level != this.Level.CONFIRM) {
				this.bg.show();
				if (this.isIE6) this.fm.show();
			}
			this._disableSelect(event);
			this.isMove = true;
			this._event = {'y':Event.pointerY(event), 'x':Event.pointerX(event)};
			this._orgY = this.layer.offsetTop;
			this._orgX = this.layer.offsetLeft;
		}
	},
	_onMouseMove: function(event) {
		if (this.isMove) {
			var viewOffset = this.owner.viewport.getScrollOffsets();
			event = event||window.event;
			var x = this._orgX + Event.pointerX(event) - this._event.x;
			var y = this._orgY + Event.pointerY(event) - this._event.y;
			var _d = this.owner.viewport.getDimensions();
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			var _maxh = 139;
			if (x + 404 > _d.width) x = _d.width - 404;
			if (y + _maxh > _d.height) y = _d.height - _maxh;
			this.layer.setStyle({
				 'top'  : (y + 'px')
				,'left' : (x + 'px')
			});
		}
	},
	_onMouseUp: function(event) {
		if (this.isMove) {
			if (this.level != this.Level.INFO &&
				this.level != this.Level.CONFIRM) {
				this.bg.hide();
				if (this.isIE6) this.fm.hide();
			}
			this._enableSelect();
			this.isMove = false;
		}
	},
	_disableSelect: function(event) {
		if (Prototype.Browser.IE) {
			this.owner.body.onselectstart = function(e) { return false };
		}
		else {
			try { event.preventDefault(); } catch(e) {}
		}
	},
	_enableSelect: function() {
		    if (Prototype.Browser.IE) this.owner.body.onselectstart = "";
	}
});
