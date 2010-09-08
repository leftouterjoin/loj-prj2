GoogleマップAPIの動的ロードと初期化

**動的ロードの問題点


例えば、純粋にjQueryのgetScriptでロードしようとしても

>|javascript|
$.getScript("http://maps.google.com/maps/api/js?sensor=false", 
...
||<

こんなエラーになります。

理由は、ロードしたスクリプト内でscriptタグをdocument.writeしているからです。


これを回避するためには、
document.writeを


見つけました。
http://code.google.com/intl/ja/apis/maps/documentation/javascript/basics.html#Async


本来の用途は
