document.addEventListener("deviceready", function() {
  ready();
}, false);

var map;
var div;
function ready(){
  div = document.getElementById("map_canvas3");
  map = plugin.google.maps.Map.getMap(div);
  map.one(plugin.google.maps.event.MAP_READY, function() {
    map_ready();
  });
}

var POINTS = 
[
  {
    position: {lat:-11.987576666667, lng: -77.159166666667},
    title: "MAR PACIFICO",
  },
  {
    position: {lat:-4.5693666666667, lng: -81.292045},
    title: "VALI",
  }
];

function addMarkers(map, data, callback) {
  var markers = [];
  function onMarkerAdded(marker) {
    markers.push(marker);

    // If you click on a marker, the marker's icon will be changed.
    marker.on(plugin.google.maps.event.MARKER_CLICK, onMarkerClick);
    marker.on(plugin.google.maps.event.INFO_CLICK, onMarkerClick);

    if (markers.length === data.length) {
      callback(markers);
    }
  }
  data.forEach(function(markerOptions) {
    map.addMarker(markerOptions, onMarkerAdded);
  });
}

function onMarkerClick(){
  alert("onMarkerClick");
}

function map_ready(){

  map.moveCamera({
    target: {lat: -13.80997, lng: -77.91021},
    zoom: 5
  }, function() {
    //alert("Camera target has been changed");
  });

  addMarkers(map,POINTS,function(markers){
    var bounds = [];
    for(var i=0; i<markers.length; i++){
      bounds.push(markers[i].getPosition());
    }
    map.moveCamera({target:bounds});
  });

}