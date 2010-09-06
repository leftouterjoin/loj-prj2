/* Google Maps APIサンプル */

function initialize() {
  if (GBrowserIsCompatible()) {
    var map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(35.681379,139.765577), 13);

    var directions = new GDirections(map, document.getElementById('route'));

    var point1 = new GLatLng(35.62758190931674,139.88754272460938);
    var point2 = new GLatLng(35.63100031817364,139.77622032165527);
    var point3 = new GLatLng(35.66489743718014,139.76690769195557);

    var pointArray = [point1, point2, point3];
    directions.loadFromWaypoints(pointArray, {locale: 'ja_JP'});
  }
}
