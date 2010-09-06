/* Google Maps APIサンプル */

var map;
var directions;

function initialize() {
  if (GBrowserIsCompatible()) {
    map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(34.696602,135.519447), 13);

    directions = new GDirections(map, document.getElementById("route"));
    GEvent.addListener(directions, "addoverlay", onGDirectionsAddOverlay);
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

function onGDirectionsAddOverlay(){ 
  var od = directions.getDistance();
  var ot = directions.getDuration();

  var html = "ルート全体 " + od.html + " " + ot.html + "<br />";

  var routeNum = directions.getNumRoutes();
  for (var i = 0 ; i < routeNum ; i++){
    var route = directions.getRoute(i);
    var ord = route.getDistance();
    var ort = route.getDuration();

    html += "Route[" + i + "] " + ord.html + " " + ort.html + "<br />";
  }

  document.getElementById("route").innerHTML = html;
}
