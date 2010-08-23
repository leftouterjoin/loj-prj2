/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

/*
 * ダイアログ dialog.js
 * 
 * @author LittleSoft Corporation
 * @version 1.2.3
 */
ls.Dialog = Class.create({

  /**
   * オブジェクトの初期処理を行います。
   *
   * @method initialize
   * @param  {String} id   オブジェクトID
   * @param  {Array}  prop オブジェクトプロパティ配列
   */
  initialize: function(id, prop) {

    //オブジェクトID
    this.id          = id;

    //オブジェクトプロパティ
    this.top         = null;
    this.left        = null;
    this.width       = 200;
    this.height      = 200;
    this.minWidth    = 200;
    this.minHeight   = 200;
    this.center      = false;
    this.modal       = false;
    this.backGroundImage = null;
    this.backGroundElement = document.body;
    this.title       = "ダイアログ";
    this.movable     = true;
    this.resizable   = true;
	  this.closeButton = true;

    //オブジェクト
    this.dialogTab   = null;
    this.dialogFrame = null;
    this.dialogDummy = null;
    this.dialogHead  = null;
    this.dialogBack  = null;

    //イベント関連
    this.tabX      = null;
    this.tabY      = null;
    this.eventOrgX = null;
    this.eventOrgY = null;
    this.eventOrgWidth  = null;
    this.eventOrgHeight = null;
    this.isMove    = false;
    this.isResize  = false;

    //オブジェクトプロパティの設定
    if (prop!=undefined) {
      if (prop.left!=undefined) this.left = prop.left;
      if (prop.top!=undefined)  this.top  = prop.top;
      if (prop.left==undefined && prop.top==undefined) this.center = true;
      if (prop.width!=undefined)  this.width  = prop.width;
      if (prop.height!=undefined) this.height = prop.height;
      if (prop.modal!=undefined)  this.modal  = prop.modal;
      if (prop.backbackGroundImage!=undefined) this.backGroundImage = prop.backbackGroundImage; //互換性の為
      if (prop.backGroundImage!=undefined) this.backGroundImage = prop.backGroundImage;
      if (prop.title!=undefined) this.title = prop.title;
      if (prop.movable!=undefined) this.movable = prop.movable;
      if (prop.closeButton!=undefined) this.closeButton = prop.closeButton;
      if (prop.resizable!=undefined) this.resizable = prop.resizable;
      if (prop.minWidth!=undefined)  this.minWidth  = prop.minWidth;
      if (prop.minHeight!=undefined) this.minHeight = prop.minHeight;
      if (prop.backGroundElement!=undefined) this.backGroundElement = prop.backGroundElement;
    }

    //モーダル用のレイヤ追加
    if (this.modal) {
      new Insertion.Bottom(document.body,
        '<div id="' + this.id + '_Back" style="display:none;" class="lsDialogBackImage"></div>');
    }

    //タブ、IFRAME、ダミーレイヤ追加
  	var _cb = (this.closeButton) ? '<div class="lsDialogHeadClose" id="'+this.id+'_btn_close"></div>' : '';
  	var _ld = '<div class="lsDialogLoading" id="'+this.id+'_loading" style="display:none;"></div>';
  	var _src = '';
    if (ls.isMSIE6()) {
      _src = ' src="ls/dummy.htm" ';
    }
    new Insertion.Bottom(document.body,
        '<div id="' + this.id + '" class="lsDialog" style="display:none;">' +
        _cb +
        _ld +
        '  <table width="100%" height="100%">' +
        '    <tr>' +
        '      <td class="lsDialogHeadL">&nbsp;</td>' +
        '      <td class="lsDialogHeadC"><div id="' + this.id + '_Head" class="lsDialogHead"></div></td>' +
        '      <td class="lsDialogHeadR">&nbsp;</td>' +
        '    </tr>' +
        '    <tr>' +
        '      <td class="lsDialogBodyL">&nbsp;</td>' +
        '      <td class="lsDialogBodyC"><iframe ' + _src + ' id="' + this.id + '_Frame" name="' + this.id + '_Frame" class="lsDialogFrame"' +
        '                                        frameborder="0" marginwidth="0" marginheight="0"></iframe></td>' +
        '      <td class="lsDialogBodyR">&nbsp;</td>' +
        '    </tr>' +
        '    <tr>' +
        '      <td class="lsDialogFootL">&nbsp;</td>' +
        '      <td class="lsDialogFootC">&nbsp;</td>' +
        '      <td class="lsDialogFootR" id="' + this.id + '_dwResize">&nbsp;</td>' +
        '    </tr>' +
        '  </table>' +
        '</div>'+
        '<div id="' + this.id + '_Tab" class="lsDialogTab" style="display:none;"></div>' +
        '<div id="' + this.id + '_Dummy" style="display:none;" class="lsDialogDummy"></div>'
    );
    
    //IE6セレクトボックスのz-index対策
    if (ls.isMSIE6()) {
      new Insertion.Bottom(document.body,
        '<iframe src="ls/dummy.htm" class="lsDialogDummyFrame" id="' + this.id + '_DummyFrame1" name="' + this.id + '_DummyFrame1" frameborder="0" marginwidth="0" marginheight="0" style="position:absolute;display:none;"></iframe>' +
        '<iframe src="ls/dummy.htm" class="lsDialogDummyFrame" id="' + this.id + '_DummyFrame2" name="' + this.id + '_DummyFrame2" frameborder="0" marginwidth="0" marginheight="0" style="position:absolute;display:none;"></iframe>'
      );
    }

    //エレメント
    this.dialog      = $(this.id);
    this.dialogTab   = $(this.id + "_Tab");
    this.dialogFrame = $(this.id + "_Frame");
    this.dialogDummy = $(this.id + "_Dummy");
    this.dialogHead  = $(this.id + "_Head");
    this.dialogLoading = $(this.id + "_loading");
    if (this.modal) {
      this.dialogBack  = $(this.id + "_Back");
      if (this.backGroundImage != null) {
        this.dialogBack.setStyle(
          {'background' : 'transparent url('+this.backGroundImage+') repeat scroll left top'}
        );
      }
      //再リサイズ
      if(ls.ResizeInstance!=null) ls.ResizeInstance.setAnchor(this.id + "_Back",{bottom:0, right:0});
    }
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1 = $(this.id + "_DummyFrame1");
      this.dialogDummyFrame2 = $(this.id + "_DummyFrame2");
    }
    
    if (this.modal) {
      this.dialog._lsUIWidget = this;
    }

    //タイトル設定
    this.setTitle(this.title);

    //ドラッグイベント設定
    if (this.movable) {
      var eventTarget = window;
      if (Prototype.Browser.IE) eventTarget = window.document;
      Event.observe(eventTarget, "mousedown", this._onMouseDown.bindAsEventListener(this));
      Event.observe(eventTarget, "mousemove", this._onMouseMove.bindAsEventListener(this));
      Event.observe(eventTarget, "mouseup",   this._onMouseUp.bindAsEventListener(this));
    }
    if (!window.dialogLayer) {
      window.dialogLayer = new Array();
      window.dialogLayer[0] = new Array(window.document.body);
    }
    
    if (this.closeButton) Event.observe($(this.id + "_btn_close"), "click", this.hide.bindAsEventListener(this));
    
    //onload時のイベント設定
    Event.observe(this.dialogFrame, "load", this._onLoad.bindAsEventListener(this));
    
    //リサイズ設定
    if (this.resizable) {        
      $(this.id + '_dwResize').removeClassName('lsDialogFootR');
      $(this.id + '_dwResize').addClassName('lsDialogFootRResize');
    }

  },

  /**
   * [ Public ] ダイアログのタイトルを設定します。
   *
   * @method setTitle
   * @param  {Object} arguments[0] タイトル文字列
   */
  setTitle: function () {
    this.title = arguments[0];
    this.dialogHead.update(this.title);
  },

  /**
   * [ Public ] 引数で指定されたHTMLファイルをダイアログ内に表示します。
   *
   * @method show
   * @param  {String} src HTMLファイル
   */
  show: function(src) {
	if (Prototype.Browser.IE) {
		// IEでのonload代用処理
		this.dialogFrame.onreadystatechange = function () {
			if (this.dialogFrame.readyState == 'complete') {
  				if (this.modal) this.dialogBack.show();
    			this.dialog.show();
    			this.dialogTab.show();
				this.dialogFrame.onreadystatechange = null;
			}
		}.bind(this);
	}
	else {
		Event.observe(this.dialogFrame, "load", this._onLoadComplete.bindAsEventListener(this));
	}
    this.dialogFrame.contentWindow.location.href = src;
    //透過設定
    this.dialogDummy.setOpacity(0.0);
    this.dialogTab.setOpacity(0.0);
    //モーダルの場合
    if (this.modal) {
      //透過設定
      this.dialogBack.setOpacity(0.2);
      //モーダルレイヤのサイズ、位置調整
      this.dialogBack.setStyle({
             'width'  : (Element.getWidth(this.backGroundElement) + 'px')
            ,'height' : (Element.getHeight(this.backGroundElement) + 'px')
            ,'top'    : (this._getStylePix(this.backGroundElement, 'marginTop') + 'px')
            ,'left'   : (this._getStylePix(this.backGroundElement, 'marginLeft') + 'px')
      });
      //IE6セレクトボックスのz-index対策
      if (ls.isMSIE6()) {
        var sels = document.body.getElementsByTagName('select');
        var oldDiabled = new Array();
        for (var i = 0; i < sels.length; i++) {
          oldDiabled.push(sels[i].disabled);
          sels[i].disabled = true;
        }
        this.dialogFrame._oldDiabled = oldDiabled;
      }
    }
    
    //ダイアログレイヤのサイズ、z-index調整
    this._adjust({width:this.width, height:this.height});
    this.dialog.setStyle({'zIndex'     : '9994'});
    this.dialogTab.setStyle({'zIndex'  : '9993'});
    this.dialogDummy.setStyle({'zIndex': '9992'});
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.show();
      this.dialogDummyFrame2.show();
      this.dialogDummyFrame1.setStyle({'zIndex': '9991'});
      this.dialogDummyFrame2.setStyle({'zIndex': '9991'});
    }
    if (this.modal) {
      this.dialogBack.setStyle({'zIndex': '9990'});
    }
    this._adjustZIndex();
    
    //ダイアログレイヤの管理
    if (this.modal) {
      this.leyerNum = window.dialogLayer.length;
    }
    else {
      this.leyerNum = window.dialogLayer.length - 1;
    }
    if (!window.dialogLayer[this.leyerNum]) {
      window.dialogLayer[this.leyerNum] = new Array(this);
    }
    else {
      window.dialogLayer[this.leyerNum].push(this);
    }
    if (this.leyerNum > 0) {
      for (var i = 0; i < window.dialogLayer[this.leyerNum - 1].length; i++) {
        var obj = window.dialogLayer[this.leyerNum - 1][i];
        if (obj == window.document.body) {
          this._disableTabIndex(window.document.body);
        }
        else {
          this._disableTabIndex(obj.dialogFrame.contentWindow.document.body);
        }
      }
    }
  },
  
  _onLoadComplete: function() {
  	if (this.modal) this.dialogBack.show();
    this.dialog.show();
    this.dialogTab.show();
  },
  
  /**
   * [ Public ] リクエストを送信し、レスポンスをダイアログ内に表示します。
   *  lsjcontrol.htmlが必要です.
   * @method exec
   * @param  {String} arguments[0]   アクションメソッド名
   * @param  {String} arguments[1]～ アクションメソッド引数
   */
  exec: function() {
    if (this.modal) this.dialogBack.show();
    document[ls.defaultFormName].target = this.id + "_Frame";
    var _a = arguments;
    try {
      ls.exec.apply(this, _a);
    } catch (e) {
      this.hide();
      throw 'exception:exec submit';
    } finally {
      document[ls.defaultFormName].target = '';
    }
    //レイヤ表示
    this.dialog.setStyle({
             'top' : '0px'
            ,'left': '0px'
    });
    this.dialogTab.setStyle({
             'top' : '0px'
            ,'left': '0px'
    });
	this.dialogLoading.show();
    this.dialog.show();
    this.dialogTab.show();

    //透過設定
    this.dialogDummy.setOpacity(0.0);
    this.dialogTab.setOpacity(0.0);
    
    //モーダルの場合
    if (this.modal) {
      //透過設定
      this.dialogBack.setOpacity(0.2);
      //モーダルレイヤのサイズ、位置調整
      this.dialogBack.setStyle({
             'width'  : (Element.getWidth(this.backGroundElement) + 'px')
            ,'height' : (Element.getHeight(this.backGroundElement) + 'px')
            ,'top'    : (this._getStylePix(this.backGroundElement, 'marginTop') + 'px')
            ,'left'   : (this._getStylePix(this.backGroundElement, 'marginLeft') + 'px')
      });
      //IE6セレクトボックスのz-index対策
      if (ls.isMSIE6()) {
        var sels = document.body.getElementsByTagName('select');
        var oldDiabled = new Array();
        for (var i = 0; i < sels.length; i++) {
          oldDiabled.push(sels[i].disabled);
          sels[i].disabled = true;
        }
        this.dialogFrame._oldDiabled = oldDiabled;
      }
    }
    
    //ダイアログレイヤのサイズ、z-index調整
    this._adjust({width:this.width, height:this.height});
    this.dialog.setStyle({'zIndex'     : '9994'});
    this.dialogTab.setStyle({'zIndex'  : '9993'});
    this.dialogDummy.setStyle({'zIndex': '9992'});
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.show();
      this.dialogDummyFrame2.show();
      this.dialogDummyFrame1.setStyle({'zIndex': '9991'});
      this.dialogDummyFrame2.setStyle({'zIndex': '9991'});
    }
    if (this.modal) {
      this.dialogBack.setStyle({'zIndex': '9990'});
    }
    this._adjustZIndex();
    
    //ダイアログレイヤの管理
    if (this.modal) {
      this.leyerNum = window.dialogLayer.length;
    }
    else {
      this.leyerNum = window.dialogLayer.length - 1;
    }
    if (!window.dialogLayer[this.leyerNum]) {
      window.dialogLayer[this.leyerNum] = new Array(this);
    }
    else {
      window.dialogLayer[this.leyerNum].push(this);
    }
    this.leyerChildNum = window.dialogLayer[this.leyerNum].length - 1;
    
    if (this.leyerNum > 0) {
      for (var i = 0; i < window.dialogLayer[this.leyerNum - 1].length; i++) {
        var obj = window.dialogLayer[this.leyerNum - 1][i];
        if (obj == window.document.body) {
          this._disableTabIndex(window.document.body);
        }
        else {
          this._disableTabIndex(obj.dialogFrame.contentWindow.document.body);
        }
      }
    }
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
      return parseFloat(el.getStyle(style));
    }
    catch(e) {
      return 0;
    }
  },

  /**
   * [ Private ] windowリサイズ時に背景サイズを変更します。
   *
   * @method _resizeDialogBack
   */
  _resizeDialogBack: function(){
    if (this.dialogBack && Element.Methods.visible(this.dialogBack)) {
      this.dialogBack.setStyle({
             'width'  : (Element.getWidth(this.backGroundElement) + 'px')
            ,'height' : (Element.getHeight(this.backGroundElement) + 'px')
      });
    }
  },

  setSize: function(size) {
  	if (size.height) {
	  var _h = (size.height > this.minHeight) ? size.height : this.minHeight;
      this.dialogTab.setStyle({'height' : (_h + 'px')});
      if (ls.isMSIE6()) {
        this.dialogDummyFrame1.setStyle({'height' : (_h + 'px')});
      }
	  this.height = _h;
	}
  	if (size.width) {
	  var _w = (size.width > this.minWidth) ? size.width : this.minWidth;
      this.dialogTab.setStyle({'width' : ((size.width) + 'px')});
      if (ls.isMSIE6()) {
        this.dialogDummyFrame1.setStyle({'width' : ((size.width) + 'px')});
      }
	  this.width = _w;
	}
    var w = this.dialogTab.getWidth();
    var h = this.dialogTab.getHeight();
      
    //IEとその他とでHeightの算出が違う為、調整
    var adjh = 0;
    if (Prototype.Browser.IE) {
      adjh = 64;
    }
    this.dialog.setStyle({
           'width'  : (w + 'px')
          ,'height' : ((h - adjh) + 'px')
    });
    this.dialogFrame.setStyle({
           'width'  : ((w - 36) + 'px')
          ,'height' : ((h - 64) + 'px')
    });
    if (ls.isMSIE6()) {
      this.dialogDummyFrame2.setStyle({
             'width'  : (w + 'px')
            ,'height' : (h + 'px')
      });
    }
	this._centering();
  },
  
  /**
   * [ Public ] ダイアログを非表示にします。
   *
   * @method hide
   */
  hide: function() {
    if (this.modal) {
      this.dialogBack.hide();
      if (ls.isMSIE6()) {
        var sels = document.body.getElementsByTagName('select');
        var oldDiabled = this.dialogFrame._oldDiabled;
        for (var i = 0; i < sels.length; i++) {
          sels[i].disabled = (oldDiabled[i]==true);
        }
      }
    }
    document[ls.defaultFormName].target = '';
    //LSJ連動の場合、アクションが発生してしまうのでリセットしない。
    //this.dialogFrame.contentWindow.location.href = '';
    var iframedoc;
	  if (document.all) {
      iframedoc = this.dialogFrame.contentWindow.document;
    } else {
      iframedoc = this.dialogFrame.contentDocument;
    }
    iframedoc.body.innerHTML = '';
    
    //レイヤ非表示
    //サイズ調整
    this.dialog.setStyle({
           'width'  : '0px'
          ,'height' : '0px'
    });
    this.dialogTab.setStyle({
           'width'  : '0px'
          ,'height' : '0px'
    });
    this.dialogDummy.setStyle({
           'width'  : '0px'
          ,'height' : '0px'
    });
    this.dialog.hide();
    this.dialogTab.hide();
    this.dialogDummy.hide();
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.hide();
      this.dialogDummyFrame2.hide();
    }
    
    //ダイアログレイヤの管理
    if (this.leyerNum > 0 && window.dialogLayer[this.leyerNum].length == 1) {
      for (var i = 0; i < window.dialogLayer[this.leyerNum - 1].length; i++) {
        var obj = window.dialogLayer[this.leyerNum - 1][i];
        if (obj == window.document.body) {
          this._enableTabIndex(window.document.body);
        }
        else {
          this._enableTabIndex(obj.dialogFrame.contentWindow.document.body);
        }
      }
    }
    if (window.dialogLayer[this.leyerNum].length == 1) {
      window.dialogLayer.splice(this.leyerNum, this.leyerNum);
    }
    else {
      window.dialogLayer[this.leyerNum].splice(this.leyerChildNum, this.leyerChildNum);
      for (var i = this.leyerChildNum; i < window.dialogLayer[this.leyerNum].length; i++) {
        window.dialogLayer[this.leyerNum][i].leyerChildNum = i;
      }
    }
    //再リサイズ
    if(ls.ResizeInstance!=null) ls.ResizeInstance._updateBounds();
  },

  /**
   * [ Private ] ダイアログのサイズを調整します。
   *
   * @method _adjust
   * @param  {String} prop サイズプロパティ配列
   */
  _adjust: function(prop) {
    //IEとその他とでHeightの算出が違う為、調整
    var adjh = 0;
    if (!Prototype.Browser.IE) {
      adjh = 64;
    }
    //サイズ調整
    this.dialogLoading.setStyle({
           'left' : (((prop.width + 36) / 2 - 24) + 'px')
          ,'top'  : (((prop.height + adjh) / 2 - 24) + 'px')
    });
    this.dialog.setStyle({
           'width'  : ((prop.width + 36) + 'px')
          ,'height' : ((prop.height + adjh) + 'px')
    });
    this.dialogTab.setStyle({
           'width'  : ((prop.width + 36) + 'px')
          ,'height' : ((prop.height + 64) + 'px')
    });
    this.dialogFrame.setStyle({
           'width'  : (prop.width + 'px')
          ,'height' : (prop.height + 'px')
    });
    this.dialogDummy.setStyle({
           'width'  : (Element.getWidth(this.backGroundElement) + 'px')
          ,'height' : (Element.getHeight(this.backGroundElement) + 'px')
    });
    
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.setStyle({
             'width'  : ((prop.width + 36) + 'px')
            ,'height' : ((prop.height + adjh) + 'px')
      });
      this.dialogDummyFrame2.setStyle({
             'width'  : ((prop.width + 36) + 'px')
            ,'height' : ((prop.height + adjh) + 'px')
      });
    }
    
    //センタリング
    if (this.center) {
      this._centering();
    }
    else {
      this.dialog.setStyle({
             'top'  : ((this.top  || 0) + 'px')
            ,'left' : ((this.left || 0) + 'px')
      });
    }
  },

  /**
   * [ Private ] ダイアログの表示位置を中央表示にします。
   *
   * @method _centering
   */
  _centering: function() {
    var viewOffset = document.viewport.getScrollOffsets();
//    var x = viewOffset.left + (document.viewport.getWidth()  - this.dialog.getWidth())  / 2;
    var x = viewOffset.left + (document.viewport.getWidth()  - (this.width + 36 - 8))  / 2;
//    var y = viewOffset.top  + (document.viewport.getHeight() - this.dialogFrame.getHeight()) / 2;
    var y = viewOffset.top  + (document.viewport.getHeight() - (this.height + 64)) / 2;
    this.dialog.setStyle({
           'top'  : (y + 'px')
          ,'left' : (x + 'px')
    });
    this.dialogTab.setStyle({
           'top'  : (y + 'px')
          ,'left' : (x + 'px')
    });
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.setStyle({
             'top'  : (y + 'px')
            ,'left' : (x + 'px')
      });
      this.dialogDummyFrame2.setStyle({
             'top'  : (y + 'px')
            ,'left' : (x + 'px')
      });
    }
  },

  /**
   * [ Private ] マウスボタンダウン イベント発生時の処理分岐
   *
   * @method _onMouseDown
   * @param  {Object} event 発生イベント
   */
  _onMouseDown: function(event) {

    if (Event.element(event) == this.dialogHead) {
      this._onMouseDownMove(event);
    }
    else if (this.resizable && Event.element(event) == $(this.id + '_dwResize')) {
      this._onMouseDownResize(event);
    }
    else {
      return;
    }

  },
  
  /**
   * [ Private ] マウスボタンダウン イベント発生時（ダイアログ移動時）
   *
   * @method _onMouseDownMove
   * @param  {Object} event 発生イベント
   */
  _onMouseDownMove: function(event) {

    //発生エレメントがタブレイヤで非ドラッグ状態の場合のみ
    if (this.isMove) return;

    //マウスカーソル変更
    this.dialogTab.setStyle({'cursor' : 'move'});
    
    //選択不可
    this._disableSelect(event);

    var viewOffset = document.viewport.getScrollOffsets();

    //タブレイヤの初期位置、ドラッグ開始位置を記憶
    var posT = Position.cumulativeOffset(this.dialogTab);
    this.tabX = viewOffset.left + posT[0];
    this.tabY = viewOffset.top  + posT[1];
    this.eventOrgX = viewOffset.left + Event.pointerX(event||window.event);
    this.eventOrgY = viewOffset.top  + Event.pointerY(event||window.event);

    //ダミーレイヤを表示
    this.dialogDummy.show();
    this.dialogTab.setOpacity(0.5);
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.show();
      this.dialogDummyFrame2.show();
      this.dialogDummyFrame1.setOpacity(0.0);
      this.dialogDummyFrame2.setOpacity(0.0);
    }
    
    //レイヤのZ方向の順番を変更
    this.dialog.setStyle({'zIndex'      : '9991'});
    this.dialogTab.setStyle({'zIndex'   : '9994'});
    this.dialogDummy.setStyle({'zIndex' : '9993'});
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.setStyle({'zIndex' : '9992'});
      this.dialogDummyFrame2.setStyle({'zIndex' : '9992'});
    }
    this._adjustZIndex();
    //ドラッグ状態
    this.isMove = true;

  },
  
  
  /**
   * [ Private ] マウスボタンダウン イベント発生時（ダイアログリサイズ時）
   *
   * @method _onMouseDownResize
   * @param  {Object} event 発生イベント
   */
  _onMouseDownResize: function(event) {

    if (this.isResize) return;

    //マウスカーソル変更
    this.dialogTab.setStyle({'cursor' : 'nw-resize'});
      
    //選択不可
    this._disableSelect(event);

    var viewOffset = document.viewport.getScrollOffsets();

    //タブレイヤの初期位置、ドラッグ開始位置を記憶
    var posT = Position.cumulativeOffset(this.dialogTab);
    this.eventOrgX = viewOffset.left + Event.pointerX(event||window.event);
    this.eventOrgY = viewOffset.top  + Event.pointerY(event||window.event);
    this.eventOrgWidth  = this.dialogTab.getWidth();
    this.eventOrgHeight = this.dialogTab.getHeight();
    
    //ダミーレイヤを表示
    this.dialogDummy.show();
    this.dialogTab.setOpacity(0.5);
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.show();
      this.dialogDummyFrame2.show();
      this.dialogDummyFrame1.setOpacity(0.0);
      this.dialogDummyFrame2.setOpacity(0.0);
    }

    //レイヤのZ方向の順番を変更
    this.dialog.setStyle({'zIndex'      : '9991'});
    this.dialogTab.setStyle({'zIndex'   : '9994'});
    this.dialogDummy.setStyle({'zIndex' : '9993'});
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.setStyle({'zIndex' : '9992'});
      this.dialogDummyFrame2.setStyle({'zIndex' : '9992'});
    }
    this._adjustZIndex();
    
    this.isResize = true;

  },

  /**
   * [ Private ] 他ダイアログのZ-INDEXを調整します。
   * (自ダイアログ以外のダイアログ構成要素のz-indexを「-10」します。)
   *
   * @method _adjustZIndex
   */
  _adjustZIndex: function() {
    for (var i=0; i<window.document.body.childNodes.length; i++) {
      var element = window.document.body.childNodes[i];
      if (element.className) {
        if ((Element.hasClassName(element, "lsDialogBackImage") && element.id != (this.id + "_Back")) ||
            (Element.hasClassName(element, "lsDialog")          && element.id != (this.id)) ||
            (Element.hasClassName(element, "lsDialogTab")       && element.id != (this.id + "_Tab")) ||
            (Element.hasClassName(element, "lsDialogDummy")     && element.id != (this.id + "_Dummy")) ||
            (Element.hasClassName(element, "lsDialogDummyFrame")&& element.id != (this.id + "_DummyFrame1")) ||
            (Element.hasClassName(element, "lsDialogDummyFrame")&& element.id != (this.id + "_DummyFrame2"))) {
           element.setStyle({'zIndex' : (element.getStyle('zIndex') - 10).toString()});
        }
      }
    }
  },

  /**
   * [ Private ] マウス移動 イベント発生時
   *
   * @method _onMouseMove
   * @param  {Object} event 発生イベント
   */
  _onMouseMove: function(event) {

    //ドラッグ状態の場合
    if (this.isMove) {
      var viewOffset = document.viewport.getScrollOffsets();

      //タブレイヤの位置を調整
      event = event||window.event;
      var x = viewOffset.left + event.clientX - this.eventOrgX + this.tabX;
      var y = viewOffset.top  + event.clientY - this.eventOrgY + this.tabY;
      this._setPosition(x, y);
    }
    //リサイズ状態の場合
    else if (this.isResize) {

      var viewOffset = document.viewport.getScrollOffsets();
      //タブレイヤの位置を調整
      event = event||window.event;
      var x = event.clientX - this.eventOrgX;
      var y = event.clientY - this.eventOrgY;
      
      if (this.eventOrgHeight + y > this.minHeight) {
        this.dialogTab.setStyle({'height' : ((this.eventOrgHeight + y) + 'px')});
        if (ls.isMSIE6()) {
          this.dialogDummyFrame1.setStyle({'height' : ((this.eventOrgHeight + y) + 'px')});
        }
      }
      if (this.eventOrgWidth + x > this.minWidth) {
        this.dialogTab.setStyle({'width' : ((this.eventOrgWidth + x) + 'px')});
        if (ls.isMSIE6()) {
          this.dialogDummyFrame1.setStyle({'width' : ((this.eventOrgWidth + x) + 'px')});
        }
      }
    }
    //その他の場合
    else {
      return;
    }

  },

  /**
   * [ Private ] マウスボタンアップ イベント発生時
   *
   * @method _onMouseUp
   * @param  {Object} event 発生イベント
   */
  _onMouseUp: function(event) {

    //ドラッグ状態の場合
    if (this.isMove) {

      //IFRAME位置を調整
      var x = Event.pointerX(event||window.event) - this.eventOrgX + this.tabX;
      var y = Event.pointerY(event||window.event) - this.eventOrgY + this.tabY;
      
      //上＆左の制限
      if (x < 0)  x = 0;
      if (y < 0)  y = 0;
      //右の制限
      var currentRight = x + this.dialogTab.getWidth();
      var maxRight = this.backGroundElement.getWidth()-this.dialogTab.getWidth();
      if (x > maxRight) x = maxRight;
      //下の制限
      var currentBottom = y + this.dialogTab.getHeight();
      var maxBottom = this.backGroundElement.getHeight()-this.dialogTab.getHeight()-3;
      if (y > maxBottom) y = maxBottom;
      
      this.dialog.setStyle({
             'top'  : (y + 'px')
            ,'left' : (x + 'px')
      });
      if (ls.isMSIE6()) {
        this.dialogDummyFrame2.setStyle({
               'top'  : (y + 'px')
              ,'left' : (x + 'px')
        });
      }

      //レイヤのZ方向の順番を変更
      this.dialog.setStyle({'zIndex'      : '9994'});
      this.dialogTab.setStyle({'zIndex'   : '9993'});
      this.dialogDummy.setStyle({'zIndex' : '9992'});
      if (ls.isMSIE6()) {
        this.dialogDummyFrame1.setStyle({'zIndex' : '9991'});
        this.dialogDummyFrame2.setStyle({'zIndex' : '9991'});
      }

      //ダミーレイヤを非表示
      this.dialogDummy.hide();
      this.dialogTab.setOpacity(0.0);

      //選択不可の解除
      this._enableSelect();

      //ドラッグ状態解除
      this.isMove = false;
      
      this.dialogTab.setStyle({'cursor' : 'default'});
    }
    //リサイズ状態の場合
    else if (this.isResize) {

      var w = this.dialogTab.getWidth();
      var h = this.dialogTab.getHeight();
      
      //IEとその他とでHeightの算出が違う為、調整
      var adjh = 0;
      if (Prototype.Browser.IE) {
        adjh = 64;
      }
      this.dialog.setStyle({
             'width'  : (w + 'px')
            ,'height' : ((h - adjh) + 'px')
      });
      this.dialogFrame.setStyle({
             'width'  : ((w - 36) + 'px')
            ,'height' : ((h - 64) + 'px')
      });
      if (ls.isMSIE6()) {
        this.dialogDummyFrame2.setStyle({
               'width'  : (w + 'px')
              ,'height' : (h + 'px')
        });
      }
      
      //レイヤのZ方向の順番を変更
      this.dialog.setStyle({'zIndex'      : '9994'});
      this.dialogTab.setStyle({'zIndex'   : '9993'});
      this.dialogDummy.setStyle({'zIndex' : '9992'});
      if (ls.isMSIE6()) {
        this.dialogDummyFrame1.setStyle({'zIndex' : '9991'});
        this.dialogDummyFrame2.setStyle({'zIndex' : '9991'});
      }

      //ダミーレイヤを非表示
      this.dialogDummy.hide();
      this.dialogTab.setOpacity(0.0);

      //選択不可の解除
      this._enableSelect();
    
      //リサイズ状態解除
      this.isResize = false;
      
      this.dialogTab.setStyle({'cursor' : 'default'});
    }
    //その他の場合
    else {
      return;
    }

  },

  /**
   * [ Private ] ダイアログのタブレイヤ位置を再設定します。
   *
   * @method _setPosition
   * @param  {Object} event 発生イベント
   */
  _setPosition: function(x, y) {
    //上＆左の制限
    if (x < 0)  x = 0;
    if (y < 0)  y = 0;
    //右の制限
    var currentRight = x + this.dialogTab.getWidth();
    var maxRight = this.backGroundElement.getWidth()-this.dialogTab.getWidth();
    if (x > maxRight) x = maxRight;
    //下の制限
    var currentBottom = y + this.dialogTab.getHeight();
      var maxBottom = this.backGroundElement.getHeight()-this.dialogTab.getHeight()-3;
    if (y > maxBottom) y = maxBottom;
    
    this.dialogTab.setStyle({
           'top'  : (y + 'px')
          ,'left' : (x + 'px')
    });
    if (ls.isMSIE6()) {
      this.dialogDummyFrame1.setStyle({
             'top'  : (y + 'px')
            ,'left' : (x + 'px')
      });
    }
  },

  /**
   * [ Private ] ドラッグ中の選択を不可に設定する。
   *
   * @method _disableSelect
   * @param  {Object} event 発生イベント
   */
  _disableSelect: function(event) {
    if (Prototype.Browser.IE) {
      document.body.onselectstart = function(e) { return false };
    } else {
      try { event.preventDefault(); } catch(e) {}
    }
  },

  /**
   * [ Private ] 選択不可を解除する。
   *
   * @method _enableSelect
   * @param  {Object} event 発生イベント
   */
  _enableSelect: function() {
    if (Prototype.Browser.IE) document.body.onselectstart = "";
  },

  /**
   * [ Private ] ダイアログ読み込み後の処理を行います。
   *
   * @method _onLoad
   * @param  {Object} event 発生イベント
   */
  _onLoad: function(event) {
    try {
	  this.dialogLoading.hide();
      this.dialogFrame.contentWindow.document.body.tabIndex = -1;
      this._initForcus(this.dialogFrame.contentWindow.document.body);
    }
    catch (e) {}
  },

  /**
   * [ Private ] 引数配下の要素のTabIndexを有効にします。
   *
   * @method _enableTabIndex
   * @param  {Object} root 探索するRoot要素
   */
  _enableTabIndex: function(root) {
    for (var i=0; i<root.childNodes.length; i++) {
      var targetElement = root.childNodes[i];
      if (targetElement.getAttribute && targetElement.getAttribute('_dialog_disableTabIndex') == 'true') {
        targetElement.tabIndex = targetElement.getAttribute('_dialog_disableTabIndex_old');
      }
      if (targetElement.getAttribute && targetElement.getAttribute('_dialog_disable') == 'true') {
        targetElement.disabled = false;
      }
      if (targetElement.childNodes.length > 0) {
        this._enableTabIndex(targetElement);
      }
    }
  },
  
  /**
   * [ Private ] 引数配下の要素のTabIndexを無効にします。
   *
   * @method _disableTabIndex
   * @param  {Object} root 探索するRoot要素
   */
  _disableTabIndex: function(root) {
    for (var i=0; i<root.childNodes.length; i++) {
      var targetElement = root.childNodes[i];
      if (this._isTabIndexElement(targetElement)) {
        if (targetElement.type) {
          if (Prototype.Browser.IE && targetElement.type == 'radio' && targetElement.disabled == false) {
            targetElement.disabled = true;
            targetElement.setAttribute('_dialog_disable', 'true');
          }
          if (Prototype.Browser.Gecko && targetElement.type == 'file' && targetElement.disabled == false) {
            targetElement.disabled = true;
            targetElement.setAttribute('_dialog_disable', 'true');
          }
        }
        targetElement.setAttribute('_dialog_disableTabIndex', 'true');
        targetElement.setAttribute('_dialog_disableTabIndex_old', targetElement.tabIndex);
        targetElement.tabIndex = -1;
      }
      if (targetElement.childNodes.length > 0) {
        this._disableTabIndex(targetElement);
      }
    }
  },
  
  /**
   * [ Private ] TabIndex属性を指定できる要素か否かを取得します。
   *
   * @method _isTabIndexElement
   * @param  {Object} elm 要素
   */
  _isTabIndexElement: function(elm) {
    if (elm.tagName != 'A'        && elm.tagName != 'a'        &&
        elm.tagName != 'AREA'     && elm.tagName != 'area'     &&
        elm.tagName != 'INPUT'    && elm.tagName != 'input'    &&
        elm.tagName != 'OBJECT'   && elm.tagName != 'object'   &&
        elm.tagName != 'SELECT'   && elm.tagName != 'select'   &&
        elm.tagName != 'TEXTAREA' && elm.tagName != 'textarea' ) {
      return false;
    }
    return true;
  },
  
  /**
   * [ Private ] 引数配下の要素の内の最初の要素にフォーカスを設定します。
   *
   * @method _initForcus
   * @param  {Object} root 探索するRoot要素
   */
  _initForcus: function(root) {
    for (var i=0; i<root.childNodes.length; i++) {
      var targetElement = root.childNodes[i];
      if (this._isForcusElement(targetElement)) {
        var exec_ret = false;
        try {
          targetElement.focus();
          exec_ret = true;
        }
        catch (e) {
        }
        if (exec_ret) return true;
      }
      if (targetElement.childNodes.length > 0) {
        var ret = this._initForcus(targetElement);
        if (ret) return true; 
      }
    }
  },
  
  /**
   * [ Private ] フォーカスを設定する要素か否かを取得します。
   *
   * @method _isForcusElement
   * @param  {Object} elm 要素
   */
  _isForcusElement: function(elm) {
    if (elm.tagName != 'INPUT'    && elm.tagName != 'input'    &&
        elm.tagName != 'TEXTAREA' && elm.tagName != 'textarea' &&
        elm.tagName != 'SELECT'   && elm.tagName != 'select'   ) {
      return false;
    }
    if (!elm.focus) return false;
    if (elm.tabIndex == 'undefined' || elm.tabIndex == -1) return false;
    if (elm.disabled == 'undefined' || elm.disabled) return false;
    if (elm.type && elm.type == 'hidden') return false;
    if (elm.type && (elm.tagName == 'INPUT' || elm.tagName == 'input') && 
        (elm.type == 'submit' || elm.type == 'reset' || elm.type == 'button' || elm.type == 'image')) return false;
    if (elm.display    || elm.style.display == 'none') return false;
    if (elm.visibility || elm.style.visibility == 'hidden') return false;
    if ((elm.tagName == 'TEXTAREA' || elm.tagName == 'textarea')) {
      if(elm.getAttribute('readonly') != 'undefined') {
        if(elm.getAttribute('readonly') != 'false') {
           return false;
        }
      }
    }
    return true;
  }
  
});