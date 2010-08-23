/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */



/*
 * 埋め込みページ embedded.js
 * 
 * @author LittleSoft Corporation
 * @version 1.3
 */
ls.EmbeddedPageSeq = 0;
ls.EmbeddedPage = Class.create({

  FORM_NAME : 'form1',
  
  initialize: function(areaId, options) {
    this.options = Object.extend( {
      seq : ls.EmbeddedPageSeq++,
      className : '',
      url : '',
      areaId  : ''
    }, options);
    this.area = $(areaId);
  },
  
  _init: function(options) {
    this.options = Object.extend(this.options, options);
    if (!this.init) {
      var frameId = this.area.id + '_frame';
      var frame = 
        '<iframe style="position:relative; width:100%; height:100%;"' +
        ' name="' + frameId + '" id="' + frameId + '" ';
      if (this.options.url!='') {
        frame +=  ' src="' + this.options.url + '" ';
      } else {
        if (ls.isMSIE6()) {
          frame +=  ' src="ls/dummy.htm" ';
        }
      }
      frame +=  ' frameborder="0" marginwidth="0" marginheight="0"></iframe>';
      this.area.innerHTML = frame;
      this.area._lsUIWidget = this;
      this.iframe = $(frameId);
      this.options.areaId = this.area.id;
      this.init = true;
    }
  },
  
  show: function(options) {
    this._init(options);
    if (this.options.className!='') {
      document[this.FORM_NAME].target = this.iframe.name;
      try {
        ls.exec("startNewSubSession", this.options);
      } finally {
        document[this.FORM_NAME].target = '';
      }
    } else if (this.options.url!='') {
      document[this.FORM_NAME].target = this.iframe.name;
      try {
        document[this.FORM_NAME].location = this.options.url;
      } finally {
        document[this.FORM_NAME].target = '';
      }
    }
  }
});