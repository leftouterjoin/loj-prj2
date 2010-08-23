/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

/*
 * リサイズマネージャー resizemanager.js
 *
 * [既知の問題]
 *    ・IE7においてscroll-x/scroll-yが指定されているとき
 *      スクロールバーに入り込んでしまう。
 * 
 * @author LittleSoft Corporation
 * @version 1.2.3
 */
ls.ResizeInstance = null;
ls.ResizeManager = Class.create({

  /**
   * オブジェクトの初期処理を行います。
   *
   * @method initialize
   * @param  {Array}  prop オブジェクトプロパティ配列
   */
  initialize: function(prop) {
  
    ls.ResizeInstance = this;

    //オブジェクトプロパティの設定
    this.minWidth  = 500;
    this.minHeight = 400;
    this.maxWidth  = 9999;
    this.timer     = 250;
    if (prop!=undefined) {
      if (prop.minWidth!=undefined)  this.minWidth  = prop.minWidth;
      if (prop.minHeight!=undefined) this.minHeight = prop.minHeight;
      if (prop.maxWidth!=undefined)  this.maxWidth  = prop.maxWidth;
      if (prop.timer!=undefined)  this.timer  = prop.timer;
    }
    
    //前回のサイズ
    this.lastWidth  = this._containerWidth(); 
    this.lastHeight = this._containerHeight(); 

    //配置固定要素の配列
    this.elements = new Array();

    //タイマーオブジェクト
    this.updateTimer = null;

    //リサイズ中か否か
    this.resizing = false;
    
    //スクロールバーサイズを減算済みか否か
    this._subtract = false;

    //onload時のイベント設定
    if (!this.hLoad) {
      this.hLoad = this._onLoad.bindAsEventListener(this);
      Event.observe(window, 'load', this.hLoad, false);
    }

    //resize時のイベント設定
    if (!this.hResize) {
      this.hResize = this._onResize.bindAsEventListener(this);
      Event.observe(window, 'resize', this.hResize, false);
    }

  },
  
  /**
   * [ Public ] 配置固定する要素を設定します。
   *
   * @method setAnchor
   * @param  {String} elementId 要素名
   * @param  {Array}  anchor    プロパティ配列
   */
  setAnchor: function(elementId, anchor) {
    try {
      var a = {id:elementId, left:-1, right:-1, top:-1, bottom:-1};
      if (anchor!=undefined) {
        if (((anchor.left!=undefined) && (anchor.right!=undefined)) || 
            ((anchor.top!=undefined) && (anchor.bottom!=undefined))) {
          alert('property error !');
          return;
        }
        if (anchor.left!=undefined)   a.left   = anchor.left;
        if (anchor.right!=undefined)  a.right  = anchor.right;
        if (anchor.top!=undefined)    a.top    = anchor.top;
        if (anchor.bottom!=undefined) a.bottom = anchor.bottom;
      }
      // 既に登録済みの場合は更新
      var exist = false;
      for (var i=0; i<this.elements.length; i++) {
        if (this.elements[i].id == elementId) {
          this.elements[i] = a;
          exist = true;
          break;
        }
      }
      // 存在しない場合は追加
      if (!exist) {
        this.elements.push(a);
      }
      this._doLayout(a);
    }
    catch(e) {
      alert(e);
    }  
    this.lastWidth  = this._containerWidth(); 
    this.lastHeight = this._containerHeight(); 
  },

  /**
   * [ Private ] 引数で渡された要素の配置を調整します。
   *
   * @method _doLayout
   * @param  {Array} anchor 配置固定する要素の配列
   */
  _doLayout: function(anchor, orginalWidth, orginalHeight) {
    var el = $(anchor.id);
    var mr = Element.Methods.getStyle(el, 'marginRight');
    var textScrollAdjust = {right:0,bottom:0,left:0,top:0};
    var originalOverflow = el.style.overflow;
    if (anchor.right!=-1 || anchor.bottom!=-1) {
      if (el.tagName.toLowerCase()=='textarea') {
		el.setStyle({'overflow' : 'scroll'});
//        el.style.overflow = 'scroll';
      }
      else {
		el.setStyle({'overflow' : 'hidden'});
//        el.style.overflow = 'hidden';
      }
    }
    if (typeof(orginalWidth)=='undefined' && typeof(orginalHeight)=='undefined') {
      orginalWidth = el.style.width;
      orginalHeight = el.style.height;
//      el.style.width = '1px';
//      el.style.height = '1px';
		el.setStyle({
			'width' : '1px',
			'height' : '1px'
		});
    }
//    el.style.marginRight = mr;
	el.setStyle({'marginRight' : mr});
    
    // 親要素のoverflowがscroll/autoの場合はスクロールバーのサイズを減算する
    var scrollBarSize = 0;
    var pe = el.parentNode;
    do {
      try {
        if (pe.style.overflow=='auto' || pe.style.overflow=='scroll')
          scrollBarSize += this._getScrollBarSize();
      }
      catch (e) {
      }
      pe = pe.parentNode;
    } while (pe);
    var adj = 0;
    //右固定の場合
    var w = -1;
    if (anchor.right!=-1) {
      w = (this._getRightFixedWidth(el, anchor.right)-textScrollAdjust.right)-scrollBarSize + 'px';
    }
    //左固定の場合
    else if (anchor.left!=-1) {
      w = (this._getLeftFixedWidth(el, anchor.left)-textScrollAdjust.left)-scrollBarSize + 'px';
    }
    else {
	  w  = orginalWidth;
    }
    //下固定の場合
    if (anchor.bottom!=-1) {
      h = ((this._getBottomFixedHeight(el, anchor.bottom))-textScrollAdjust.bottom) + 'px';
    }
    //上固定の場合
    else if (anchor.top!=-1) {
      h = ((this._getTopFixedHeight(el, anchor.top))-textScrollAdjust.top) + 'px';
    }
    else {
      h  = orginalHeight;		
    }
    // overflowを戻してからサイズ設定
	if (w.indexOf('-') == 0) w = '0px';
	if (h.indexOf('-') == 0) h = '0px';
	el.setStyle({
		'overflow' : originalOverflow,
		'width'    : w,
		'height'   : h
	});
    
    //コールバック
    if (el._lsUIWidget && el._lsUIWidget.doLayout) {
      el._lsUIWidget.doLayout();
    }
    
  },

  /**
   * [ Private ] 引数で渡された要素の左固定位置から算出した幅を取得します。
   *
   * @method _getLeftFixedWidth
   * @param  {Object}  el   配置固定する要素オブジェクト
   * @param  {Integer} left 配置固定する要素の左位置
   * @return {Float}   幅
   */
  _getLeftFixedWidth: function(el, left) {
    var offsetLeft = 0;
    var offsetRight = 0;
    var pe = el;
    do {
      var l = 
       (this._getStylePix(pe, 'marginLeft') +
        this._getStylePix(pe, 'paddingLeft') +
        this._getStylePix(pe, 'borderLeftWidth'));
      offsetLeft += l;
      var r =
       (this._getStylePix(pe, 'marginRight') +
        this._getStylePix(pe, 'paddingRight') +
        this._getStylePix(pe, 'borderRightWidth'));
      offsetRight += r;
      pe = pe.parentNode; 
    } while (pe); 
    return ( this._containerWidth() - (offsetLeft + offsetRight + left) );
  },

  /**
   * [ Private ] 引数で渡された要素の右固定位置から算出した幅を取得します。
   *
   * @method _getRightFixedWidth
   * @param  {Object}  el    配置固定する要素オブジェクト
   * @param  {Integer} right 配置固定する要素の右位置
   * @return {Float}   幅
   */
  _getRightFixedWidth: function(el, right) {
    var offsetLeft = Element.Methods.cumulativeOffset(el).left;
    offsetLeft += 
       (this._getStylePix(el, 'marginLeft') +
        this._getStylePix(el, 'paddingLeft') +
        this._getStylePix(el, 'borderLeftWidth'));
    var offsetRight = 0;
    var pe = el;
    do {
// 「Element.Methods.cumulativeOffset」により、left位置はさかのぼって
//  算出されているので加算しない
//      var l = 
//       (this._getStylePix(pe, 'marginLeft') +
//        this._getStylePix(pe, 'paddingLeft') +
//        this._getStylePix(pe, 'borderLeftWidth'));
//      offsetLeft += l;
      var r =
       (this._getStylePix(pe, 'marginRight') +
        this._getStylePix(pe, 'paddingRight') +
        this._getStylePix(pe, 'borderRightWidth'));
      offsetRight += r;
      pe = pe.parentNode; 
    } while (pe);
    return ( this._containerWidth() - (offsetLeft + offsetRight + right) );
  },

  /**
   * [ Private ] 引数で渡された要素の上固定位置から算出した高さを取得します。
   *
   * @method _getTopFixedHeight
   * @param  {Object}  el  配置固定する要素オブジェクト
   * @param  {Integer} top 配置固定する要素の上位置
   * @return {Float}   高さ
   */
  _getTopFixedHeight: function(el, top) {
    var offsetTop = Element.Methods.cumulativeOffset(el).top;
    var pe = el;
    do {
// 「Element.Methods.cumulativeOffset」により、top位置はさかのぼって
//  算出されているので加算しない
//      var t =
//       (this._getStylePix(pe, 'marginTop') +
//        this._getStylePix(pe, 'paddingTop') +
//        this._getStylePix(pe, 'borderTopWidth'));
//      offsetTop += t;
      var b =
      (this._getStylePix(pe, 'marginBottom') +
        this._getStylePix(pe, 'paddingBottom') +
        this._getStylePix(pe, 'borderBottomWidth'));
      offsetBottom += b;
      pe = pe.parentNode; 
    } while (pe); 
    return ( this._containerHeight() - (offsetTop + offsetBottom + top) );
  },

  /**
   * [ Private ] 引数で渡された要素の下固定位置から算出した高さを取得します。
   *
   * @method _getBottomFixedHeight
   * @param  {Object}  el     配置固定する要素オブジェクト
   * @param  {Integer} bottom 配置固定する要素の下位置
   * @return {Float}   高さ
   */
  _getBottomFixedHeight: function(el, bottom) {
    var offsetTop = Element.Methods.cumulativeOffset(el).top;
      offsetTop +=
       (this._getStylePix(el, 'marginTop') +
        this._getStylePix(el, 'paddingTop') +
        this._getStylePix(el, 'borderTopWidth'));
    var offsetBottom = 0;
    var pe = el;
    do {
// 「Element.Methods.cumulativeOffset」により、top位置はさかのぼって
//  算出されているので加算しない
//      var t =
//       (this._getStylePix(pe, 'marginTop') +
//        this._getStylePix(pe, 'paddingTop') +
//        this._getStylePix(pe, 'borderTopWidth'));
//      offsetTop += t;
      var b =
      (this._getStylePix(pe, 'marginBottom') +
        this._getStylePix(pe, 'paddingBottom') +
        this._getStylePix(pe, 'borderBottomWidth'));
      offsetBottom += b;
      pe = pe.parentNode;
    } while (pe);
    return ( this._containerHeight() - (offsetTop + offsetBottom + bottom) );
  },

  /**
   * [ Private ] 引数で渡された要素のスタイルを取得します。
   *
   * @method _getBottomFixedHeight
   * @param  {Object} el    要素オブジェクト
   * @param  {String} style スタイル名
   * @return {Float}  スタイル値
   */
  _getStylePix: function(el, style) {
    try {
      var _value = parseFloat(Element.Methods.getStyle(el, style));
      return (isNaN(_value)) ? 0 : _value;
    } catch(e) {
      return 0;
    }
  },

  /**
   * [ Private ] onload時の処理を行います。
   *
   * @method _onLoad
   */
  _onLoad: function() {
    this.lastWidth  = this._containerWidth(); 
    this.lastHeight = this._containerHeight(); 
  },

  /**
   * [ Private ] resize時の処理を行います（タイマー設定のみ）。
   *
   * @method _onResize
   */
  _onResize: function(e) {
    try { window.clearTimeout(this.updateTimer); } catch(e) {} 
    this.updateTimer = window.setTimeout(this._updateBounds.bind(this), this.timer);
  },
  
  /**
   * [ Private ] resize時の処理を行います。
   *
   * @method _updateBounds
   */
  _updateBounds: function() {
    if (Prototype.Browser.IE && this.resizing == true) {
      return;
    }
    this.resizing = true;
    this._subtract = false;
    document.body.style.cursor = 'wait';
    try {
      var newWidth  = this._containerWidth(); 
      var newHeight = this._containerHeight(); 
      var offsetX = newWidth - this.lastWidth;
      var offsetY = newHeight - this.lastHeight;
      this.lastWidth = newWidth;
      this.lastHeight = newHeight;
      if (((offsetX != 0) || (offsetY != 0)) || arguments[0] == true) {
        var originalW = new Array();
        var originalH = new Array();
        for (var i=0; i<this.elements.length; i++) {
//          originalW[i] = $(this.elements[i].id).style.width;
//          originalH[i] = $(this.elements[i].id).style.height;
//          $(this.elements[i].id).style.width = '1px';
//          $(this.elements[i].id).style.height = '1px';
			var _el = $(this.elements[i].id);
			if (!_el) continue;
			originalW[i] = _el.style.width;
			originalH[i] = _el.style.height;
			_el.setStyle({
				'width' : '1px',
				'height' : '1px'
			});
        }
        for (var i=0; i<this.elements.length; i++) {
		  if (!$(this.elements[i].id)) continue;
          this._doLayout(this.elements[i], originalW[i], originalH[i]);
        }
      }
    }
    catch(e) {
      alert(e);
    }
    
    this.updateTimer = null;
    this.resizing = false;
    document.body.style.cursor = 'default';
  },

  /**
   * [ Private ] documentの幅を取得します。
   *
   * @method _containerWidth
   * @return 幅
   */
  _containerWidth: function() {
    var d = document.viewport.getDimensions();
    var w = (d.width < this.minWidth) ? this.minWidth : d.width;  
    return (this.maxWidth < w) ? this.maxWidth : w;
  },

  /**
   * [ Private ] documentの高さを取得します。
   *
   * @method _containerHeight
   * @return 高さ
   */
  _containerHeight: function() {
    var d = document.viewport.getDimensions();
    return (d.height < this.minHeight) ? this.minHeight : d.height;  
  },

  /**
   * [ Private ] スクロールバーのデフォルトサイズを取得します。
   *
   * @method _getScrollBarSize
   * @return スクロールバーのデフォルトサイズ
   */
  _getScrollBarSize: function() {
    return (Prototype.Browser.Opera) ? 18 : 17;  
  }

});﻿
