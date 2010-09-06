/* Google Maps APIサンプル */

function initialize() {
  if (GBrowserIsCompatible()) {
    var map = new GMap2(document.getElementById("map_canvas"));
    map.setCenter(new GLatLng(35.681379,139.765577), 13);

    var directions = new GDirections(map, document.getElementById('route'));
    directions.load('from: 東京駅 to: 渋谷駅', {locale: 'ja_JP'});
  }
}
