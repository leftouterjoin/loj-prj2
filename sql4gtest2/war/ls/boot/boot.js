if (typeof(ls.Dialog)=="undefined") {
  throw ("boot.js requires including dialog.js library");
}

Event.observe(document, 'dom:loaded', function() {
 
  ls.checkProgress = function(){
    if (!this.progress || this.progress==null) {
      this.progress = new ls.Dialog('__progressBox',{
        modal:true, closeButton:false, resizable:false, 
        width:240, height:14, title:''
      });  

    }
  };
  
  ls.enterProgress  = function(){
    ls.checkProgress();
    this.progress.setTitle('');
  };
  
  ls.updateProgress = function(text, progress){
    ls.checkProgress();
    if (this.progress.dialog.style.display=='none') {
      this.progress.show('ls/dummy.htm');
    }
    this.progress.setTitle('<span style="font-size:90%;color:#808080;">Spin up CloudWare - ' + text + '</span>');
    var iframedoc;
    if (document.all) {
      iframedoc = this.progress.dialogFrame.contentWindow.document;
    } else {
      iframedoc = this.progress.dialogFrame.contentDocument;
    }
    iframedoc.clear();
    iframedoc.open();
    iframedoc.write('<html><body style="margin:0;padding:0;overflow:hidden;border:solid 1px #808080;width:95%;height:90%;">');
    iframedoc.write('<div id="__progressBar" style="margin:0;padding:0;background-color:#CCCCCC;');
    iframedoc.write('position:relative;height:100%;width:' + progress + '%;');
    iframedoc.write('"><span style="font-size:70%;color:#FFF;">' + progress + '%</span></div>');
    iframedoc.write('</body></html>');
    iframedoc.close();
  };
  
  ls.exitProgress   = function(){
    ls.checkProgress();
    this.progress.setTitle('');
    try { this.progress.hide(); } catch (e) {}
  };
});