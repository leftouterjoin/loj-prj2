/* Google Maps APIサンプル */

var map;
var directions;

function initialize() {
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(35.16809,136.911621), 13);

    directions = new GDirections(map, null);
    GEvent.addListener(directions, "load", onGDirectionsLoad);
  }
}

function dispRoute() {
  var from = document.getElementById("from").value;
  var step = document.getElementById("step").value;
  var to = document.getElementById("to").value;

  directions.clear();

  var pointArray = [from,step,to];
  directions.loadFromWaypoints(pointArray, {locale: "ja_JP"});
}

function onGDirectionsLoad(){ 
  var html = '';

  var num = directions.getNumGeocodes();
  for (var i = 0 ; i < num ; i++){
    var obj = directions.getGeocode(i);
    var address = obj.address;
    var lng = obj.Point.coordinates[0];
    var lat = obj.Point.coordinates[1];

    html += "[" + i + "]" + obj.address + " " + lat + "," + lng + "<br />";
  }

  document.getElementById("route").innerHTML = html;
}
