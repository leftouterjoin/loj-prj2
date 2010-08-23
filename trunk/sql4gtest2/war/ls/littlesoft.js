/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

if(typeof(Prototype)=='undefined') 
  throw("littlesoft component requires including prototype.js library");

/*
 * for IE6 adjust load events order.
 *     IE6 has no XMLHttpRequest 
 */
if(Prototype.Browser.IE && !(window.XMLHttpRequest))(function() { 
  var eventCache ={};
  var wrapperCache = {};
  
  function getEventCache(elementID,eventName){
      if(!eventCache[elementID])eventCache[elementID]={};
      if(!eventCache[elementID][eventName])eventCache[elementID][eventName]=[];
      return eventCache[elementID][eventName];
  }

  function createFixedOrderWrapper(elementID,eventName){
    var wrapper= function(event){
        getEventCache(elementID,eventName).each(function(func){
            func(event);
        });
    };
    if(!wrapperCache[elementID])wrapperCache[elementID]= {};
    wrapperCache[elementID][eventName] = wrapper;
    return wrapper;
  }
  function getEventId(element) {
    return element._prototypeEventID || element._eventID;
  }
  function addEventListenerIE(element, eventName, func, capture){
    if (eventName.include(':')) {
      var id = getEventId(element);
      var length =getEventCache(id,eventName).push(func);
      if(length == 1) element.attachEvent('on'+eventName,createFixedOrderWrapper(id,eventName));
    } else {
      element.attachEvent('on' + eventName, func);
    }  
  }
  function removeEventListenerIE(element, eventName, func, capture){
    if (eventName.include(':')) {
      var id = getEventId(element);
      var cache = getEventCache(id,eventName);
      if (cache.length>0) {
        eventCache[id][eventName] = cache.without(func);
        if(eventCache[id][eventName].length == 0){
          element.detachEvent('on' + eventName, wrapperCache[id][eventName]);
        }
      }
    } else {
      element.detachEvent('on' + eventName, func);
    }  
  }

  Element.addMethods({
    addEventListener:addEventListenerIE,
    removeEventListener:removeEventListenerIE
  });
  Object.extend(window, {
    addEventListener: addEventListenerIE.methodize(),
    removeEventListener: removeEventListenerIE.methodize()
  });
  Object.extend(document, {
    addEventListener: addEventListenerIE.methodize(),
    removeEventListener: removeEventListenerIE.methodize()
  });
 (function(){
    var flag = true;
    Event.observe(window, 'load', function(){
      if(flag){
        document.fire('dom:loaded');
        document.stopObserving('dom:loaded');
      }
    });
    document.observe('dom:loaded',function(evt){
      flag =false;
    });
  })();
})();

/*
 * リトルソフト共通スクリプト littlesoft.js
 * 
 * @author LittleSoft Corporation
 * @version 1.2.3
 */
var ls = {
  /**
   * [ Private ] ソースをドキュメントに書き出します。
   *
   * @method _include
   * @param  {String} src スクリプトのURL
   */
  _include: function(src) {
    document.write('<script type="text\/javascript" src="'+src+'"><\/script>');
  },

  /**
   * [ Private ] パラメータで指定されたスクリプトを書き出します。
   *
   * @method _include
   */
  _load: function() {
    var js = /littlesoft\.js(\?.*)?$/;
    $$('head script[src]').findAll(function(s) {
      return s.src.match(js);
    }).each(function(s) {
      var path = s.src.replace(js, ''),
      includes = s.src.match(/\?.*load=([a-z,]*)/);
      (includes ? includes[1] : 'calendar,dialog,ganttview,datagrid,resizemanager,splitter,treeview,embedded,jws,listview,boot').split(',').each(
       function(include) { ls._include(path+include+'\/'+include+'.js') });
    });
  },

  /**
   * [ Public ] 共通文字列定数
   */
  LSCNS_NULLSTRING : '',
  LSCNS_td         : 'td',
  LSCNS_th         : 'th',
  LSCNS_TD         : 'TD',
  LSCNS_TH         : 'TH',
  LSCNS_tr         : 'tr',
  LSCNS_TR         : 'TR',
  LSCNS_none       : 'none',
  LSCNS_hidden     : 'hidden',
  LSCNS_px         : 'px',
  
  /**
   * [ Public ] IE6か否かを判定します。
   *
   * @method isMSIE6
   * @return {Boolean} IE6か否か
   */
  isMSIE6: function() {
    return Prototype.Browser.IE && !(window.XMLHttpRequest); //IE6 has no XMLHttpRequest
  },
  
  /**
   * [ Public ] ウィンドウがダイアログか否かを判定します。
   *
   * @method isPopup
   * @return {Boolean} ダイアログか否か
   */
  isPopup: function() {
    return (window.name.indexOf('_Frame',0) >= 0);
  },

  /**
   *  [ Public ] アクションページから設定されるロード時の処理
   */
  loadScript: function(){}

};

Event.observe(document, 'dom:loaded', function(){
  ls.loadScript();
});

// スクリプト書き出し
ls._load();
