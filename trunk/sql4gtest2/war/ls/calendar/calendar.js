/*
 *  Copyright (c) 2006-2010 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

/**
 * [LSJFramework JSコンポーネント]
 *    ・カレンダー calendar.js
 *
 * @author LittleSoft Corporation
 * @version 1.3.0
 */
ls.Calendar = Class.create({
	//----------------------------
	// initialize date
	//----------------------------
	initialize: function(textBoxId, prop) {
		this.date = null;
		this.prevDateList = null;
		this._currendSelection = null;
		this.id = null;
		this.cld = null;
		this.textBox = null;
		this.onComplete = null;
		if (typeof(textBoxId) != 'undefined') {
			this.id = textBoxId + '_calendar';
			this.textBox = $(textBoxId);
		}
		else {
			this.id = '_dummy_calendar';
		}
		//if (typeof(prop) != 'undefined' && typeof(prop.startDay) != 'undefined') {
		//	this.startDay = prop.startDay;
		//}
		//else {
		//	this.startDay = 0;
		//}
		this.options = Object.extend({
							startDay         : 0,
							onComplete       : null,
							onAfterMoveMonth : null,
							startMonth		 : null
						}, prop);
		// lower compatible
		//this.onComplete = this.options.onComplete;
		
	},

	//----------------------------
	// initialize date
	//----------------------------
	initDate: function(dd) {
		if (!dd) dd = new Date();
		var year = dd.getFullYear();
		var mon = dd.getMonth();
		var date = dd.getDate();
		this.date = new Date(year, mon, date);
		this.getFormValue();
		return this.date;
	},

	//----------------------------
	// set date
	//----------------------------
	setDateYMD :function(ymd) {
		var splt = ymd.split('/');
		if (splt[0]-0 > 0 &&
			splt[1]-0 >= 1 && splt[1]-0 <= 12 &&
			splt[2]-0 >= 1 && splt[2]-0 <= 31) {
			if (!this.date) this.initDate();
			this.date.setFullYear(splt[0]);
			this.date.setMonth(splt[1]-1);
			this.date.setDate(splt[2]);
		}
		else {
			ymd = '';
		}
		return ymd;
	},

	//----------------------------
	// get date
	//----------------------------
	getDateYMD: function(dd) {
		if (!dd) {
			if (!this.date) this.initDate();
			dd = this.date;
		}
		var mm = '' + (dd.getMonth()+1);
		var aa = '' + dd.getDate();
		if (mm.length == 1) mm = '' + '0' + mm;
		if (aa.length == 1) aa = '' + '0' + aa;
		return dd.getFullYear() + '/' + mm + '/' + aa;
	},

	//----------------------------
	// get inputArea Text (and set date)
	//----------------------------
	getFormValue: function() {
		var form1 = this.textBox;
		if (!form1) return '';
		var date1 = this.setDateYMD(form1.value);
		return date1;
	},

	//----------------------------
	// set inputArea Text
	//----------------------------
	setFormValue: function(ymd) {
		if (!ymd) ymd = this.getDateYMD();
		var form1 = this.textBox;
		if (form1) form1.value = ymd;
	},

	//----------------------------
	// move month
	//----------------------------
	moveMonth: function(mon) {
		// next
		if (!this.date) this.initDate();
		for(; mon<0; mon++) {
			this.date.setDate(1);
			this.date.setTime(this.date.getTime() - (24 * 3600 * 1000));
		}
		// prev
		for(; mon>0; mon--) {
			this.date.setDate(1);
			this.date.setTime(this.date.getTime() + (24 * 3600 * 1000) * 32);
		}
		this.date.setDate(1);
		var hideCld = this.cld;
		if (hideCld != null) {
			this.hide();
		}
		//this.write(this._id, this._f);
		this.write(this._id);
		if (this.options.onAfterMoveMonth) {
			var _y = this.date.getFullYear().toString();
			var _m = ((this.date.getMonth() + 1) < 10) ? ('0' + (this.date.getMonth() + 1)) : (this.date.getMonth() + 1).toString();
			var _d = (this.date.getDate() < 10) ? ('0' + this.date.getDate()) : this.date.getDate().toString();
			this.options.onAfterMoveMonth(_y + '/' + _m + '/' + _d);
		}
	},

	//----------------------------
	// change month
	//----------------------------
	changeMonth: function(e) {
		this.moveMonth($F('__' + this.id + '_sel_month'));
	},

	//----------------------------
	// open calendar
	//----------------------------
	open: function(textBoxId) {
		var hideCld = this.cld;
		if (hideCld != null) {
			this.hide();
		}
		if ((typeof(textBoxId) != 'undefined') && (textBoxId != null)) {
			this.textBox = document.getElementsByName(textBoxId).item(0);
			if (this.textBox == null) this.textBox = $(textBoxId);
			this.id = textBoxId + '_calendar';
		}
		this.getFormValue();
		//this.write(this._id, this._f);
		this.write(this._id);
	},

	//----------------------------
	// write calendar
	//----------------------------
	write: function(_id) {
		this._id = _id;
		if (this.prevDateList) {
			for (var i = 0, len = this.prevDateList.length; i < len; i++) {
				var dd = this.prevDateList[i];
				if (this.prevMon != dd.getMonth()) continue;
				var utc = dd.getTime();
				if (utc == this.prevCurutc) continue;
				var ss = this.getDateYMD(dd);
				var cc = $('__' + this.id + '_td_' + ss);
				if (!cc) continue;
				Event.stopObserving(cc, 'mouseover', day_onmouseover);
				Event.stopObserving(cc, 'mouseout', day_onmouseout);
				Event.stopObserving(cc, 'click', day_onclick);
			}
		}

		var date = new Date();
		if (!this.date) this.initDate();
		date.setTime(this.date.getTime());

		var year = date.getFullYear();
		var mon	= date.getMonth();
		var today = date.getDate();
		var form1 = this.textBox;

		date.setDate(1);
		var wday = date.getDay();
		if (wday != this.options.startDay) {
			date.setTime(date.getTime() - (24 * 3600 * 1000) * ((wday - this.options.startDay + 7) % 7));
		}

		var list = new Array();
		for (var i = 0; i < 42; i++) {
			var tmp = new Date();
			tmp.setTime(date.getTime() + (24 * 3600 * 1000) * i);
			if (i && i % 7 == 0 && tmp.getMonth() != mon) break;
			list[list.length] = tmp;
		}

		var pos = this.getElementPosition(this.textBox);
		var posY = pos.y + this.textBox.offsetHeight - this.getScrollTop(this.textBox);
		var posX = pos.x;

		var src = '';
		src += '<div id="' + this.id + '" style="position:absolute;top:' + posY + 'px;left:' + posX + 'px;z-index:9999;">' +
					 '	<div class="lsCalendarCloseBtn" id="__' + this.id + '_btn_close"></div>' +
					 '	<table class="lsCalendarLayerTable">' +
					 '		<tr>' +
					 '			<td class="lsCalendarLayerTableHL">&nbsp;</td>' +
					 '			<td class="lsCalendarLayerTableHC"><div id="' + this.id + '_Head" class="lsCalendarHead"></div></td>' +
					 '			<td class="lsCalendarLayerTableHR">&nbsp;</td>' +
					 '		</tr>' +
					 '		<tr>' +
					 '			<td class="lsCalendarLayerTableBL">&nbsp;</td>' +
					 '			<td class="lsCalendarLayerTableBC">';
		src += this._getSource(list, form1, year, mon);
		src += '			</td>' +
			'			<td class="lsCalendarLayerTableBR">&nbsp;</td>' +
			'		</tr>' +
			'		<tr>' +
			'			<td class="lsCalendarLayerTableFL">&nbsp;</td>' +
			'			<td class="lsCalendarLayerTableFC">&nbsp;</td>' +
			'			<td class="lsCalendarLayerTableFR">&nbsp;</td>' +
			'		</tr>' +
			'	</table>' +
			'</div>';
		var curutc;
		if (form1 && form1.value) {
			var splt = form1.value.split('/');
			if (splt[0] > 0 && splt[2] > 0) {
				var curdd = new Date(splt[0] - 0, splt[1] - 1, splt[2] - 0);
				curutc = curdd.getTime();
			}
		}

		new Insertion.Bottom(document.body, src);
		this.cld = $(this.id)
		Element.addClassName(this.cld, 'lsCalendar');

		//position:left adjust
		var winSize = this.getScreenSize();
		if (winSize.x < (posX + this.cld.offsetWidth)) {
			posX = posX - (this.cld.offsetWidth - this.textBox.offsetWidth);
			if (posX < 0) posX = 0;
			this.cld.style.left = posX + 'px';
		}
		//position:top adjust
		if (winSize.y < (posY + this.cld.offsetHeight)) {
			posY = posY - this.cld.offsetHeight - this.textBox.offsetHeight;
			if (posY < 0) posY = 0;
			this.cld.style.top = posY + 'px';
		}

		// <select>
		var ht = this.cld.offsetHeight + 1;
		var srcI = '';
		srcI += '<div id="' + this.id + '_frame' + '" style="position:absolute;top:' + posY + 'px;left:' + posX + 'px;z-index:1000;">';
    if (ls.isMSIE6()) {
      srcI += '<iframe src="ls/dummy.htm" frameborder="0" scrolling="no" class="lsCalendarDummyFrame" height="' + ht + '"></iframe>';
    } else {
      srcI += '<iframe src="" frameborder="0" scrolling="no" class="lsCalendarDummyFrame" height="' + ht + '"></iframe>';
    }
		srcI += '</div>';
		new Insertion.Bottom(document.body, srcI);
		
		$(this.id + '_frame').setOpacity(0.0);

		this._eventSetting(list, mon, curutc);

		this.prevDateList = list;
		this.prevMon = mon;
		this.prevCurutc = curutc;
	},
	
	_eventSetting: function(list, mon, curutc) {
		var __this = this;
		var get_src = function (ev) {
			ev = ev || window.event;
			var src = ev.target || ev.srcElement;
			return src;
		};
		var day_onmouseover = function (ev) {
			var src = get_src(ev);
			var spltClassName = src.className.split(' ');
			//Element.removeClassName(src, spltClassName[1]);
			Element.removeClassName(src, 'daybg_mout');
			Element.addClassName(src, 'daybg_mover');
		};
		var day_onmouseout = function (ev) {
			var src = get_src(ev);
			var spltClassName = src.className.split(' ');
			//Element.removeClassName(src, spltClassName[1]);
			Element.removeClassName(src, 'daybg_mover');
			Element.addClassName(src, 'daybg_mout');
		};
		var day_onclick = function (ev) {
			var src = get_src(ev);
			var srcday = src.id.substr(src.id.length - 10);
			__this.setFormValue(srcday);
			__this.hide();
			if (__this.onComplete) {
				__this.onComplete(__this.textBox.id);
			}
			else {
				if (__this.options.onComplete != null) {
					var _p = (__this.textBox) ? __this.textBox.id : srcday;
					__this.options.onComplete(_p);
				}
			}
		};

		var tdprev = $('__' + this.id + '_btn_prev');
		Event.observe(tdprev, 'click', function(){ __this.moveMonth(-1);});
		this._eventSettingOption(__this);
		var tdnext = $('__' + this.id + '_btn_next');
		Event.observe(tdnext, 'click', function(){__this.moveMonth(+1);});

		var selmonth = $('__' + this.id + '_sel_month');
		Event.observe(selmonth, 'change', function(){ __this.changeMonth();});

		for (var i = 0, len = list.length; i < len; i++) {
			var dd = list[i];
			if (mon != dd.getMonth()) continue;

			var utc = dd.getTime();
			if (utc == curutc) continue;

			var ss = this.getDateYMD(dd);
			var cc = $('__' + this.id + '_td_' + ss);
			if (!cc) continue;

			Event.observe(cc, 'mouseover', day_onmouseover);
			Event.observe(cc, 'mouseout', day_onmouseout);
			Event.observe(cc, 'click', day_onclick);
		}
	},
	
	_eventSettingOption: function(__this) {
		var tdclose = $('__' + this.id + '_btn_close');
		Event.observe(tdclose, 'click', function(){__this.hide();});
	},
	
	_getSource: function(list, form1, year, mon) {
		var src = '				<table class="lsCalendarTopTable">' +
				'					<tr>' +
				'						<td style="text-align:left;"><div id="__' + this.id + '_btn_prev" class="lsCalendarPrevBtn"></div></td>' +
				//'						<td>' + (year) + '年 ' + (mon + 1) + '月</td>' +
				'						<td><select id="__' + this.id + '_sel_month" style="width:90px;border:1px solid #919191;">' + this._getMonthOption(year, mon) + '</select></td>' +
				'						<td style="text-align:right;"><div id="__' + this.id + '_btn_next" class="lsCalendarNextBtn"></div></td>' +
				'					</tr>' +
				'				</table>' +
				'				<table class="lsCalendarWeekTable"><tr>';
		for (var i = this.options.startDay, len = this.options.startDay + 7; i < len; i++) {
			var _wday = i % 7;
			if (_wday == 0) {
				src += '<td class="sun">日</td>';
			}
			else if (_wday == 6) {
				src += '<td class="sat">土</td>';
			}
			else {
				src += '<td>';
				if(_wday == 1) src += '月</td>';
				else if(_wday == 2) src += '火</td>';
				else if(_wday == 3) src += '水</td>';
				else if(_wday == 4) src += '木</td>';
				else if(_wday == 5) src += '金</td>';
			}
		}
		src += '</tr></table>';
		src += '<table class="lsCalendarDaysTable">';
		var curutc;
		if (form1 && form1.value) {
			var splt = form1.value.split('/');
			if (splt[0] > 0 && splt[2] > 0) {
				var curdd = new Date(splt[0] - 0, splt[1] - 1, splt[2] - 0);
				curutc = curdd.getTime();
			}
		}
		var realdd = new Date();
		var realutc = (new Date(realdd.getFullYear(), realdd.getMonth(), realdd.getDate())).getTime();
		for (var i = 0, len = list.length; i < len; i++) {
			var dd = list[i];
			var ww = dd.getDay();
			var mm = dd.getMonth();
			if (ww == this.options.startDay) {
				src += '<tr>';
			}
			var cc = '';
			var utc = dd.getTime();
			if (mon == mm) {
				if (utc == realutc) {
					cc = 'today';
				}
				else if (ww == 0) {
					cc = 'sun';
				}
				else if (ww == 6) {
					cc = 'sat';
				}
				else {
					cc = 'week';
				}
			}
			else {
				cc = 'other';
			}
			if (utc == curutc) {
				cc += ' selected';
			}
			var ss = this.getDateYMD(dd);
			var tt = dd.getDate();
			src += '<td class="' + cc + ' daybg_mout" title=' + ss + ' id="__' + this.id + '_td_' + ss + '">' + tt + '</td>';
			if (ww == (this.options.startDay + 6) % 7) {
				src += '</tr>';
			}
		}
		src += '		 </table>';
		return src;
	},
	
	_getMonthOption: function(year, month) {
		var _ret = '';
		var _y = year;
		var _m = month;
		for (var i = 0; i < 12; i++) {
			var _selected = (i == 0) ? 'selected="selected"' : '';
			_ret += '<option value="' + i + '"' + _selected + '>' + _y + '年 ' + (_m + 1) + '月</option>';
			_m++;
			if (_m == 12) {
				_m = 0;
				_y++;
			} 
		}
		_y = year;
		_m = month - 1;
		if (_m == -1) {
			_m = 11;
			_y--;
		} 
		for (var i = 0; i < 11; i++) {
			_ret = '<option value="' + (-1 - i) + '">' + _y + '年 ' + (_m + 1) + '月</option>' + _ret;
			_m--;
			if (_m == -1) {
				_m = 11;
				_y--;
			} 
		}
		return _ret;
	},

	//----------------------------
	// hide calendar
	//----------------------------
	hide: function() {
		Element.remove(this.cld);
		Element.remove($(this.id + '_frame'));
		this.cld = null;
	},

	//----------------------------
	// get TextBox Position
	//----------------------------
	getElementPosition: function(elm) {
		var pos = {x:0, y:0};
		if (!elm.offsetParent) {
			return pos;
		}
		else {
		}
		pos.x = elm.offsetLeft;
		pos.y = elm.offsetTop;
		if (elm.parentNode) {
			var ppos = this.getElementPosition(elm.offsetParent);
			pos.x += this.PixNum(ppos.x);
			pos.y += this.PixNum(ppos.y);
		}
		return pos;
	},
  
  getScrollTop: function(elm) {
    var scrolltop = 0;
    while(elm.parentNode){
      if (elm.parentNode.scrollTop) {
        scrolltop += elm.parentNode.scrollTop;
      }
      elm = elm.parentNode;
    }
    return scrolltop;
  },

	PixNum: function(sz) {
		var s = (sz + '').replace(/￥D/g, '');
		var n = parseInt(s);
		return n;
	},

	getScreenSize: function() {
		var obj = new Object();
		obj.x = document.viewport.getWidth();
		obj.y = document.viewport.getHeight();
		obj.mx = parseInt((obj.x) / 2);
		obj.my = parseInt((obj.y) / 2);
		return obj;
	}

});

