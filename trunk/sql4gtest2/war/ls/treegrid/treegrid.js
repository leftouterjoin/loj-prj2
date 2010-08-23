/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

if (typeof(ls.DataGrid)=='undefined') 
  throw("treegrid.js requires including datagrid.js library");

/*
 * ツリーグリッド treegrid.js
 * 
 * @author LittleSoft Corporation
 * @version 1.2.3
 */
ls.TreeGrid = Class.create(ls.DataGrid, {
  initialize: function(area, prop) {
    this.initialSetting(area, prop);
    this.expanded = '+';
    this.collapsed = '-';
    this.treeToggleColumn = 0;
    if (prop.expanded!=undefined) this.expanded = prop.expanded;
    if (prop.collapsed!=undefined) this.collapsed = prop.collapsed;
    if (prop.treeToggleColumn!=undefined) this.treeToggleColumn = prop.treeToggleColumn;
    this.toggleName = 'lsTreeGridToggle';
    this.childRows = {};
    this.initTreeModel(this.area.getElementsByTagName('tbody')[0].firstChild);
    if (prop.onToggleClick) this.onToggleClick = prop.onToggleClick;
    this.adjust();
    this.eventSetting();
    if (!this.clickHdl) {
      this.clickHdl = this.onClick.bindAsEventListener(this);
      Event.observe(this.area, 'click', this.clickHdl);
    }
    this.area._lsUIWidget = this;
  },
  
  treeAdjust : function(prop) {
    this.rowElements = {};
    this.childRows = {};
    if (prop!=undefined) {
      if (prop.colWidths!=undefined) {
        this.colWidths = prop.colWidths;
        this.colLen = this.colWidths.length;
        this.fixedWidth = true;
      }
      if (prop.colHeaderSize!=undefined) this.colHeaderSize = prop.colHeaderSize;
      if (prop.bottomFooter!=undefined) this.bottomFooter = prop.bottomFooter;
      if (prop.onToggleClick) this.onToggleClick = prop.onToggleClick;
      if (prop.expanded!=undefined) this.expanded = prop.expanded;
      if (prop.collapsed!=undefined) this.collapsed = prop.collapsed;
      if (prop.treeToggleColumn!=undefined) this.treeToggleColumn = prop.treeToggleColumn;
    }
    this.initTreeModel(this.area.getElementsByTagName('tbody')[0].firstChild);
    this.adjust();
  },
  
  setVisibleRows : function() {
    var visibleHeight = this.vsBar.offsetHeight;
    if (!ls.isMSIE6()) {
      visibleHeight += 16;
    }
    var vis = 0;
    var row;
    var inbound = true;
    var rowLen = this.rowIndexMap.length;
    var allRowHeight = 0;
    for (var i = 0; i<rowLen; i++) {
      row = this.rowElements[this.rowIndexMap[i]];
      if (row.getAttribute('_visible')=='true') {
        allRowHeight += this.rowHeights[i];
      }
      if (i < this.rowPos) {
        if (row.style.display!=ls.LSCNS_none) row.style.display = ls.LSCNS_none;
        continue;
      }
      //####### for Tree Control #############
      if (row.getAttribute('_visible')=='false') {
        if (row.style.display!=ls.LSCNS_none) row.style.display = ls.LSCNS_none;
        continue;
      }
      //######################################
      if (inbound && (visibleHeight>=(vis + this.rowHeights[i]))) {
        if (row.style.display==ls.LSCNS_none) {
          this.refreshVisibleColumns(row);
          row.style.display = ls.LSCNS_NULLSTRING;
        }
        vis += this.rowHeights[i];
      } else {
        inbound = false;
        if (row.style.display!=ls.LSCNS_none) row.style.display = ls.LSCNS_none;
      }
    }
    //alert(allRowHeight);
    this.vsHeight.style.height = allRowHeight + 16  + 'px';
    if (this.tfoot && this.bottomFooter) this.tfoot.spacer.style.height = (visibleHeight-vis) + 'px';
    return inbound; //true:All rows ware shown. 
  },
  
  isToggle: function(e) {
    return (e.className==this.toggleName);
  },
  
  onClick: function(event) {
    var toggle = Event.element(event);
    if (this.isToggle(toggle)){
      if (this.onToggleClick) {
        this.onToggleClick(toggle);
      }
      else {
        var row = this.getElementByRowId(toggle.getAttribute('_rowid'));
        if (toggle.innerHTML==this.expanded) {
          Element.Methods.update(toggle,this.collapsed);
        } else {
          Element.Methods.update(toggle,this.expanded);
        }
        row.setAttribute('_toggle', toggle.innerHTML);
        this.doToggle(row);
        this.setVisibleRows();
      }
    }
  },
  
  hasChild : function(rowid) {
    return (this.childRows[rowid]!=null)
  },
  
  insertRow : function(el, contents) {
    document.body.style.cursor = 'wait';
    var parentRow = this.getElementByRowId(el.getAttribute('_rowid'));
    if (el.innerHTML==this.expanded) {
      Element.Methods.update(el,this.collapsed);
    } else {
      Element.Methods.update(el,this.expanded);
    }
    parentRow.setAttribute('_toggle', el.innerHTML);
    
    var parentRowId = parentRow.getAttribute('_rowid');
    
    if (this.childRows[parentRowId]==null) {
      this.childRows[parentRowId] = new Array();
      var insPos = 0;
      
      var rowLen = this.rowIndexMap.length;
      for (var i = 0; i<rowLen; i++) {
        if ((parentRowId == this.rowIndexMap[i])) {
          break;
        }
        insPos++;
      }
      var breakRowId = this.rowIndexMap[i+1];
      
      var newRowHeights = new Array();
      var newRowIndexMap = new Array();
      newRowHeights = newRowHeights.concat(this.rowHeights.slice(0, insPos+1));
      newRowIndexMap = newRowIndexMap.concat(this.rowIndexMap.slice(0, insPos+1));
      Insertion.After(parentRow, contents);
      
      var cols = parentRow.getElementsByTagName('td');
      
      var seq = this.trSeq;
      var rowId;
      var colsLen = cols.length;
      var addHeight = 0;
      var newLevel = parseInt(parentRow.getAttribute('_level')) + 1;
      row = this.rowElements[this.rowIndexMap[insPos]];
      for (; row; row = row.nextSibling) {
        if (!this.isRow(row)) continue;
        
        rowId = row.getAttribute('_rowid');
        
        if (rowId==null) {
          rowId = '_rowid_' + (seq++);
          row.setAttribute('_rowid', rowId);
        }
        
        if (rowId == breakRowId) break;
        var level = row.getAttribute('_level');
        if (level != null) continue;
        row.setAttribute('_pid', parentRowId);
        
        this.rowElements[rowId] = row;
        this.childRows[parentRowId].push(rowId);
        
        newRowHeights.push(row.offsetHeight);
        newRowIndexMap.push(rowId);
        
        addHeight += row.offsetHeight;
        
        var newCols = row.getElementsByTagName('td');
        var newColsLen = newCols.length;
        if (newColsLen != colsLen) alert('Invalid Column Count');
        for (var k = 0; k<newColsLen; k++) {
          if (cols[k].style.display == 'none') newCols[k].style.display = 'none';
        }
      }
      this.trSeq = seq;
      this.createToggle(parentRow, parseInt(parentRow.getAttribute('_level')));
      this.rowHeights = newRowHeights.concat(this.rowHeights.slice(insPos+1));
      this.rowIndexMap = newRowIndexMap.concat(this.rowIndexMap.slice(insPos+1));
      //this.vsHeight.style.height = (parseInt(this.vsHeight.style.height.replace('px',''))+addHeight) + 'px';
    }
    
    this.doToggle(parentRow);
    this.setVisibleRows();
    document.body.style.cursor = 'default';
  },
  
  doToggle : function(row) {
    var rowId = row.getAttribute('_rowid');
    var children = this.childRows[rowId];
    if (children!=null && children!=undefined) {
      var toggle = row.getAttribute('_toggle');
      var visible = row.getAttribute('_visible');
      for (var i = 0; i<children.length; i++) {
        var v = 'false';
        if ((toggle==this.collapsed) && (visible=='true')) v = 'true';
        this.rowElements[children[i]].setAttribute('_visible', v);
        this.doToggle(this.rowElements[children[i]]);
      }
    }   
  },
   
  initTreeModel : function(firstRow) {
    var root = null;
    var row = firstRow;
    var rowId;
    for (; row; row = row.nextSibling) {
      if (!this.isRow(row)) continue;
      var parentRow = this.getElementByRowId(row.getAttribute('_pid'));
      if (parentRow!=null) {
        this.addChildRow(parentRow, row);
        rowId = row.getAttribute('_rowid');
        this.rowElements[rowId] = row;
      } else if (root==null){
        root = row;
      }
    }
    if (root) {
      root.setAttribute('_visible', 'true');
      this.createToggle(root, 0);
    }
  },
  
  createToggle : function(row, level) {
    x = -1;
    var col = row.firstChild;
    for (; col; col = col.nextSibling) {
      if (!this.isColumn(col)) continue;
      x++;
      if (x==this.treeToggleColumn) {
        var rowId = row.getAttribute('_rowid');
        var toggle = row.getAttribute('_toggle');
        if (toggle==null) {
          //toggle = this.collapsed;
          //row.setAttribute('_toggle', toggle);
          col.innerHTML = '<span style="margin-left:' + (level+1) + 'em;">'+col.innerHTML+'</span>';
          break;
        }
        var settingLevel = row.getAttribute('_level');
        if (settingLevel==null) {
          row.setAttribute('_level', level);
        }
        var index = col.innerHTML.indexOf('lsTreeGridToggle');
        if ( parseInt(index) >= parseInt("0") ) {
        }
        else{
          col.innerHTML = 
            '<span class="lsTreeGridToggle" style="margin-left:' + level 
            + 'em;" _rowid="' + rowId + '">' + toggle + '</span>' +  col.innerHTML;
        }
        var children = this.childRows[rowId];
        if (children!=null) {
          var visible = row.getAttribute('_visible');
          for (var i = 0; i<children.length; i++) {
            var v = 'false';
            if ((toggle==this.collapsed) && (visible=='true')) v = 'true';
            this.rowElements[children[i]].setAttribute('_visible', v);
            this.createToggle(this.rowElements[children[i]], (level+1));
          }
        }
        break;
      }
    }
  }, 
  
  addChildRow : function(parentRow, row) {
    var parentRowId = parentRow.getAttribute('_rowid');
    var rowId = row.getAttribute('_rowid');
    if (this.childRows[parentRowId]==null) {
      this.childRows[parentRowId] = new Array(); 
    }
    this.childRows[parentRowId].push(rowId);
  },
  
  getElementByRowId : function(rowId) {
    var children = this.area.getElementsByTagName('tr');
    var childrenLen = children.length;
    for (var i = 0; i<childrenLen; i++) {
      var attributeValue = children[i].getAttribute('_rowid');
      if(attributeValue != null) {
        if(attributeValue == rowId) {
          return children[i];
        }
      }
    }
    return null;
  }
  
});
