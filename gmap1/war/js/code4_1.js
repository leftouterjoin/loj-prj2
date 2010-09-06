/* Google Maps APIサンプル */

var map;
var directions;

function initialize() {
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(35.681379,139.765577), 13);

    directions = new GDirections(map, document.getElementById('route'));
  }
}

function dispRoute() {
  var from = document.getElementById("from").value;
  var step = document.getElementById("step").value;
  var to = document.getElementById("to").value;

  directions.clear();

  var pointArray = [from,step,to];
  directions.loadFromWaypoints(pointArray, {locale: 'ja_JP'});
}
