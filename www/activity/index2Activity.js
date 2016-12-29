var index2Activity = 
{
	ini: function() {

	},
	load: function(){
		var div = document.getElementById("map2");
		map = plugin.google.maps.Map.getMap(div);
		map.addEventListener(plugin.google.maps.event.MAP_READY, this.onMapReady);
	},
	onMapReady: function(){
		console.log('se cargo el mapa');
	}
}