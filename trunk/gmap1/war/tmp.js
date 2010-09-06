	<script type="text/javascript">
		$("<script type='text/javascript' src='http://maps.google.com/maps/api/js?sensor=false'></scri" + "pt>").appendTo("body");
		(function($) {
				var myOptions = {
					zoom: 8,
					center: new google.maps.LatLng(35.5, 140.0),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		})(jQuery);
	</script>


	<script type="text/javascript">
		$("<script type='text/javascript' src='http://maps.google.com/maps/api/js?sensor=false'></script" + ">").appendTo("body");
	</script>

	<script type="text/javascript">
		alert(google.maps.Map);
	</script>


<script>
$(document).ready(function(){
	$.getScript("http://maps.google.com/maps/api/js?sensor=false", function(){
		document.write("<div id='map_canvas' style='width:600px; height:200px;'>" + "<" + "/div" + ">");
		setTimeout(function(){
				var myOptions = {
					zoom: 8,
					center: new google.maps.LatLng(35.5, 140.0),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		}, 1000);
	});
})
</script>


<script>
$(document).ready(function(){
			document.write("<div id='map_canvas' style='width:600px; height:200px;'>" + "<" + "/div" + ">");
	$.getScript("http://maps.google.com/maps/api/js?sensor=false", function(){
		$.getScript("http://maps.gstatic.com/intl/ja_ALL/mapfiles/api-3/2/3/main.js", function(){
			var myOptions = {
				zoom: 8,
				center: new google.maps.LatLng(35.5, 140.0),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		});
	});
})
</script>



<div id="map_canvas" style="width:600px; height:200px;"></div>
<script>
	var write = document.write;
	document.write = function(a) {
		$.getScript("http://maps.gstatic.com/intl/ja_ALL/mapfiles/api-3/2/3/main.js", function(){
			var myOptions = {
				zoom: 8,
				center: new google.maps.LatLng(35.5, 140.0),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		});
	};
</script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>



<div id="map_canvas" style="width:600px; height:200px;"></div>
<script>
	(function($) {
		var write = document.write;
		document.write = function(a) {
			$.getScript("http://maps.gstatic.com/intl/ja_ALL/mapfiles/api-3/2/3/main.js", function(){
				var myOptions = {
					zoom: 8,
					center: new google.maps.LatLng(35.5, 140.0),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				new google.maps.Map(document.getElementById("map_canvas"), myOptions);
			});
		};
	})(jQuery);
</script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
