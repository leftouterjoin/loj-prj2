function initialize() {
  if (GBrowserIsCompatible()) {
    var map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(41.7724,140.72628), 12);
    
    var directions = new GDirections(map, document.getElementById('route'));
  }
}