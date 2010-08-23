/*
 *  Copyright (c) 2006-2010 LittleSoft Corporation
 *  http://www.littlesoft.jp/lsj/license.html
 */

if(typeof(Prototype)=='undefined') 
  throw("littlesoft groupware component requires including prototype.js library");

/*
 * リトルソフトグループウェア共通スクリプト littlesoft_gw.js
 * 
 * @author LittleSoft Corporation
 * @version 1.0.0
 */
var lsg = {

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
	 * @method _load
	 */
	_load: function() {
		var js = /littlesoft_gw\.js(\?.*)?$/;
		$$('head script[src]').findAll(function(s) {
			return s.src.match(js);
		}).each(function(s) {
			var grsbaseInc = false;
			var path = s.src.replace(js, ''),
			includes = s.src.match(/\?.*load=([a-z,]*)/);
			lsg._include(path+'log4js.js');
			(includes ? includes[1] : 'grsgroupday,grsgroupweek,grsmonth,grsweek,tabcontainer,simplemsg').split(',').each(
				function(include) {
					if (include.indexOf('grs') == 0 && !grsbaseInc) {
						lsg._include(path+'grsbase\/grsbase.js');
						grsbaseInc = true;
					}
					lsg._include(path+include+'\/'+include+'.js');
				}
			);
		});
	},

	/**
	 * [ Public ] 共通文字列定数
	 */
	LSCNS : {
		NULLSTRING : '',
		td         : 'td',
		th         : 'th',
		TD         : 'TD',
		TH         : 'TH',
		tr         : 'tr',
		TR         : 'TR',
		none       : 'none',
		hidden     : 'hidden',
		px         : 'px'
	},
  
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
	 * [ Public ] ログオブジェクト
	 *
	 * @field logger
	 */
	logger: null,

	/**
	 * [ Public ] ログオブジェクトの初期化を行います。
	 *
	 * @method InitializeLogger
	 */
	initializeLogger: function() {
		lsg.logger = new Log4js.Logger("lsg debug");
		lsg.logger.setLevel(Log4js.Level.ALL);
		lsg.logger.addAppender(new Log4js.ConsoleAppender());
	}

};

// スクリプト書き出し
lsg._load();
