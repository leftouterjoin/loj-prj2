/* Google Maps APIサンプル */

var map;
var directions;

function initialize() {
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(35.681379,139.765577), 13);

    directions = new GDirections(null, document.getElementById("route"));
  }
}

function dispRoute() {
  var from = document.getElementById("from").value;
  var to = document.getElementById("to").value;

  directions.clear();

  var pointArray = [from,to];
  var option = {locale: "ja_JP", getPolyline: true, getSteps: true};
  directions.loadFromWaypoints(pointArray, option);
}

function test1() {
  
	var o = directions.getPolyline();
	alert(o);
}