ls.EmbeddedCalendar = Class.create(ls.Calendar, {
	write: function(_id){
		//this._f = f;
		this._id = _id;
		//this._currendSelection = '';
		$(_id).update('');
		var day_onmouseover = function (ev) {
			var src = get_src(ev);
			var spltClassName = src.className.split(' ');
			//Element.removeClassName(src, spltClassName[1]);
			Element.removeClassName(src, 'daybg_mout');
			Element.addClassName(src, 'daybg_mover');
		};
		var day_onmouseout = function (ev) {
			var src = get_src(ev);
			var spltClassName = src.className.split(' ');
			//Element.removeClassName(src, spltClassName[1]);
			Element.removeClassName(src, 'daybg_mover');
			Element.addClassName(src, 'daybg_mout');
		};
		var day_onclick = function (ev) {
			var src = get_src(ev);
			var srcday = src.id.substr(src.id.length - 10);
			__this.setFormValue(srcday);
			__this.hide();
			if (__this.onComplete) {
				__this.onComplete(srcday);
			}
			else {
				if (__this.options.onComplete != null) {
					__this.options.onComplete(srcday);
				}
			}
		};
		if (this.prevDateList) {
			for (var i = 0, len = this.prevDateList.length; i < len; i++) {
				var dd = this.prevDateList[i];
				if (this.prevMon != dd.getMonth()) continue;
				var utc = dd.getTime();
				if (utc == this.prevCurutc) continue;
				var ss = this.getDateYMD(dd);
				var cc = $('__' + this.id + '_td_' + ss);
				if (!cc) continue;
				Event.stopObserving(cc, 'mouseover', day_onmouseover);
				Event.stopObserving(cc, 'mouseout', day_onmouseout);
				Event.stopObserving(cc, 'click', day_onclick);
			}
		}

		var date = new Date();
		if (this.options.startMonth != null) {
			if (!this.date) this.initDate(new Date(this.options.startMonth));
		}
		else{
			if (!this.date) this.initDate();
		}
		date.setTime(this.date.getTime());
		var year = date.getFullYear();
		var mon	= date.getMonth();
		var today = date.getDate();
		
		var form1 = this.textBox;
		if (this._currendSelection == null) {
			this._currendSelection = this.getDateYMD(date);
		}

		date.setDate(1);
		var wday = date.getDay();
		if (wday != this.options.startDay) {
			date.setTime(date.getTime() - (24 * 3600 * 1000) * ((wday - this.options.startDay + 7) % 7));
		}

		var list = new Array();
		for (var i = 0; i < 42; i++) {
			var tmp = new Date();
			tmp.setTime(date.getTime() + (24 * 3600 * 1000) * i);
			if (i && i % 7 == 0 && tmp.getMonth() != mon) break;
			list[list.length] = tmp;
		}

		var src = this._getSource(list, form1, year, mon);
		var curutc;
		if (form1 && form1.value) {
			var splt = form1.value.split('/');
			if (splt[0] > 0 && splt[2] > 0) {
				var curdd = new Date(splt[0] - 0, splt[1] - 1, splt[2] - 0);
				curutc = curdd.getTime();
			}
		}

		this.cld = $(_id)
		new Insertion.Bottom(this.cld, src);
		Element.addClassName(this.cld, 'lsCalendar');
		this._eventSetting(list, mon, curutc);

		this.prevDateList = list;
		this.prevMon = mon;
		this.prevCurutc = curutc;
		if ($('__' + this.id + '_td_' + this._currendSelection)) $('__' + this.id + '_td_' + this._currendSelection).addClassName('e_selected');
	},
	_eventSettingOption: function(__this){
	},
	hide: function(){
	},
	setFormValue: function(day) {
		if ($('__' + this.id + '_td_' + this._currendSelection)) $('__' + this.id + '_td_' + this._currendSelection).removeClassName('e_selected');
		$('__' + this.id + '_td_' + day).addClassName('e_selected');
		this._currendSelection = day;
		//this._f(day);
		//if (this.options.onComplete != null) {
		//	this.options.onComplete(day);
		//}
	}
	//,
	//_f: function(day){
	//}
});
