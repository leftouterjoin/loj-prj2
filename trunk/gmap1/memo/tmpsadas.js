	<div id="map_canvas" style="width:600px; height:200px;"></div>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
	<script type="text/javascript">
		function initialize() {
			(function($) {
				var myOptions = {
					zoom: 8,
					center: new google.maps.LatLng(35.5, 140.0),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				new google.maps.Map($("#map_canvas").get(0), myOptions);
			})(jQuery);
		}
		(function($) {
			$.getScript("http://maps.google.com/maps/api/js?sensor=false&callback=initialize");
		})(jQuery);
	</script>


	<script type="text/javascript">
		(function($) {
			$.fn.extend({
				initialize: function() {
					var myOptions = {
						zoom: 8,
						center: new google.maps.LatLng(35.5, 140.0),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					new google.maps.Map($("#map_canvas").get(0), myOptions);
				}
			});
			$.getScript("http://maps.google.com/maps/api/js?sensor=false&callback=$.initialize");
		})(jQuery);
	</script>


	<script type="text/javascript">
		(function($) {
			$.extend({
				gmap : {
					initialize: function() {
						alert("");
					}
				}
			});
			$.getScript("http://maps.google.com/maps/api/js?sensor=false&callback=$.gmap.initialize");
		})(jQuery);
	</script>


	<div id="map_canvas" style="width:600px; height:200px;"></div>
	<script type="text/javascript">
		(function($) {
			$.extend({
				gmap : {
					initialize: function() {
						var myOptions = {
							zoom: 8,
							center: new google.maps.LatLng(35.5, 140.0),
							mapTypeId: google.maps.MapTypeId.ROADMAP
						};
						new google.maps.Map($("#map_canvas").get(0), myOptions);
					}
				}
			});
			$.getScript("http://maps.google.com/maps/api/js?sensor=false&callback=$.gmap.initialize");
		})(jQuery);
	</script>



	<script type="text/javascript">
		(function($) {
			$.extend({
				aaa: function(a) {
					alert(a);
				}
			});
			$.bbb = function(a) {
				alert(a);
			};
			$.aaa("a1");
			$.bbb("b1");
		})(jQuery);
		(function($) {
			$.aaa("a2");
			$.bbb("b2");
		})(jQuery);
	</script>



	<script type="text/javascript">
		(function($) {
			var waitFor = function(e) {
				var e_ = e;
				if (!e()) {
					setTimeout(function() {waitFor(e_)}, 500);
				}
			};

			var a = 0;
			waitFor(function() {
				alert(a);
				a++;
				return (5 < a);
			});

			while (true) {
			}

			alert("end");
		})(jQuery);
	</script>



	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			console.log("start.");

			var myOptions = {
				zoom: 8,
				center: new google.maps.LatLng(35.5, 140.0),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			new google.maps.Map($("#map_canvas").get(0), myOptions);
		});
	</script>

