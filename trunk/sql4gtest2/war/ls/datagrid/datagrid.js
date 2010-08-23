/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

/*
 * データグリッド datagrid.js
 * 
 * @author LittleSoft Corporation
 * @version 1.2.3
 */
ls.DataGrid = Class.create( {

  
  RESIZE_COLUMN_WIDTH  : 0,
  RESIZE_COLUMN_HEADER : 1,
  
  initialize: function(area, prop) {
    this.initialSetting(area, prop);
    this.adjust();
    this.eventSetting();
    this.area._lsUIWidget = this;
  },
  
  initialSetting: function(area, prop) {
    this.area = $(area);

    if (!this.area) {
      return;
    }

    if (this.area.style.position == '') {
      this.area.style.position = 'relative';
    }
    this.area.style.overflow = 'hidden';
    this.colLen = 0;
    this.trSeq = 0;
    this.bottomFooter = true;
    this.colHeaderSize = 0;
    this.colWidths = new Array();
    if (prop!=undefined) {
      if (prop.colWidths!=undefined) {
        this.colWidths = prop.colWidths;
        this.colLen = this.colWidths.length;
        this.fixedWidth = true;
      }
      if (prop.colHeaderSize!=undefined) this.colHeaderSize = prop.colHeaderSize;
      if (prop.bottomFooter!=undefined) this.bottomFooter = prop.bottomFooter;
    } else {
      alert('error, missing properties.');
    }

    var barSize = this._getScrollBarSize() + 'px';
    
    new Insertion.Bottom(this.area,
      '<div id="' + this.area.id + 'VSL" style="position:absolute;overflow:hidden;display:none;margin:0px;padding:0px;width:1px;border-left:solid 1px #808080;"></div>' +
      '<div id="' + this.area.id + 'CRS" style="position:absolute;overflow:hidden;display:none;margin:0px;padding:0px;width:1px;border-left:dotted 2px black;"></div>' +
      '<div id="' + this.area.id + 'VBASE" style="position:absolute;margin:0px;padding:0px;width:18px;background-color:#CCC;overflow:hidden;">' +
      '<div id="' + this.area.id + 'VS" style="position:absolute;margin:0px;padding:0px;width:18px;overflow:scroll;background-color:#CCC;">' +
      '<div id="' + this.area.id + 'VSW" style="margin:0px;padding:0px;width:1px;">' +
      '</div></div></div>' +
      '<div id="' + this.area.id + 'HBASE" style="position:absolute;margin:0px;padding:0px;height:18px;background-color:#CCC;overflow:hidden;">' +
      '<div id="' + this.area.id + 'HRS" style="position:absolute;margin:0px;padding:0px;height:12px;' + 
      'width:1px;background-color:#dddddd;border:outset 2px #ffffff;overflow:hidden;cursor:col-resize;float:left;"></div>' +
      '<div id="' + this.area.id + 'HS" style="position:absolute;margin:0px;padding:0px;height:18px;overflow:scroll;background-color:#CCC;">' +
      '<div id="' + this.area.id + 'HSW" style="margin:0px;padding:0px;height:1px;">' +
      '</div></div></div>'
    );
    this.verticalSplitLine = $(this.area.id + 'VSL');
    this.vsBase = $(this.area.id + 'VBASE');
    this.vsBar = $(this.area.id + 'VS');
    this.vsHeight = $(this.area.id + 'VSW');
    if (!this.vScrollHdl) {
      this.vScrollHdl = this.onVScroll.bindAsEventListener(this);
      Event.observe(this.vsBar, 'scroll', this.vScrollHdl);
    }
    this.hsResizer = $(this.area.id + 'HRS');
    this.hsBase = $(this.area.id + 'HBASE');
    this.hsBar = $(this.area.id + 'HS');
    this.hsWidth = $(this.area.id + 'HSW');
    if (!this.hScrollHdl) {
      this.hScrollHdl = this.onHScroll.bindAsEventListener(this);
      Event.observe(this.hsBar, 'scroll', this.hScrollHdl);
    }
    this.colResizer = $(this.area.id + 'CRS');
    this.colResizing = false;
    this.colResizingTarget = null;
    this.colResizer.style.display = ls.LSCNS_none;
    this.rowElements = {};
  },
  
  doLayout: function() {
    this.setScrollBarPosition();
    this.setVisibleRows();
  },
  
  eventSetting: function() {
    if (!this.area) {
      return;
    }
    var thead = this.area.getElementsByTagName('thead')[0];
    var table = this.area.getElementsByTagName('table')[0];
    
    if (!this.hHScrollResizerMouseDown) {
      this.hHScrollResizerMouseDown = this.onHScrollResizerMouseDown.bindAsEventListener(this);
      Event.observe(this.hsResizer, 'mousedown', this.hHScrollResizerMouseDown);
    }
    if (!this.hHeaderMouseDown) {
      this.hHeaderMouseDown = this.onHeaderMouseDown.bindAsEventListener(this);
      Event.observe(thead, 'mousedown', this.hHeaderMouseDown);
    }
    if (!this.hHeaderMouseUp) {
      this.hHeaderMouseUp = this.onHeaderMouseUp.bindAsEventListener(this);
      Event.observe(document.body, 'mouseup', this.hHeaderMouseUp);
    }
    if (!this.hHeaderMouseMove) {
      this.hHeaderMouseMove = this.onHeaderMouseMove.bindAsEventListener(this);
      Event.observe(document.body, 'mousemove', this.hHeaderMouseMove);
    }
    if (!this.aScrollHdl) {
      this.aScrollHdl = this.onAreaScroll.bindAsEventListener(this);
      Event.observe(this.area, 'scroll', this.aScrollHdl);
    }
    if (!this.wheelHdl) {
      this.wheelHdl = this.onMouseWheel.bindAsEventListener(this);
      if (window.addEventListener && !Prototype.Browser.WebKit) {
        Event.observe(window, 'DOMMouseScroll', this.wheelHdl);
      } else {  
        Event.observe(document.body, 'mousewheel', this.wheelHdl);
      }
    }
    Element.childElements(this.area).each(function(obj) {   
      if (obj.style.display == 'none') obj.show();
    });
  },
  
  clearSelection: function() {
    try { window.getSelection().removeAllRanges();  } catch (e) { }
  },
  
  onHScrollResizerMouseDown: function(event) {
    var source = Event.element(event);
    if (source!=this.hsResizer) return;
    this.resizeAction = this.RESIZE_COLUMN_HEADER;
    this.colResizeStartX = Event.pointerX(event);
    var col = this.getColumn(this.headerRow,(this.colHeaderSize-1));
    var left;
    if (typeof(col)=='undefined') {
      col = null;
      left = 0;
    }
    else {
      left = (col.offsetLeft + col.offsetWidth + ((Prototype.Browser.Gecko) ? -2:-1) );
    }
    this.showColResizer(col, left);
  },
    
  onHeaderMouseUp: function(event) {
    if (this.colResizing) {
      var deltaX = Event.pointerX(event) - this.colResizeStartX;
      if (deltaX!=0) {
        if (this.resizeAction == this.RESIZE_COLUMN_HEADER) {
          var split = this.colResizer.offsetLeft;
          var colHeaderWidth = 0;
          for (var i = 0; i < this.colLen; i++) {
            colHeaderWidth += this.colWidths[i];
            if (split<colHeaderWidth) break;
          }
          this.colHeaderSize = i;
        } else if (this.resizeAction == this.RESIZE_COLUMN_WIDTH && this.colResizingTarget!=null) {
          var newWidth = (this.colResizingTarget.offsetWidth + deltaX + ((Prototype.Browser.Gecko) ? -1:-0));
          newWidth = (newWidth < 12) ? 12:newWidth; 
          if (this.fixedWidth) {
            this.colWidths[this.indexOfColumn(this.colResizingTarget)] = newWidth;
          } else {
            this.colResizingTarget.style.width =  newWidth + ls.LSCNS_px;
          }
        }
        this.adjust();
      }
    }
    this.colResizing = false;   
    this.colResizer.style.display = ls.LSCNS_none;
    document.body.style.cursor = 'default';
  },
  
  onHeaderMouseDown: function(event) {
    var source = Event.element(event);
    this.clearSelection();
    if (!this.isColumn(source) || document.body.style.cursor == 'default') {
      this.colResizing = false;   
      this.colResizer.style.display = ls.LSCNS_none;
      document.body.style.cursor = 'default';
      return;
    }
    this.resizeAction = this.RESIZE_COLUMN_WIDTH;
    this.colResizeStartX = Event.pointerX(event);
    this.showColResizer(source,  (source.offsetLeft + source.offsetWidth + ((Prototype.Browser.Gecko) ? -2:-1) ));
  },
  
  showColResizer:function(source, left) {
    this.colResizeStartLeft = left;
    this.colResizingTarget = source;
    this.colResizing = true;
    this.colResizer.style.left = this.colResizeStartLeft+1 + ls.LSCNS_px;
    this.colResizer.style.top = '0px';
    this.colResizer.style.height = this.area.style.height;
    this.colResizer.style.display = ls.LSCNS_NULLSTRING;
  },
  
  onHeaderMouseMove: function(event) {
    var source = Event.element(event);
    if (this.colResizing) {
      this.clearSelection();
      var deltaX = Event.pointerX(event) - this.colResizeStartX;
      this.colResizer.style.left = (this.colResizeStartLeft + deltaX) + ls.LSCNS_px;
      document.body.style.cursor = (Prototype.Browser.Opera) ? 'w-resize':'col-resize';
      Event.stop(event);
    } else {
      if (this.isColumn(source) && source.parentNode.parentNode==this.thead) {
        var thRight = Position.cumulativeOffset(source).left + source.offsetWidth;
        if (((thRight-6) <= Event.pointerX(event)) && (Event.pointerX(event) <= thRight)) {
          document.body.style.cursor = (Prototype.Browser.Opera) ? 'w-resize':'col-resize';
        } else {
          document.body.style.cursor = 'default';
        }
      }
      else {
        document.body.style.cursor = 'default';
      }
    }
  },
  
  setColResizing: function() {
    this.colResizing = true;
    
  },

  onAreaScroll: function(event) {
    if (this.area.scrollLeft != 0) {
      var left = this.area.scrollLeft;
      if (left<this.colWidths[this.colPos]) {
        left = this.colWidths[this.colPos];
      }
      this.area.scrollLeft = 0; 
      this.hsBar.scrollLeft += left;
    };
    
    if (this.area.scrollTop != 0) {
      this.area.scrollTop = 0; 
    };
  },
  
  adjust : function(prop) {
   
    if (!this.area) {
      return;
    }
    document.body.style.cursor = 'wait';
    if (prop!=undefined) {
      if (prop.colWidths!=undefined) {
        this.colWidths = prop.colWidths;
        this.colLen = this.colWidths.length;
        this.fixedWidth = true;
      }
      if (prop.colHeaderSize!=undefined) this.colHeaderSize = prop.colHeaderSize;
      if (prop.bottomFooter!=undefined) this.bottomFooter = prop.bottomFooter;
    }
    this.rowPos = 0;
    this.colPos = this.colHeaderSize;
    this.table = this.area.getElementsByTagName('table')[0];
    this.thead = this.area.getElementsByTagName('thead')[0];
    this.tbody = this.area.getElementsByTagName('tbody')[0]; 

    try { 
      this.tfoot = this.area.getElementsByTagName('tfoot')[0];
      if ($(this.area.id + 'FSP')==null) {
        new Insertion.Top(this.tfoot,'<tr id="' + this.area.id + 'FSP" style="height:0px;">' + 
                                     '<td style="height:0px;"></td></tr>');
      }
      this.tfoot.spacer = $(this.area.id + 'FSP');
    } catch (e) {}

    var hRows = Element.childElements(this.thead);
    var hRowsLen = hRows.length;
    var hCols = [];
    for (var i = 0; i < hRowsLen; i++) {
      var cols = hRows[i].childElements();
      var colsLen = cols.length;
      if (colsLen > hCols.length) {
        this.headerRow = hRows[i];
        hCols = cols;
      }
    }

    var hColsLen = hCols.length;
    
    Element.Methods.hide(this.table);
    this.vsBar.scrollTop  = 0;
    this.hsBar.scrollLeft = 0;

    var tableWidth = 0;
    if (this.fixedWidth) {
      this.initTable();
      for (var i = 0; i < this.colLen; i++) {
        tableWidth += this.colWidths[i];
      }
      this.table.style.width = tableWidth + ls.LSCNS_px;
      this.table.style.tableLayout = 'fixed';
      Element.Methods.show(this.table);
    } else {
      this.initTable();
      this.table.style.tableLayout = 'fixed';
      this.table.style.width = '0px';
      Element.Methods.show(this.table);
      for (var i = 0; i < hColsLen; i++) {
        this.colWidths[i] = hCols[i].offsetWidth;
      }
    }
    this.colHeaderWidth = 0;
    this.colScrollWidth = 0;
    var spacer = '';
    this.colMaxWidth = 0;

    for (var i = 0; i < hColsLen; i++) {
      
      spacer += ('<' + hCols[i].tagName + ' style="background-color:threedface;height:0px;margin:0;padding:0;"/>'); 
      
      if (i < this.colHeaderSize) {
        this.colHeaderWidth += this.colWidths[i]; 
      } else {
        this.colScrollWidth += this.colWidths[i];
      }
      if (i != hCols.length-1 && this.colWidths[i] > this.colMaxWidth) {
        this.colMaxWidth = this.colWidths[i];
      }
    }
    if (this.tfoot) {
      Element.Methods.update(this.tfoot.spacer, spacer);
      this.tfoot.spacer.style.height = '0px';
    }
    this.setScrollBarPosition();
    this.rowHeights = new Array();
    this.rowIndexMap = new Array();
    var x = 0;
    var row;
    var maxRowHeight = 0;
    row = this.tbody.firstChild;
    var seq = this.trSeq;
    for (; row; row = row.nextSibling) {
      if (!this.isRow(row)) continue;
      var rowid = row.getAttribute('_rowid');
      if (rowid==null) {
        rowid = '_rowid_' + (seq++);
        row.setAttribute('_rowid', rowid);
      }
      if (this.rowElements[rowid]==null) this.rowElements[rowid] = row;
      this.rowHeights[x++] = row.offsetHeight;
      this.rowIndexMap[x-1] = rowid;
      if (this.rowHeights[x-1]>maxRowHeight) maxRowHeight += this.rowHeights[x-1];
    }
    this.trSeq = seq;
    
    var tbodyHeight = 0;
    if (this.tbody) {
      tbodyHeight = this.tbody.offsetHeight;
    }
    if (this.setVisibleRows()==false) tbodyHeight += maxRowHeight;
    this.vsHeight.style.height = tbodyHeight + ls.LSCNS_px;
    
    var thead = this.area.getElementsByTagName('thead')[0];
    if (this.hHeaderMouseDown) {
      Event.stopObserving(thead, 'mousedown', this.hHeaderMouseDown);
      this.hHeaderMouseDown = this.onHeaderMouseDown.bindAsEventListener(this);
      Event.observe(thead, 'mousedown', this.hHeaderMouseDown);
    }
    document.body.style.cursor = 'default';
  },
  
  setScrollBarPosition : function() {
    var adw = 0;
    var adh = 0;
    if (!ls.isMSIE6()) {
      adw = (Prototype.Browser.WebKit) ? 0:16;
      adh = (Prototype.Browser.WebKit) ? 0:18;
    }
    var barSize = this._getScrollBarSize();
    
    var fixcol = this.getColumn(this.headerRow,(this.colHeaderSize));
    if (this.colHeaderSize>0) {
      this.verticalSplitLine.style.left = fixcol.offsetLeft + ls.LSCNS_px;
      this.verticalSplitLine.style.top = '0px';
      this.verticalSplitLine.style.height = this.area.style.height;
      this.verticalSplitLine.style.display = ls.LSCNS_NULLSTRING;
    } else {
      this.verticalSplitLine.style.display = ls.LSCNS_none;
    }
    this.hsBase.style.left = '0px';
    this.hsBase.style.top = (this.area.clientHeight-barSize) + ls.LSCNS_px;
    this.hsBase.style.width = this.area.clientWidth + ls.LSCNS_px;
    this.hsResizer.style.top = '1px';

    if (fixcol.offsetLeft > 0) {
      this.hsResizer.style.left = this.toPX((fixcol.offsetLeft)-4);
      this.hsBar.style.left = this.toPX(fixcol.offsetLeft);
      this.hsBar.style.width = this.toPX(this.area.clientWidth - fixcol.offsetLeft - adw);
    }
    else {
      this.hsResizer.style.left = this.toPX((fixcol.offsetLeft));
      this.hsBar.style.left = this.toPX(fixcol.offsetLeft+4);
      this.hsBar.style.width = this.toPX(this.area.clientWidth-fixcol.offsetLeft-adw-4);
    }
    //this.hsBar.style.top = '-2px';
    if ((this.area.clientWidth-fixcol.offsetLeft-adw) > (this.table.clientWidth-fixcol.offsetLeft)) {
      this.hsWidth.style.width = this.toPX(this.table.clientWidth-fixcol.offsetLeft);
    }
    else {
      this.hsWidth.style.width = this.toPX((this.table.clientWidth-fixcol.offsetLeft) + this.colMaxWidth);
    }
    this.vsBase.style.left = this.toPX(this.area.clientWidth-barSize);
    this.vsBase.style.top = '0px';
    this.vsBase.style.height = this.toPX(this.area.offsetHeight - adh);
    this.vsBar.style.top = this.toPX(this.thead.offsetHeight);
    //this.vsBar.style.left = '-2px';
    var fHeight = (this.tfoot) ?  this.tfoot.offsetHeight : 0;
    this.vsBar.style.height = this.toPX(this.area.clientHeight-(adh+this.thead.offsetHeight+fHeight));
  },

  toPX : function(value) {
    return ((value < 0) ? 0 : value) + ls.LSCNS_px;;
  },

  setScrollTop : function(topPos) {
    this.vsBar.scrollTop  = topPos;
  },
  
  getScrollTop : function() {
    return this.vsBar.scrollTop;
  },
  
  setScrollLeft : function(leftPos) {
    this.hsBar.scrollLeft = leftPos;
  },
  
  getScrollLeft : function() {
    return this.hsBar.scrollLeft;
  },
  scrollLast : function() {
    var barHeight = this.vsBar.scrollHeight;
    this.vsBar.scrollTop  = barHeight;
  },
  
  update : function(elementId, contents) {
    Element.Methods.update($(elementId), contents);
    this.adjust();
  },
  
  onVScroll: function(e) {
    try {  window.clearTimeout(this.doVScrollTimer);  } catch(e) {} 
    this.doVScrollTimer = window.setTimeout(this.doVScroll.bind(this) ,125);
  },
  
  doVScroll : function() {
    if (this.table.style.display==ls.LSCNS_none) return;
    document.body.style.cursor = 'wait';
    var sTop = this.vsBar.scrollTop;
    var hide = 0;
    var rowLen = this.rowHeights.length;
    for (var i = 0; i < rowLen; i++) {
    
      row = this.rowElements[this.rowIndexMap[i]];
      if (row.getAttribute('_visible')!='false') {
        hide += this.rowHeights[i];
      }
      if (sTop<hide) break;
    }
    if (this.rowPos!=i) {
      this.rowPos = i;
      this.setVisibleRows();
    }
    document.body.style.cursor = 'default';
  },
  
  setVisibleRows : function() {
    var visibleHeight = this.vsBar.offsetHeight;
    if (ls.isMSIE6()) visibleHeight -= 16;
    var vis = 0;
    var row;
    var inbound = true;
    var rowLen = this.rowIndexMap.length;
    for (var i = 0; i<rowLen; i++) {
      row = this.rowElements[this.rowIndexMap[i]];
      if (i < this.rowPos) {
        if (row.style.display!=ls.LSCNS_none) row.style.display = ls.LSCNS_none;
        continue;
      }
      if (inbound && (visibleHeight>=(vis + this.rowHeights[i]))) {
        if (row.style.display== ls.LSCNS_none) {
          this.refreshVisibleColumns(row);
          row.style.display = ls.LSCNS_NULLSTRING;
        }
        vis += this.rowHeights[i];
      } else {
        inbound = false;
        if (row.style.display!=ls.LSCNS_none) row.style.display = ls.LSCNS_none;
      }
    }
//alert(visibleHeight + ':' + vis);
    if (this.tfoot && this.bottomFooter) this.tfoot.spacer.style.height = (visibleHeight-vis) + ls.LSCNS_px;
    return inbound; //true:All rows ware shown. 
  },

  onHScroll: function(e) {
    try {  window.clearTimeout(this.doHScrollTimer);  } catch(e) {} 
    this.doHScrollTimer = window.setTimeout(this.doHScroll.bind(this) ,125);
  },

  doHScroll: function() {
    if (this.table.style.display==ls.LSCNS_none) return;
    document.body.style.cursor = 'wait';
    var sLeft = this.hsBar.scrollLeft;
    var hide = 0;
    var i = this.colHeaderSize;
    for (; i < this.colLen; i++) {
      hide += this.colWidths[i];
      if (sLeft<hide) break;
    }
    if (this.colPos!=i) {
      var oldPos = this.colPos; 
      this.colPos = i;
      var tableWidth = 0;
      for (var i = 0; i < this.colLen; i++) {
        if (i<this.colHeaderSize && i>= this.colPos) tableWidth += this.colWidths[i];
      }
      this.table.style.width = tableWidth + ls.LSCNS_px;
      var row;
      row = this.thead.firstChild;
      for (; row; row = row.nextSibling) {
        if (!this.isRow(row)) continue;
        this.setVisibleColumns(row, oldPos);
      }
      if (this.tfoot) {
        row = this.tfoot.firstChild;
        for (; row; row = row.nextSibling) {
          if (!this.isRow(row)) continue;
          this.setVisibleColumns(row, oldPos);
        }
      }
      var rowLen = this.rowIndexMap.length;
      for (var i = 0; i<rowLen; i++) {
        row = this.rowElements[this.rowIndexMap[i]];
        if (row.style.display == ls.LSCNS_NULLSTRING) this.setVisibleColumns(row, oldPos);
      }
    }
    document.body.style.cursor = 'default';
  },

  initTable : function() {
    var row;
    this.initCols(this.headerRow);
    if (this.tfoot) {
      row = this.tfoot.firstChild;
      for (; row; row = row.nextSibling) {
        if (!this.isRow(row)) continue;
        this.initCols(row);
      }
    }
    if (this.tbody) {
      row = this.tbody.firstChild;
      for (; row; row = row.nextSibling) {
        if (!this.isRow(row)) continue;
        this.initCols(row);
      }
    }
  },
        
  initCols : function(row) {
    if(!row) return;
    if (row.style.display==ls.LSCNS_none) row.style.display = ls.LSCNS_NULLSTRING;
    var col;
    var x = 0;
    var col = row.firstChild;
    for (; col; col = col.nextSibling) {
      if (!this.isColumn(col)) continue;
      if (col.style.display==ls.LSCNS_none) col.style.display = ls.LSCNS_NULLSTRING;
      if (this.fixedWidth) {
        col.style.overflow = ls.LSCNS_hidden;
        col.style.width = this.colWidths[x] + ls.LSCNS_px;
      }
      x++;
    }
  },
  
  isColumn : function(col) {
    var tag = col.tagName;
    return (tag==ls.LSCNS_td || tag==ls.LSCNS_th || tag==ls.LSCNS_TD || tag==ls.LSCNS_TH);
  },

  getColumn : function(row, index) {
    var c = row.firstChild;
    x = -1;
    for (; c; c = c.nextSibling) {
      if (!this.isColumn(c)) continue;
      x++;
      if (x==index) return c;
    }
  },

  indexOfColumn : function(col) {
    var c = col.parentNode.firstChild;
    x = -1;
    for (; c; c = c.nextSibling) {
      if (!this.isColumn(c)) continue;
      x++;
      if (c==col) return x;
    }
  },

  isRow : function(row) {
    var tag = row.tagName;
    return (tag==ls.LSCNS_tr || tag==ls.LSCNS_TR);
  },
  
  setVisibleColumns : function(row, oldPos) {
    var col = row.firstChild;
    if (this.colPos>oldPos) {
      var x = 0;
      for (; col; col = col.nextSibling) {
        if (!this.isColumn(col)) continue;
        if (this.colHeaderSize<=x && oldPos<=x && x<this.colPos) {
          col.style.display = ls.LSCNS_none;
        } else if (x>=this.colPos) break; 
        x++;
      }
    } else {
      var x = 0;
      for (; col; col = col.nextSibling) {
        if (!this.isColumn(col)) continue;
        if (this.colPos<=x && x<oldPos) {
          col.style.display = ls.LSCNS_NULLSTRING;
        } else if (x>=oldPos) break;
        x++;
      }
    }
  },
  
  refreshVisibleColumns : function(row) {
    var col;
    var x = 0;
    var col = row.firstChild;
    for (; col; col = col.nextSibling) {
      if (!this.isColumn(col)) continue;
      if (x>=this.colHeaderSize && x<this.colPos) {
        if (col.style.display!=ls.LSCNS_none) col.style.display = ls.LSCNS_none;
      } else 
      if (col.style.display==ls.LSCNS_none) {
         col.style.display = ls.LSCNS_NULLSTRING;
      }
      x++;
    }
  },
  
  onMouseWheel : function(event) {
    var delta = 0;
    var el = Event.element(event);
    while(el.parentNode) {
      if (el.parentNode==this.tbody) {
        if (event.wheelDelta) {
          delta = event.wheelDelta/120;
          if (window.opera) delta = -delta;
        } else if (event.detail) {
          delta = -event.detail/3;
        }
        delta = -delta * this.rowHeights[this.rowPos];
        this.vsBar.scrollTop = this.vsBar.scrollTop + delta;
        var scrollSize = this.vsBar.scrollHeight - this.vsBar.clientHeight;
        if (0 < this.vsBar.scrollTop && this.vsBar.scrollTop < scrollSize) {
          Event.stop(event);
        }
        return;
      }
      el = el.parentNode;
    }
  },
  
  _getScrollBarSize: function() {
    return (Prototype.Browser.Opera) ? 18 : 17;  
  }

});

//lower compatibility
ls.ScrollableGrid = Class.create(ls.DataGrid.prototype);
