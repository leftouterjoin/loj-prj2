/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */


/*
 * スプリッター  splitter.js
 * 【使用方法】
 * 1.divタグで分割する領域を決める。親divの中に小divを二つ作る。
 * 2.小div二つにはidをつける
 * <div >
 *   <div id="upper" >・・・・・・ </div>
 *   <div id="lower" >・・・・・・ </div>
 * </div >
 * 3.JavaScriptでSplitterを作成
 *   new ls.Splitter('upper','lower',{size:2, horizontal:false, weight : 0.5});
 *   
 *   options 
 *     weight     : 初期状態の分割比重を少数、あるいはピクセル指定で設定する
 *                  ※値が１より大きい場合は自動的にpx指定と判断します。
 *     minWidth   : 分割領域の最小幅
 *     minHeight  : 分割領域の最小高
 *     horizontal : true -> 水平分割、false -> 垂直分割
 *     size       : 境界オブジェクトの太さ
 *     color      : 境界オブジェクトの色
 * @author LittleSoft Corporation
 * @version 1.2.3
 */
ls.Splitter = Class.create( {
  initialize : function(topLeftId, bottomRightId, options) {
    this.startPoint = {x:0,y:0};
    this.delta = {x:0,y:0};
    this.topLeftArea = $(topLeftId);
    if (this.topLeftArea == null) {
      alert('topLeftId is invalid.' + topLeftId);
      return;
    }
    this.bottomRightArea = $(bottomRightId);
    if (this.bottomRightArea == null) {
      alert('bottomRightId is invalid.' + bottomRightId);
      return;
    }
    this.options = Object.extend( {
      weight : 0.25,
      minWidth : 32,
      minHeight : 32,
      horizontal : true,
      size : 5,
      color : '#F2F2F2'
    }, options);
    this.topLeftArea.parentNode.style.position = 'relative';
    this.topLeftArea.style.position = 'absolute';
    this.bottomRightArea.style.position = 'absolute';
    var style = 'margin:0px;padding:0px;background:' + this.options.color + ';';
    if (this.options.horizontal) {
	    this.topLeftArea.setStyle({'float':'left'});
      style += 'cursor:w-resize;float:left;top:0px;height:100%;width:' + this.options.size + 'px;';
    } else {
      style += 'overflow:hidden;cursor:n-resize;left:0px;width:100%;height:' + this.options.size + 'px;';
    }
    var splitArea = '<div id="' + topLeftId
            + '_splitter" style="position:absolute;' + style
            + '"></div>';
    splitArea +=  '<div id="' + topLeftId + '_moving" ';
    if (this.options.horizontal) {
      splitArea += 'style="position:absolute;display:none;margin:0px;padding:0px;background:none;">';
      splitArea += '<div style="position:absolute;background:gray;cursor:w-resize;';
      splitArea += 'top:0px;left:' + this.HORIZONTAL_ADJUST + 'px;';
      splitArea += 'height:100%;width:' +  this.options.size + 'px;';
      splitArea += '"></div></div>';
    } else {
      splitArea += 'style="position:absolute;display:none;margin:0px;padding:0px;'
      splitArea += 'overflow:hidden;background:gray;height:' + this.options.size + 'px;cursor:n-resize;" ></div>';
    }
    new Insertion.Bottom(this.topLeftArea.parentNode, splitArea);
    this.area = $(topLeftId + '_splitter');
    this.movingSplitter = $(topLeftId + '_moving');
    this.topLeftArea.parentNode._lsUIWidget = this;
    
    if (!this.hMouseUp) {
      this.hMouseUp = this.onMouseUp.bindAsEventListener(this);
      Event.observe(Prototype.Browser.IE ? document.body : this.movingSplitter, 'mouseup', this.hMouseUp);
    }
    this.doLayout();
	this.dragStarted = false;
    if (!this.hMouseDown) {
      this.hMouseDown = this.onMouseDown.bindAsEventListener(this);
      Event.observe(this.area, 'mousedown', this.hMouseDown);
    }
    //if (!this.hMouseOver) {
    //  this.hMouseOver = this.onMouseOver.bindAsEventListener(this);
    //  Event.observe(this.area, 'mouseover', this.hMouseOver);
    //}
    if (!this.hMouseMove) {
      this.hMouseMove = this.onMouseMove.bindAsEventListener(this);
      Event.observe( Prototype.Browser.IE ? document.body : window , 'mousemove', this.hMouseMove);
    }
    //if (!this.hMouseOut) {
    //  this.hMouseOut = this.onMouseOut.bindAsEventListener(this);
    //  Event.observe(this.area, 'mouseout', this.hMouseOut);
    //}
  },

  _getStylePix : function(el, style) {
    try {
      var _value = parseFloat(Element.Methods.getStyle(el, style));
      return (isNaN(_value)) ? 0 : _value;
    } catch (e) {
      return 0;
    }
  },

  _getClientHeight : function(el, containerHeight) {
    return containerHeight - this._getTotalMarginHeight(el);
  },

  _getTotalMarginHeight : function(el) {
     return (this._getStylePix(el, 'marginTop')
           + this._getStylePix(el, 'paddingTop')
           + this._getStylePix(el, 'borderTopWidth')
           + this._getStylePix(el, 'marginBottom')
           + this._getStylePix(el, 'paddingBottom') + this._getStylePix(el,'borderBottomWidth'));
  },

  _getClientWidth : function(el, containerWidth) {
     return containerWidth - this._getTotalMarginWidth(el);
  },

  _getTotalMarginWidth : function(el) {
      return (this._getStylePix(el, 'marginLeft')
            + this._getStylePix(el, 'paddingLeft')
            + this._getStylePix(el, 'borderLeftWidth')
            + this._getStylePix(el, 'marginRight')
            + this._getStylePix(el, 'paddingRight') + this._getStylePix(el, 'borderRightWidth'));
  },

  doLayout : function() {
    var parentHeight = this.area.parentNode.clientHeight;
    var parentWidth  = this.area.parentNode.clientWidth;

    var clientHeight  = this._getClientHeight(this.topLeftArea, parentHeight);
    var clientWidth   = this._getClientWidth(this.topLeftArea, parentWidth);
    if (this.options.horizontal) {
        totalMargin   = this._getStylePix(this.topLeftArea, 'marginLeft')
                      + this._getStylePix(this.topLeftArea, 'borderLeftWidth')
                      + this._getStylePix(this.topLeftArea, 'marginRight') +
                        this._getStylePix(this.topLeftArea, 'borderRightWidth');
      this.topLeftArea.style.top = '0px';
      this.topLeftArea.style.height = clientHeight + 'px';
      this.topLeftArea.style.left = '0px';
      var w = (this.options.weight > 1) 
              ? this.options.weight : Math.floor(clientWidth * this.options.weight);
          w = (w < this.options.minWidth) 
              ? this.options.minWidth : w;
          w = (w > (clientWidth-totalMargin-this.options.minWidth)) 
              ? (clientWidth-totalMargin-this.options.minWidth) : w;
      this._hideChildren(this.topLeftArea);
      this.topLeftArea.style.width = w + 'px';
      clientHeight = this._getClientHeight(this.area, parentHeight);
      var left = (Prototype.Browser.IE) ? w : this.topLeftArea.clientWidth + totalMargin;
      this._getTotalMarginWidth(this.topLeftArea);
      this.area.style.top = '0px';
      this.area.style.height = clientHeight + 'px';
      this.area.style.left = left + 'px';
      this.area.style.width = this.options.size + 'px';
      this._adjustChildren(this.topLeftArea);
      
      this._hideChildren(this.bottomRightArea);      
      clientHeight = this._getClientHeight(this.bottomRightArea, parentHeight);
      clientWidth = this._getClientWidth(this.bottomRightArea, parentWidth);
      left = left + this.options.size;
      this.bottomRightArea.style.top = '0px';
      this.bottomRightArea.style.height = clientHeight + 'px';
      this.bottomRightArea.style.left = left + 'px';
      this.bottomRightArea.style.width = (clientWidth - left) + 'px';
      this._adjustChildren(this.bottomRightArea);
    } else {
      totalMargin   = this._getStylePix(this.topLeftArea, 'marginTop')
                    + this._getStylePix(this.topLeftArea, 'borderTopWidth')
                    + this._getStylePix(this.topLeftArea, 'marginBottom') +
                      this._getStylePix(this.topLeftArea, 'borderBottomWidth');
      this.topLeftArea.style.top = '0px';
      this.topLeftArea.style.left = '0px';
      this.topLeftArea.style.width = clientWidth + 'px';
      var h = (this.options.weight > 1) 
              ? this.options.weight : Math.floor(clientHeight * this.options.weight);
          h = (h < this.options.minHeight) 
              ? this.options.minHeight : h;
          h = (h > (clientHeight-totalMargin-this.options.minHeight)) 
              ? (clientHeight-totalMargin-this.options.minHeight) : h;
      this._hideChildren(this.topLeftArea);
      this.topLeftArea.style.height = h + 'px';
      clientWidth = this._getClientHeight(this.area, parentWidth);
      var top = this.topLeftArea.clientHeight + totalMargin;
      this._getTotalMarginHeight(this.topLeftArea);

      this.area.style.top = top + 'px';
      this.area.style.left = '0px';
      this.area.style.height = this.options.size + 'px';
      this.area.style.width = clientWidth + 'px';
      this._adjustChildren(this.topLeftArea);

      this._hideChildren(this.bottomRightArea);      
      clientHeight = this._getClientHeight(this.bottomRightArea, parentHeight);
      clientWidth = this._getClientWidth(this.bottomRightArea, parentWidth);
      top = top + this.options.size;
      this.bottomRightArea.style.top = top + 'px';
      this.bottomRightArea.style.height = (clientHeight - top) + 'px';
      this.bottomRightArea.style.left = '0px';
      this.bottomRightArea.style.width = clientWidth + 'px';
      this._adjustChildren(this.bottomRightArea);
    }
  },

  _hideChildren : function(parent) {
    var child;
    if (ls.isMSIE6()) {
      child = parent.firstChild;
      for (; child; child = child.nextSibling) {
        try { 
          child._display = '';
          if (child.style.display) {
            child._display = child.style.display;
          }
          child.style.display = 'none'; 
        } catch (e) {} 
      }
    }    
  },

  _adjustChildren : function(parent) {
    if (parent._lsUIWidget && parent._lsUIWidget.doLayout) {
      parent._lsUIWidget.doLayout();
    }
    var child;
    if (ls.isMSIE6()) {
      child = parent.firstChild;
      for (; child; child = child.nextSibling) {
        try { child.style.display = child._display; } catch (e) {} 
      }
    }  

  },
  
  HORIZONTAL_ADJUST:120,

  onMouseDown : function(event) {
	this._cancelSelect(event);
    this.startPoint = {x:0,y:0};
    this.delta = {x:0,y:0};
    this.startPoint.x = Event.pointerX(event);
    this.startPoint.y = Event.pointerY(event);
    this.movingSplitter.style.display = '';
    this.movingSplitter.style.top = this.area.style.top;
    this.movingSplitter.style.height = this.area.style.height;
    if (this.options.horizontal) {
      this.movingSplitter.style.left  = (this._getStylePix(this.area, 'left') - this.HORIZONTAL_ADJUST) + 'px';
      this.movingSplitter.style.width = (this.HORIZONTAL_ADJUST*2 + this.options.size) + 'px';
    } else {
      this.movingSplitter.style.left = this.area.style.left;
      this.movingSplitter.style.width = this.area.style.width;
    }
    this.dragStarted = true;
    //Event.stop(event);
  },
    
  onMouseMove : function(event) {
    if (this.dragStarted == false) return;
    this.delta.x = Event.pointerX(event) - this.startPoint.x;
    this.delta.y = Event.pointerY(event) - this.startPoint.y;
    if (this.delta.x!=0 || this.delta.y!=0) {
      if (this.options.horizontal) {
	    document.body.style.cursor = 'w-resize';
        var left = this._getStylePix(this.area, 'left') - this.HORIZONTAL_ADJUST;
        this.movingSplitter.style.left = (left + this.delta.x) + 'px';
      } else {
	    document.body.style.cursor = 'n-resize';
        var top = this._getStylePix(this.area, 'top');
        this.movingSplitter.style.top = (top + this.delta.y) + 'px';
      }
    }
    //Event.stop(event);
  },
  
 
  onMouseUp : function(event) {
    if (this.dragStarted == false) return;
	this._resetCancelSelect(event);
    this.delta.x = Event.pointerX(event) - this.startPoint.x;
    this.delta.y = Event.pointerY(event) - this.startPoint.y;
    if (this.movingSplitter && this.movingSplitter.style.display=='') {
      if (this.options.horizontal) {
        var w = this._getStylePix(this.topLeftArea, 'width');
        this.options.weight = w + this.delta.x;
      } else {
        var h = this._getStylePix(this.topLeftArea, 'height');
        this.options.weight = h + this.delta.y;
      }
      this.movingSplitter.style.display = 'none';
      this.doLayout();
      this.startPoint = {x:0,y:0};
      this.delta = {x:0,y:0};
      this.dragStarted = false;
	  document.body.style.cursor = 'default';
    }
    //Event.stop(event);
  },/*
  onMouseOver : function(event) {
    this.dragStarted = false;
  },
  onMouseOut : function(event) {
    this.dragStarted = false;
  },*/
  _cancelSelect: function(event) {
    if (Prototype.Browser.IE) {
      document.body.onselectstart = function(e) { return false };
    }
    else {
      try { event.preventDefault(); } catch(e) {}
    }
  },
  _resetCancelSelect: function(event) {
    if (Prototype.Browser.IE) {
      document.body.onselectstart = function(e) { return true };
    }
  }
});
