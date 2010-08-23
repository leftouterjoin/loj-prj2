/*
 *  Copyright (c) 2006-2009 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

if (typeof(ls.TreeGrid)=='undefined') 
  throw("ganttview.js requires including treegrid.js library");

/*
 * ガントビュー ganttview.js
 * 
 * @author LittleSoft Corporation
 * @version 1.2.3
 */

ls.GantChart = Class.create(ls.TreeGrid, {

  CHANGE_TASK_STARTTIME : 0,
  CHANGE_TASK_DURATION  : 1,
  CHANGE_TASK_PROGRESS  : 2,

  initialize: function($super, area, prop) {
 log('****** start initialize ');    
  
    this.msSecond = 1000;
    this.msMinute = this.msSecond*60;
    this.msHour = this.msMinute*60;
    this.msDay = this.msHour*24;
    this.msWeek = this.msDay*7;
  
    this.pxcelPerDay = 6;
  
    this.area = $(area);
    this.area._lsUIWidget = this;
    //this.area.style.display = 'none';
    
    this.startTimeColumn = 2;
    this.durationColumn = 3;
    

    //this.startTime = new Date().getTime();
    this.startTime = new Date(Date.UTC( 2009, 0, 4 )).getTime();
    if (prop.startTime!=undefined) {
      this.startTime = prop.startTime;
    //} else if (this.area.getAttribute('_starttime')!=''){
      //this.startTime =  parseInt(this.area.getAttribute('_starttime'));
    }
    
    if (prop.startTimeColumn!=undefined) {
      this.startTimeColumn = prop.startTimeColumn;
    }    
    if (prop.durationColumn!=undefined) {
      this.durationColumn = prop.durationColumn;
    }    


    if (Prototype.Browser.IE) {
      this.opacity = 'filter: alpha(opacity=40);';
    } else {
      this.opacity = 'opacity:0.4;';
    }

    this.adjustPix = {top:0,width:0};
    if (Prototype.Browser.IE) {
      this.adjustPix.top = -1;
      this.adjustPix.width = 0;
    } else if (Prototype.Browser.WebKit) {
      this.adjustPix.top = -1;
      this.adjustPix.width = -2;
    } else {
      this.adjustPix.top = -1;
      this.adjustPix.width = -2;
    }
    
    
 log('this.startTime: ' + new Date(this.startTime).toGMTString());   
    
    var newColWidth = new Array();
    if (prop.colWidths!=undefined) {
      for (var i = 0; i < prop.colWidths.length; i++) {
        newColWidth[i] = prop.colWidths[i];
      }
    }
    var gantChartScaleWidth = new Array();
    var gantChartScaleHead = '';
    var gantChartScaleBody = '';
    var t1 = '<th style="font-size:80%;text-align:left;"><span style="padding-left:2px;color:white;">';
    var t2 = '</span></th>';
    var t3 = '<td class="lsGanttChartWeek" _periodId="';
    var t4 = '"/>';
    
    this.gantChartScaleTimes = new Array();
    var scaleWidth = (Prototype.Browser.WebKit) ? 42:41;
    for (var i = 0; i < 32; i++) {
      this.gantChartScaleTimes[i] = this.startTime + (this.msWeek * i);
      var headDate = new Date(this.gantChartScaleTimes[i]);
      gantChartScaleHead += t1 + (headDate.getMonth()+1) + '/' +  headDate.getDate() + t2;
      gantChartScaleBody += t3 + i + t4;
      gantChartScaleWidth[i] = scaleWidth;
    }
    this.gantChartScaleTimes[i] = new Date(Date.UTC( 9999, 0, 1 )).getTime();
    prop.colWidths = newColWidth.concat(gantChartScaleWidth);
    this.insertGantChartScale(this.area.getElementsByTagName('thead')[0], gantChartScaleHead);
    this.insertGantChartScale(this.area.getElementsByTagName('tbody')[0], gantChartScaleBody);
    this.insertGantChartScale(this.area.getElementsByTagName('tfoot')[0], gantChartScaleBody);
    $super(area, prop);
    this.drawGantChart(this.tbody);
    var id = this.area.id + 'Dragging';
    new Insertion.Bottom(this.area,'<div id="' + id + '" class="lsGanttChartTaskDragging" style="' + this.opacity + '"/>');
    this.dragging = $(id);
    this.dragStartPoint = null;
    this.dragStartBounds = null;
    if (!this.hGantMouseDown) {
      this.hGantMouseDown = this.onGantMouseDown.bindAsEventListener(this);
      Event.observe(this.area, 'mousedown', this.hGantMouseDown);
    }
    if (!this.hGantMouseUp) {
      this.hGantMouseUp = this.onGantMouseUp.bindAsEventListener(this);
      Event.observe(this.area, 'mouseup', this.hGantMouseUp);
    }
    if (!this.hGantMouseOver) {
      this.hGantMouseOver = this.onGantMouseOver.bindAsEventListener(this);
      Event.observe(this.area, 'mousedown', this.hGantMouseOver);
    }
    if (!this.hGantMouseMove) {
      this.hGantMouseMove = this.onGantMouseMove.bindAsEventListener(this);
      Event.observe(this.area, 'mousemove', this.hGantMouseMove);
    }
    if (!this.hGantMouseOut) {
      this.hGantMouseOut = this.onGantMouseOut.bindAsEventListener(this);
      Event.observe(this.area, 'mouseout', this.hGantMouseOut);
    }
log('****** end initialize ');    
  },
  
  adjustParentTask: function(row) {
    var parentRow = this.getElementByRowId(row.getAttribute('_pid'));;
    if (parentRow==null) return;
    
    var children = this.childRows[parentRow.getAttribute('_rowid')];
    var minTime = this.gantChartScaleTimes[this.gantChartScaleTimes.length-1];
    var maxTime = 0;
    if (children!=null && children!=undefined) {
      for (var i = 0; i<children.length; i++) {
        var child = this.rowElements[children[i]];
        var childStart = parseInt(child.getAttribute('_starttime'));
        var childEnd = childStart + parseInt(child.getAttribute('_duration'));
        if (childStart < minTime) minTime = childStart;
        if (childEnd   > maxTime) maxTime = childEnd;
      }
    }   
    var parentStart = parseInt(parentRow.getAttribute('_starttime'));
    var parentEnd   = parentStart + parseInt(parentRow.getAttribute('_duration'));
    var updated = false;
    if (minTime != parentStart) {
      parentStart = minTime;
      parentEnd   = parentStart + parseInt(parentRow.getAttribute('_duration'));
      parentRow.setAttribute('_starttime', parentStart);
      updated = true;
    }
    if (maxTime != parentEnd) {
      parentRow.setAttribute('_duration', maxTime - parentStart);
      updated = true;
    }
    if (updated) {
      this.clearTaskLine(parentRow);
      this.drawTaskLine(parentRow);
    }
    this.adjustParentTask(parentRow);
  },

  adjustChildTask: function(row, delta) {
    var children = this.childRows[row.getAttribute('_rowid')];
    if (children!=null && children!=undefined) {
      for (var i = 0; i<children.length; i++) {
        var child = this.rowElements[children[i]];
        var childStart = parseInt(child.getAttribute('_starttime'));
        child.setAttribute('_starttime', childStart + delta);
        this.clearTaskLine(child);
        this.drawTaskLine(child);
        this.adjustChildTask(child, delta);
      }
    }   

  },
  
  onGantMouseDown: function(e) {
    this.resetDrag();
    var source = Event.element(e);
    if (this.isProgress(source) || this.isProgressStart(source)) {
      this.dropAction = this.CHANGE_TASK_PROGRESS;
    } else if (this.isTask(source)) {
      this.dropAction = this.CHANGE_TASK_STARTTIME;
    } else if (this.isTaskEnd(source)) {
      this.dropAction = this.CHANGE_TASK_DURATION;
    } else {
      this.dropAction = null;
      return;
    }
    this.dragElement = this.getDragElement(source);    
    this.dragStartBounds = this.getSelectionBounds(source);
    this.dragStartPoint = {x:Event.pointerX(e), y:Event.pointerY(e)};
    this.dragging.style.top    = (this.dragStartBounds.top + this.adjustPix.top) + LSCNS_px;
    this.dragging.style.left   = this.dragStartBounds.left + LSCNS_px;
    this.dragging.style.width  = (this.dragStartBounds.width + this.adjustPix.width) + LSCNS_px;
    this.dragging.style.height = this.dragStartBounds.height + LSCNS_px;
    Event.stop(e);
  },
  
  onGantMouseUp: function(e) {
    if (!this.dragStartPoint || !this.dragElement) {
      this.resetDrag();
      return;
    }
    var deltaX = Event.pointerX(e) - this.dragStartPoint.x;
    var deltaY = Event.pointerY(e) - this.dragStartPoint.y;
    var row = this.getTaskRow(this.dragElement);
    if (this.dropAction == this.CHANGE_TASK_PROGRESS) {
      this.setProgress(row, this.pixelToTime(deltaX));
    } else if (this.dropAction == this.CHANGE_TASK_STARTTIME) {
      row.setAttribute('_starttime', this.pixelToTime(deltaX) + parseInt(row.getAttribute('_starttime')));
      this.adjustParentTask(row);
      this.adjustChildTask(row, this.pixelToTime(deltaX));
    } else if (this.dropAction == this.CHANGE_TASK_DURATION) {
      row.setAttribute('_duration', this.pixelToTime(deltaX) + parseInt(row.getAttribute('_duration')));
      this.adjustParentTask(row);
    }    
    this.resetDrag();
    this.clearTaskLine(row);
    this.drawTaskLine(row);
  },
  
  setProgress: function(row, delta) {
    var starttime = parseInt(row.getAttribute('_starttime'));
    var duration = parseInt(row.getAttribute('_duration'));
    var progress = parseFloat(row.getAttribute('_progress'));
    var progressTime = Math.round(duration * progress) + delta;
    progress = (progressTime / duration);
    progress = (progress > 1.0) ? 1.0:progress;
    progress = (progress < 0.0) ? 0.0:progress;
    row.setAttribute('_progress', progress);
  },
  
  resetDrag: function() {
    document.body.style.cursor = 'default';
    this.dragging.style.display = 'none';
    this.dragStartPoint = null;
    this.dragStartBounds = null;
    this.dragElement = null;
  },
  
  pixelToTime: function(px) {
    return Math.round(px / this.pxcelPerDay) * this.msDay;
  },

 
  onGantMouseOver: function(e) {
    if (!this.dragStartPoint || !this.dragElement) return;
    this.clearSelection();     
  },

  onGantMouseMove: function(e) {
    if (!this.dragStartPoint || !this.dragElement) return;
    //this.clearSelection();     
    var deltaX = Event.pointerX(e) - this.dragStartPoint.x;
    var deltaY = Event.pointerY(e) - this.dragStartPoint.y;
    if (deltaX==0 && deltaY==0) {
      return;
    }
    this.dragging.style.display = '';
    if (this.dropAction == this.CHANGE_TASK_PROGRESS) {
      document.body.style.cursor = 'crosshair';
      this.dragging.style.width = (this.dragStartBounds.width+this.adjustPix.width) + deltaX + 'px';
    } else if (this.dropAction == this.CHANGE_TASK_STARTTIME) {
      document.body.style.cursor = 'pointer';
      this.dragging.style.left = this.dragStartBounds.left + deltaX + 'px';
    } else if (this.dropAction == this.CHANGE_TASK_DURATION) {
      document.body.style.cursor = 'crosshair';
      this.dragging.style.width = (this.dragStartBounds.width+this.adjustPix.width) + deltaX + 'px';
    }
    Event.stop(e);
  },

  onGantMouseOut: function(e) {
    if (!this.dragStartPoint || !this.dragElement) return;
    this.clearSelection();     
  },
  
  getDragElement: function(e) {
    do {
      if (this.isTask(e) || this.isProgress(e)) return e;
      e = e.parentNode; 
    } while (e); 
    return null;
  },

  getTaskColumn: function(e) {
    do {
      if (this.isColumn(e)) return e;
      e = e.parentNode; 
    } while (e); 
    return null;
  },
  
  getTaskRow: function(e) {
    do {
      if (this.isRow(e)) return e;
      e = e.parentNode; 
    } while (e); 
    return null;
  },
    
  getSelectionBounds: function(source) {
    var row = this.getTaskRow(source)
    var col = row.firstChild;
    var result = {left:0,top:0,width:0,height:0};
    var starttime = parseInt(row.getAttribute('_starttime'));
    var duration = parseInt(row.getAttribute('_duration'));
    var progress = parseFloat(row.getAttribute('_progress'));
    var endtime = starttime + duration;
    var periods = new Array();
    var i = 0;
    for (; col; col = col.nextSibling) {
      if (!this.isColumn(col) || !Element.Methods.hasClassName(col,'lsGanttChartWeek')) continue;
      periods[i++] = col;
    }
    var left = 0;
    var width = 0;
    for (i = 0; i<(this.gantChartScaleTimes.length-1); i++) {
      if (periods[i].style.display=='none' || starttime >= this.gantChartScaleTimes[i+1]) continue;
      if (starttime < this.gantChartScaleTimes[i] ) {
        left = periods[i].offsetLeft;
        width = (Math.floor((duration-(this.gantChartScaleTimes[i]-starttime)) / this.msDay) * this.pxcelPerDay);
      } else {
        left = periods[i].offsetLeft + 
               (Math.floor((starttime - this.gantChartScaleTimes[i]) / this.msDay) * this.pxcelPerDay) ;
        width = (Math.floor(duration / this.msDay) * this.pxcelPerDay);
      }
      var de = this.getDragElement(source);
      result.left = left;
      result.top  = de.offsetTop;
      result.height = de.offsetHeight;
      if (this.dropAction == this.CHANGE_TASK_PROGRESS) {
        result.width = Math.floor(width * progress);
      } else {
        result.width = width;
      }
      break;
    }
    return result;
  },
  
  isTask: function(el) {
    return (el && el.tagName && Element.Methods.hasClassName(el,'lsGanttChartTask'));
  },

  isTaskEnd: function(el) {
    return (el && el.tagName && Element.Methods.hasClassName(el,'lsGanttChartTaskEnd'));
  },

  isProgress: function(el) {
    return (el && el.tagName && Element.Methods.hasClassName(el,'lsGanttChartProgress'));
  },

  isProgressStart: function(el) {
    return (el && el.tagName && Element.Methods.hasClassName(el,'lsGanttChartProgressStart'));
  },

  insertGantChartScale: function(rows, gantChartScale) {
    if (rows!=null) {
      var row = rows.firstChild;
      for (; row; row = row.nextSibling) {
        if (!this.isRow(row)) continue;
        Element.update(row, row.innerHTML + gantChartScale);
      }
    }
  },
  
  drawGantChart: function(rows) {
    var row = rows.firstChild;
    for (; row; row = row.nextSibling) {
      if (!this.isRow(row)) continue;
      var col = row.firstChild;
      var i = 0;
      var starttime;
      var duration;
      for (; col; col = col.nextSibling) {
        if (!this.isColumn(col)) continue;
        if (i==this.startTimeColumn) {
          var splt = col.innerHTML.split("/");
          if (splt[0]-0 > 0 &&
            splt[1]-0 >= 1 && splt[1]-0 <= 12 &&
            splt[2]-0 >= 1 && splt[2]-0 <= 31) {
            starttime = Date.UTC(splt[0], splt[1]-1, splt[2]);
          }             
        }
        if (i==this.durationColumn) {
          duration = parseInt(col.innerHTML)*this.msDay;
        }
        i++;
      }
      row.setAttribute('_starttime', starttime);
      row.setAttribute('_duration', duration);
      row.setAttribute('_progress', 0.5);
      this.drawTaskLine(row);
    }
  },
  
  clearTaskLine: function(row) {
    var col = row.firstChild;
    for (; col; col = col.nextSibling) {
      if (!this.isColumn(col) || !Element.Methods.hasClassName(col,'lsGanttChartWeek')) continue;
      col.innerHTML = '';
    }
  },  
  
  drawTaskLine: function(row, starttime, duration, progress) {
    if (starttime==undefined) starttime = parseInt(row.getAttribute('_starttime'));
    if (duration==undefined) duration  = parseInt(row.getAttribute('_duration'));
    if (progress==undefined) progress  = parseFloat(row.getAttribute('_progress'));
    var col = row.firstChild;
    var periods = new Array();
    var i = 0;
    for (; col; col = col.nextSibling) {
      if (!this.isColumn(col) || !Element.Methods.hasClassName(col,'lsGanttChartWeek')) continue;
      periods[i++] = col;
    }
    var isParent = this.hasChild(row.getAttribute('_rowid'));
    var endtime = starttime + duration;
    var task1 = '<div class="lsGanttChartTask" style="';
    var task2 = '">' 
    var task3 = '</div>';
    var taskEnd  = '<span class="lsGanttChartTaskEnd">&nbsp;&nbsp;</span>';
    var taskLeft = 0;
    var taskRight = 0;
    var prog1 = '<div class="lsGanttChartProgress" style="';
    var prog2 = '">' + ((progress==0) ? '<span class="lsGanttChartProgressStart">&nbsp;</span>':'') +  '</div>';
    var progressTime = (progress==0) ? 0 : (starttime + Math.round(duration * progress));
    var progressRight = 0;
    var init = true;
    for (i = 0; i<(this.gantChartScaleTimes.length-1); i++) {
      if (starttime < this.gantChartScaleTimes[i] && endtime <= this.gantChartScaleTimes[i]) {
        break;
      }
      if (starttime >= this.gantChartScaleTimes[i+1] && endtime >= this.gantChartScaleTimes[i+1]) {
        continue;
      }
      taskLeft = 0;
      taskRight = 0;
      if (starttime > this.gantChartScaleTimes[i]) {
        taskLeft = (Math.floor((starttime - this.gantChartScaleTimes[i]) / this.msDay) * this.pxcelPerDay) ;
      }
      if (endtime<this.gantChartScaleTimes[i+1]) {
        taskRight = (Math.floor((this.gantChartScaleTimes[i+1] - endtime) / this.msDay) * this.pxcelPerDay) ;
      } 
      var task = task1 + 'margin-left:' + taskLeft + 'px;margin-right:' + taskRight + 'px;' + this.opacity;
      if (isParent) task += "background-color:black;";
      if (endtime > this.gantChartScaleTimes[i] && endtime <= this.gantChartScaleTimes[i+1]) {
        task += 'text-align:right;' + task2 + (((isParent)) ? '':taskEnd) + task3;
      } else {
        task += task2 + task3;
      }
      
      var progress = prog1;
      if (progressTime!=0 && progressTime>=this.gantChartScaleTimes[i]) {
        progressRight = 0;
        if (progressTime<this.gantChartScaleTimes[i+1]) {
          progressRight = (Math.floor((this.gantChartScaleTimes[i+1] - progressTime) / this.msDay) * this.pxcelPerDay) ;
        }
        progress += 'margin-left:' + taskLeft + 'px;margin-right:' + progressRight + 'px;';
      } else if (init) {
        progressRight = periods[i].clientWidth - (taskLeft+ this.pxcelPerDay);
        progress += 'margin-left:' + taskLeft + 'px;margin-right:' + progressRight + 'px;background-color:transparent;'  + this.opacity;;
      } else {
        progress += 'width:0px;'; 
      } 
      progress += prog2;
      if (isParent) {
        Element.update(periods[i], task); 
      } else {
        Element.update(periods[i], task + progress); 
      }
      init = false;
    }
  }
  
});

function log(s) {
  Element.update($('log'), $('log').innerHTML + s + '<br/>');
}