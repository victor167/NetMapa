
var point1, point2;
var poly;

var directionsDisplay;
var map;
var distancia = 0;
var tiempo = 0;
var markersArray = [];
var lineSymbol;
var linesArray = [];
var rectangleArray = [];
var myInfoWindow;
var str_mapRefresh = '';
var result;

var getInfoMyShips=false;
var select_id_ship=0;
var select_marker;

var load_map = false;

var id_company=2;
/*********************************************/

var map;
var div;

var indexActivity = 
{
    ini: function(){
        div = document.getElementById("map_canvas3");
        map = plugin.google.maps.Map.getMap(div);
        map.one(plugin.google.maps.event.MAP_READY, function() {
            alert("map ready");
            indexActivity.map_ready();
        });
    },
    POINTS : 
    [
      {
        position: {lat:-11.987576666667, lng: -77.159166666667},
        title: "MAR PACIFICO",
      },
      {
        position: {lat:-4.5693666666667, lng: -81.292045},
        title: "VALI",
      }
    ],
    markers: [],
    addMarkers: function (map, data, callback) 
    {
      data.forEach(function(markerOptions) {
        map.addMarker(markerOptions, function(marker){
            indexActivity.markers.push(marker);

            // If you click on a marker, the marker's icon will be changed.
            marker.on(plugin.google.maps.event.MARKER_CLICK, indexActivity.onMarkerClick);
            marker.on(plugin.google.maps.event.INFO_CLICK, indexActivity.onMarkerClick);

            if (indexActivity.markers.length === data.length) {
              callback(indexActivity.markers);
            }
        });
      });
    },
    onMarkerClick: function ()
    {
      alert("onMarkerClick");
    },
    map_ready: function ()
    {
      map.moveCamera({
        target: {lat: -13.80997, lng: -77.91021},
        zoom: 5
      }, function() {
        //alert("Camera target has been changed");
      });

      indexActivity.addMarkers(map,indexActivity.POINTS,function(){
        var bounds = [];
        for(var i=0; i<indexActivity.markers.length; i++){
          bounds.push(indexActivity.markers[i].getPosition());
        }
        map.moveCamera({target:bounds});
      });

    },
    /*ini: function() {
        
        $$("body").on("click","#btnSearch",function(){
            $$("#search .search-icon").html('');

            $$("#search").toggleClass("show");
            $$('#search .search.input input[type="text"]').val("").focus();
        });

        $$("body").on("click","#search .clear",function(){
            console.log("LIMPIANDO");
            $$("#search .search-icon").html('');
            $$('#search .search.input input[type="text"]').val("");
            $$("#search").removeClass("result-list");
        });

        $$("body").on('click','#search input[type="text"]',function(){
            console.log("CLICK SEARCH");
            var countSerachExist = $$("#search .content-result .result").length;
            if(countSerachExist>0){
                $$("#search").addClass("result-list");
            }
        });

        function search_regex(complete,search)
        {
            var returning = new Object;
            var expsearch = new RegExp("^" + search.toLowerCase());
            resultExpsearch = expsearch.test(complete.toLowerCase());
            if(resultExpsearch)
            {
                returning.result    = true;
                nsearch             = (complete.toLowerCase()).search(expsearch);
                nsearchCount        = search.toLowerCase().length;
                searchChart         = (complete).substring(nsearch, nsearch + nsearchCount);
                returning.complete  = (complete).replace(searchChart,'<b style="color:black;">'+searchChart+'</b>');
            }
            else
            {
                returning.result    = false;
                returning.complete  = complete;
            }

            return returning;
        }

        $$("body").on('keyup','#search input[type="text"]',function(){
            $$("#search .search-icon").html('');
            var shipSeach = $$(this).val();
            console.log("shipSeach: " + shipSeach);

            $$("#search .search.results .content-result").html("");
            if(shipSeach!="")
            {
                $$("#search").addClass("result-list");
                $$("#search .search.results").show();
                var countSearch = 0;
                $$.each(indexActivity.ships,function(index,value){

                    var searchName = search_regex(value.shipname,shipSeach);
                    if(searchName.result)
                    {
                        countSearch++;
                        
                        $$("#search .search.results .content-result").append('<div class="result" data-id="'+index+'" data-idComp="'+value.id_company+'" data-back="'+value.shiptypeColor+'" data-shape="'+value.NavigationStatusShape+'" data-lat="'+value.lat+'" data-lon="'+value.lon+'" data-name="'+value.shipname+'">' + searchName.complete + ' ['+value.shiptypeDesc+']' + '</div>');
                    }
                });

                if(countSearch==0)
                {
                    $$("#search .search.results .content-result").append('<div class="result-empty">No se encontro ningun barco con ese nombre</div>');
                }
            }else{
                $$("#search").removeClass("result-list");
                $$("#search .search.results").hide();
            }
        });

        $$("body").on("click","#search .content-result .result",function(){
            var id          = $$(this).attr("data-id");
            var idcomp      = parseInt($$(this).attr("data-idcomp"));
            var shape       = $$(this).attr("data-shape");
            var lati        = parseFloat($$(this).attr("data-lat"));
            var lon         = parseFloat($$(this).attr("data-lon"));
            var nameShip    = $$(this).attr("data-name");
            //var nameShip    = $$(this).html();

            var color       = "#2196F3";
            if(idcomp==id_company)
            {
                color       = "#F44336";
            }

            var background  = "#000c18";
            if($$(this).attr("data-back")!="")
            {
                background  = $$(this).attr("data-back");
            }


            if(shape=="point")
            {
                $$("#search .search-icon").html('<div class="icon circle" style="border: 2px solid '+color+';background: '+background+';"></div>');
            }
            else if(shape=="arrow")//PROCESS
            {
                $$("#search .search-icon").html('<div class="icon arrow" ><i class="material-icons" style="color: '+background+'; text-shadow: -2px 0px '+color+', 0px -3px '+color+', 1px 0px '+color+', 0px 2px '+color+';">navigation</i></div>');
            }
            else if(shape=="square")
            {
                $$("#search .search-icon").html('<div class="icon square" style="background: '+background+';border: 2px solid '+color+';"></div>');
            }
            else if(shape=="diamond")
            {
                $$("#search .search-icon").html('<div class="icon diamond" style="background: '+background+';border: 2px solid '+color+';"></div>');
            }
            else if(shape=="triangle")
            {
                $$("#search .search-icon").html('<div class="icon triangle"><i class="material-icons" style="color: '+background+'; text-shadow: -2px 0px '+color+', 0px -2px '+color+', 1px 0px '+color+', 1px 1px '+color+', 4px 1px '+color+', -3px 1px '+color+';">&#xE5C7;</i></div>');
            }
            else if(shape=="cross")
            {
                $$("#search .search-icon").html('<div class="icon cross" style="background: '+background+';border: 2px solid '+color+';"></div>');
            }
            else if(shape=="hexagon")
            {
                $$("#search .search-icon").html('<div class="icon hexagon" > <div class="box1" style="border-bottom: 8px solid '+background+';"></div> <div class="box2" style="background-color: '+background+';"></div> <div class="box3" style="border-top: 8px solid '+background+';"></div> </div>');
            }
            else
            {
                $$("#search .search-icon").html('');
            }

            console.log("lat: " + lati);
            console.log("lng: " + lon);

            marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: {lat: lati, lng: lon}
            });
            marker.setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(function(){
                //marker.setAnimation(null);
                setTimeout(function(){
                    marker.setMap(null);
                },190);
            },2000);

            $$("#search .content-result .result").hide();
            $$(this).show();
            $$("#search").removeClass("result-list");
            $$('#search .search.input input[type="text"]').val(nameShip);
            var mainCenter = new google.maps.LatLng(lati, lon);
            map.setCenter(mainCenter);
            map.setZoom(15);

        });

        load_map = true;
        Main.appendScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDqqseQsCvkJfCpy6gswmpUY4IBhCCrtZU&callback=indexActivity.initMap&libraries=geometry");
    },*/
    ships:[],
    rad: function (x) {
        return x * Math.PI / 180;
    },
    getDistance: function (p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    },
    GoRecorrido: function() {
        window.location.href = "Browser.aspx";
    },
    GoGuardia: function(){
        window.location.href = "../Guard.aspx";
    },
    fnEnableTool: function(){
        if(point1!=null)
            point1.setMap(null);
        if(point2!=null)
            point2.setMap(null);
        if(poly!=null)
            poly.setMap(null);

        var center = map.getCenter();
        var lat = center.lat();
        var lng = center.lng();
        var constante = 0.002;
        point1 = new google.maps.Marker({
            map: map,
            draggable: true,
            position: { lat: (lat), lng: (lng - constante) },
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|02588C|FFFFFF'
        });

        point2 = new google.maps.Marker({
            map: map,
            draggable: true,
            position: { lat: (lat), lng: (lng + constante) },
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=B|02588C|FFFFFF'
        });            

        google.maps.event.addListener(point1, 'position_changed', indexActivity.update);
        google.maps.event.addListener(point2, 'position_changed', indexActivity.update);

        poly = new google.maps.Polyline({
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map,
        });
        indexActivity.update();
        $$('#floating-panel').show();
    },
    fnDisableTool:function()
    {
        $$('#floating-panel').hide('fast');
        point1.setMap(null);
        point2.setMap(null);
        poly.setMap(null);
    },
    zoomToFit:function(){
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markersArray.length; i++) {
            bounds.extend(markersArray[i].getPosition());
        }
        for (var i = 0; i < linesArray.length; i++) {
            bounds.extend(linesArray[i].getPath().getArray()[0]);
        }
        //map.fitBounds(bounds);
        var mainCenter = new google.maps.LatLng(-12.079976389372302, -77.21021929484084);
        map.setCenter(mainCenter);
    },
    removeLines:function() {
        for (var i = 0; i < linesArray.length; i++) {
            linesArray[i].setMap(null);
        }
        linesArray.length = 0;
    },
    removeRectangle:function() {
        for (var i = 0; i < rectangleArray.length; i++) {
            rectangleArray[i].setMap(null);
        }
        rectangleArray.length = 0;
    },
    getRandomColor: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    lg: function(s){
        console.log(s);
    },
    fnDialog: function(id_ship, marker) {
        select_id_ship  = id_ship;
        select_marker   = marker;
        getInfoMyShips=true;

        mainView.router.load({
            'url':'layout/detalleNaveEmpresa.html',
            'animatePages':true
        });
    },
    fnDialogPublic: function(id_ship, marker) {
        select_id_ship  = id_ship;
        select_marker   = marker;
        getInfoMyShips=false;
        
        mainView.router.load({
            'url':'layout/detalleNaveEmpresa.html',
            'animatePages':true
        });
    },
    clearOverlays: function() {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    },
    bindInfoWindow: function(marker, map, infowindow, html, id_ship) {
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(html);
            infowindow.open(map, marker);
        });

        google.maps.event.addListener(marker, "dblclick", function () { 

            var source = marker.source;
            var id_company = source.id_company;
            if (id_company == null)
                id_company = 0;
            if(id_company!=0){
                //alert("fnDialog");
                indexActivity.fnDialog(id_ship, marker);
            }
            else{
                //alert("fnDialogPublic");
                indexActivity.fnDialogPublic(id_ship, marker);
            }
            //$(document).ready(function(){

                   //$('#myModal').modal('show');
                    //alert('modal ');
                   // $('#myModal').dialog();
                //document.getElementById("btnLoadModal").onclick();
              //  fnDialog();

               // });
        });

        google.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.setContent(html);
            infowindow.open(map, marker);
        });

        google.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
        });
    },
    initMap: function() {

        var styles = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];
 
        var styledMap = new google.maps.StyledMapType(styles,
            { name: 'Mar' });

        myInfoWindow = new google.maps.InfoWindow({
            content: ''
        });

        directionsDisplay = new google.maps.DirectionsRenderer();
        
        //var mainCenter = new google.maps.LatLng(-12.079976389372302, -77.21021929484084);
        var mainCenter = new google.maps.LatLng(-13.80997, -77.91021);
        var mapOptions = {
            zoom: 5,
            center: mainCenter,
            disableDefaultUI: true,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };           

        directionsDisplay.setMap(map);
        
        indexActivity.RefreshBoat();

        setTimeout(indexActivity.GetVal, 20000);


        /*$('#btn_wide').click(function () {
            $('#panel-input').hide('fast');
            $('#btn_show').show();
        });

        $('#btn_show').click(function () {
            $('#panel-input').show('fast');
            $('#btn_show').hide();
        });            


        var overlay = new google.maps.OverlayView();
        overlay.draw = function() {};
        overlay.setMap(map); // 'map' is new google.maps.Map(...)

        google.maps.event.addListener(map, "mousemove", function(event) {
            document.getElementById('location-panel').innerHTML = fixedLlString(event.latLng.lat(),event.latLng.lng());
        });
        */
    },
    fixedLlString: function(la,lo)
    {   var s="N";
        var w="E";
        if(la<0)
            {la=-la;s="S"}
        if(lo<0)
            {lo=-lo;w="W"}
        var lai=Math.floor(la);
        var laf=Math.round((la-lai)*1E4);
        var lais=lai.toString();
        while(lais.length<2){lais="0"+lais;}
        var lafs=laf.toString();
        while(lafs.length<4){lafs="0"+lafs;}
        var loi=Math.floor(lo);
        var lof=Math.round((lo-loi)*1E4);
        var lois=loi.toString();
        while(lois.length<3){lois="0"+lois;}
        var lofs=lof.toString();
        while(lofs.length<4){lofs="0"+lofs;}
        var lamin=Math.floor((la-lai)*60);
        var lasec=((la-lai)*60-lamin)*60;
        var laseci=Math.floor(lasec);
        var lasecf=Math.floor((lasec-laseci)*100);
        if(lamin.toString().length==1){lamin="0"+lamin;}
        if(laseci.toString().length==1){laseci="0"+laseci;}
        if(lasecf.toString().length==1){lasecf="0"+lasecf;}
        var lomin=Math.floor((lo-loi)*60);
        var losec=((lo-loi)*60-lomin)*60;
        var loseci=Math.floor(losec);
        var losecf=Math.floor((losec-loseci)*100);
        if(lomin.toString().length==1){lomin="0"+lomin;}
        if(loseci.toString().length==1){loseci="0"+loseci;}
        if(losecf.toString().length==1){losecf="0"+losecf;}
        var res="";
        res=s+lais+"&deg;"+lamin+"'"+laseci+"."+lasecf+'"<br/>';res+=w+lois+"&deg;"+lomin+"'"+loseci+"."+losecf+'"<br/>';res+="("+(s=="S"?"-":"")+lais+"."+lafs+", "+(w=="W"?"-":"")+lois+"."+lofs+")";
        return res
    },
    update: function() 
    {
        var path = [point1.getPosition(), point2.getPosition()];
        poly.setPath(path);
        var distancia = parseFloat(indexActivity.getDistance(point1.getPosition(), point2.getPosition()));
        distancia = distancia/1000;
        distancia = distancia.toFixed(2);
        var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
        var info = "<b>Distancia:</b> " + distancia + " Km<br>";
        info += "<b>Origen:</b> " + path[0].toString() + "<br>";
        info += "<b>Destino:</b> " + path[1].toString()+ "<br><br>";
        $$("#floating-panel").html(info);
    },
    square: function(vshape, vstrokeColor, vfillColor, vfillOpacity, vstrokeOpacity, vscale, lat1, lon1) {
        var shape = '';
        switch (vshape) {
            case 'square': shape = 'M -2,-2 2,-2 2,2 -2,2 z'; break;
            case 'diamond': shape = 'M -2,-2 2,-2 2,2 -2,2 z'; break;
            case 'triangle': shape = 'M 0 5 L 10 5 L 5 10 z'; break;
            case 'cross': shape = 'M -2,-2 2,-2 2,2 -2,2 z'; break;
            case 'hexagon': shape = 'M -2,-2 2,-2 2,2 -2,2 z'; break;
        }
        var vicon;
        if (vshape == 'diamond') {
            vicon = {
                path: 'M -2,-2 2,-2 2,2 -2,2 z', // 'M -2,0 0,-2 2,0 0,2 z',
                strokeColor: vstrokeColor,
                fillColor: vfillColor,
                fillOpacity: vfillOpacity,
                strokeOpacity: vstrokeOpacity,
                scale: vscale,
                rotation: 45
            };
        }
        else {
            if (vshape == 'triangle') {
                vicon = {
                    path: shape, // 'M -2,0 0,-2 2,0 0,2 z',
                    strokeColor: vstrokeColor,
                    fillColor: vfillColor,
                    fillOpacity: vfillOpacity,
                    strokeOpacity: vstrokeOpacity,
                    scale: 2,
                    rotation: 180
                };
            }
            else {
                vicon = {
                    path: shape, // 'M -2,0 0,-2 2,0 0,2 z',
                    strokeColor: vstrokeColor,
                    fillColor: vfillColor,
                    fillOpacity: vfillOpacity,
                    strokeOpacity: vstrokeOpacity,
                    scale: vscale
                };
            }
        }
        
        var myLatlng1 = { lat: lat1, lng: lon1 };
        if (vshape == 'cross') {
            return (new google.maps.Marker({
                position: myLatlng1,
                map: map,
                icon: vicon,
                label: {
                    text: "X",
                    fontWeight: "bold"
                }
            }));
        }
        else {
            return (new google.maps.Marker({
                position: myLatlng1,
                map: map,
                icon: vicon
            }));
        }
    },
    GetVal:function() {
        var str_tx_val_key = 'TimeRefreshWeb'; //'20';

        /*$$.ajax({
            type: "POST",
            url: "MyTracking.aspx/GetVal",
            data: '{str_tx_val_key: "' + str_tx_val_key + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: indexActivity.ValResponse,
            failure: function (response) {
                alert(response);
            }
        });*/

        /*Main.restFul(
            API + 'MapGetTimeRefresh',
            'GET',
            {
                str_tx_val_key:str_tx_val_key
            },
            function(respondBody,respondHeader)
            {
                var data = respondBody.data;
                indexActivity.ValResponse(data);
            }
        );*/

        indexActivity.ValResponse({d:120});

    },
    MainRefresh:function() {
        indexActivity.RefreshBoat();
        setTimeout(indexActivity.zoomToFit, 2000);
    },
    RefreshBoat: function() {
        indexActivity.removeRectangle();
        indexActivity.removeLines();
        indexActivity.clearOverlays();
        var str_Id_ship = 1;// $('#cboCompany').val();


        Main.restFul(
            API + 'Ship',
            'GET',
            {},
            function(respondBody,respondHeader)
            {
                console.log("AddArrayPoint");
                indexActivity.ships = JSON.parse(respondBody.data.d);
                indexActivity.AddArrayPoint();
            }
        );

/*
        //indexActivity.AddArrayPoint({"d":"[\r\n  {\r\n    \"mmsi\": 319054800,\r\n    \"imo\": 964080194,\r\n    \"callsign\": \"EXCURS@\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"\u003e\u003e\u003e ENIGMA        @\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 10.0000,\r\n    \"to_stern\": 8.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.16363666666700,\r\n    \"lat\": -12.06111666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 164.6000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 138,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420454,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"@@U04\u003c[,@@@@@@@APCQA\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 40.0000,\r\n    \"to_stern\": 13.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 5.9000,\r\n    \"lon\": -77.19056500000000,\r\n    \"lat\": -12.03735500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 242.0000,\r\n    \"heading\": 480,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 472,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420455,\r\n    \"imo\": 0,\r\n    \"callsign\": \"BZ4VK@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"@CD4BHH%P\u0026-E\\\\\\\"0@@@@@\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 5.1000,\r\n    \"lon\": -77.19881833333300,\r\n    \"lat\": -12.03241333333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 275.1000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 477,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 311032100,\r\n    \"imo\": 9403059,\r\n    \"callsign\": \"C6YG6  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"AFRICAN SANDERLING  \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 161.0000,\r\n    \"to_stern\": 29.0000,\r\n    \"to_port\": 21.0000,\r\n    \"to_starboard\": 11.0000,\r\n    \"destination\": \"COQUIMBO H@@@@@@@@@@\",\r\n    \"speed\": 15.3000,\r\n    \"lon\": -77.20608166666700,\r\n    \"lat\": -12.38904833333300,\r\n    \"draught\": 6.3000,\r\n    \"turn\": 0,\r\n    \"course\": 164.0000,\r\n    \"heading\": 164,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 246,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538004912,\r\n    \"imo\": 9635676,\r\n    \"callsign\": \"V7ZT8  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ALEXANDRA           \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 196.0000,\r\n    \"to_stern\": 74.0000,\r\n    \"to_port\": 25.0000,\r\n    \"to_starboard\": 17.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 16.6000,\r\n    \"lon\": -77.29677666666700,\r\n    \"lat\": -12.26368833333300,\r\n    \"draught\": 13.5000,\r\n    \"turn\": 2,\r\n    \"course\": 164.6000,\r\n    \"heading\": 166,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 304,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000140,\r\n    \"imo\": 8705333,\r\n    \"callsign\": \"OA3562@\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"ALORCA@@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 126.0000,\r\n    \"to_stern\": 14.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.18558333333300,\r\n    \"lat\": -12.00049000000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 258.6000,\r\n    \"heading\": 275,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 121,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 374710000,\r\n    \"imo\": 9731535,\r\n    \"callsign\": \"3FSN5\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"AMIS GLORY\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 160.0000,\r\n    \"to_stern\": 29.0000,\r\n    \"to_port\": 13.0000,\r\n    \"to_starboard\": 19.0000,\r\n    \"destination\": \"CALLAO PED@@@@@@@@@@\",\r\n    \"speed\": 4.5000,\r\n    \"lon\": -77.15163333333300,\r\n    \"lat\": -12.04877500000000,\r\n    \"draught\": 11.6000,\r\n    \"turn\": -243,\r\n    \"course\": 298.0000,\r\n    \"heading\": 288,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 707,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001050,\r\n    \"imo\": 9268368,\r\n    \"callsign\": \"OA2457@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ANDES@@@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 8.0000,\r\n    \"to_stern\": 15.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"HARBORTUG@@@@@@@@@@@\",\r\n    \"speed\": 0.2000,\r\n    \"lon\": -77.14316500000000,\r\n    \"lat\": -12.04399833333300,\r\n    \"draught\": 5.0000,\r\n    \"turn\": -128,\r\n    \"course\": 89.9000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 141,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 256812000,\r\n    \"imo\": 9307815,\r\n    \"callsign\": \"9HDC9\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"ARCTIC BRIDGE\",\r\n    \"shiptypeDesc\": \"Tanker, No additional information\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 147.0000,\r\n    \"to_stern\": 35.0000,\r\n    \"to_port\": 13.0000,\r\n    \"to_starboard\": 19.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.19449833333300,\r\n    \"lat\": -11.99633166666700,\r\n    \"draught\": 11.6000,\r\n    \"turn\": 11,\r\n    \"course\": 332.0000,\r\n    \"heading\": 263,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 736,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 244710009,\r\n    \"imo\": 9612791,\r\n    \"callsign\": \"PBUP   \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ARICA EXPRESS       \",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 201.0000,\r\n    \"to_stern\": 23.0000,\r\n    \"to_port\": 23.0000,\r\n    \"to_starboard\": 12.0000,\r\n    \"destination\": \"GUAYAQUILH@@@@@@@@@@\",\r\n    \"speed\": 16.7000,\r\n    \"lon\": -77.33158500000000,\r\n    \"lat\": -11.92385000000000,\r\n    \"draught\": 8.6000,\r\n    \"turn\": 0,\r\n    \"course\": 316.1000,\r\n    \"heading\": 318,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 297,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636017164,\r\n    \"imo\": 9226815,\r\n    \"callsign\": \"A8ET4@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ARKADIA@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 152.0000,\r\n    \"to_stern\": 17.0000,\r\n    \"to_port\": 18.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"GUAYAQUIL@@@@@@@@@@@\",\r\n    \"speed\": 15.1000,\r\n    \"lon\": -77.37872500000000,\r\n    \"lat\": -11.92069666666700,\r\n    \"draught\": 9.4000,\r\n    \"turn\": -248,\r\n    \"course\": 308.7000,\r\n    \"heading\": 309,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 291,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 311702000,\r\n    \"imo\": 9283629,\r\n    \"callsign\": \"C6TM9  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ASPROPYRGOS         \",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 198.0000,\r\n    \"to_stern\": 31.0000,\r\n    \"to_port\": 20.0000,\r\n    \"to_starboard\": 12.0000,\r\n    \"destination\": \"CONCHAN  H@@@@@@@@@@\",\r\n    \"speed\": 14.2000,\r\n    \"lon\": -77.43868166666700,\r\n    \"lat\": -12.05709833333300,\r\n    \"draught\": 11.1000,\r\n    \"turn\": 0,\r\n    \"course\": 318.0000,\r\n    \"heading\": 320,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 261,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 477047700,\r\n    \"imo\": 9374272,\r\n    \"callsign\": \"VRDT5\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"ATLANTIC HOPE\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 149.0000,\r\n    \"to_stern\": 34.0000,\r\n    \"to_port\": 21.0000,\r\n    \"to_starboard\": 11.0000,\r\n    \"destination\": \"LA PAMPIC@@@@@@@@@@\",\r\n    \"speed\": 0.2000,\r\n    \"lon\": -77.20449333333300,\r\n    \"lat\": -12.00330000000000,\r\n    \"draught\": 7.5000,\r\n    \"turn\": 0,\r\n    \"course\": 180.2000,\r\n    \"heading\": 200,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 165,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 563422000,\r\n    \"imo\": 9711834,\r\n    \"callsign\": \"9V3142 \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"BAKKEN LADY         \",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 144.0000,\r\n    \"to_stern\": 36.0000,\r\n    \"to_port\": 6.0000,\r\n    \"to_starboard\": 22.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 10.2000,\r\n    \"lon\": -77.27159166666700,\r\n    \"lat\": -11.99593333333300,\r\n    \"draught\": 9.8000,\r\n    \"turn\": 18,\r\n    \"course\": 273.1000,\r\n    \"heading\": 281,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 312,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760113000,\r\n    \"imo\": 8627749,\r\n    \"callsign\": \"OBPN\",\r\n    \"NavigationStatus\": \"Under way sailing\",\r\n    \"NavigationStatusShape\": \"triangle\",\r\n    \"shipname\": \"BAP BAYOVAR\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 140.0000,\r\n    \"to_stern\": 39.0000,\r\n    \"to_port\": 10.0000,\r\n    \"to_starboard\": 15.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.16780500000000,\r\n    \"lat\": -12.05066666666700,\r\n    \"draught\": 7.5000,\r\n    \"turn\": -128,\r\n    \"course\": 144.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 118,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760105000,\r\n    \"imo\": 9999999,\r\n    \"callsign\": \"OBAA@@@\",\r\n    \"NavigationStatus\": \"Under way sailing\",\r\n    \"NavigationStatusShape\": \"triangle\",\r\n    \"shipname\": \"BAP UNION@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 105.0000,\r\n    \"to_stern\": 5.0000,\r\n    \"to_port\": 13.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14253500000000,\r\n    \"lat\": -12.04219500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 328.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 203,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760114000,\r\n    \"imo\": 8623937,\r\n    \"callsign\": \"OBPP\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"BAP ZORRITOS@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 175.0000,\r\n    \"to_stern\": 15.0000,\r\n    \"to_port\": 13.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.17363000000000,\r\n    \"lat\": -12.05165000000000,\r\n    \"draught\": 25.5000,\r\n    \"turn\": -128,\r\n    \"course\": 110.0000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 127,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 305065000,\r\n    \"imo\": 9337236,\r\n    \"callsign\": \"V2CP2@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"BBC ZARATE@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 124.0000,\r\n    \"to_stern\": 14.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 18.0000,\r\n    \"destination\": \"MATARANI@@@@@@@@@@@@\",\r\n    \"speed\": 13.0000,\r\n    \"lon\": -77.29956000000000,\r\n    \"lat\": -12.20293333333300,\r\n    \"draught\": 7.0000,\r\n    \"turn\": 0,\r\n    \"course\": 158.5000,\r\n    \"heading\": 157,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 229,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 725009210,\r\n    \"imo\": 9191553,\r\n    \"callsign\": \"CBBN\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"BOW ANDES\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 116.0000,\r\n    \"to_stern\": 22.0000,\r\n    \"to_port\": 6.0000,\r\n    \"to_starboard\": 20.0000,\r\n    \"destination\": \"MEJILLONED@@@@@@@@@@\",\r\n    \"speed\": 11.5000,\r\n    \"lon\": -77.27283166666700,\r\n    \"lat\": -12.15666500000000,\r\n    \"draught\": 9.8000,\r\n    \"turn\": -129,\r\n    \"course\": 165.0000,\r\n    \"heading\": 164,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 185,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 257718000,\r\n    \"imo\": 9125243,\r\n    \"callsign\": \"LAKT7  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"BOW ARATU           \",\r\n    \"shiptypeDesc\": \"Tanker, Hazardous category B\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 118.0000,\r\n    \"to_stern\": 28.0000,\r\n    \"to_port\": 10.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"MEJILLONED@@@@@@@@@@\",\r\n    \"speed\": 12.8000,\r\n    \"lon\": -77.41883166666700,\r\n    \"lat\": -12.13916500000000,\r\n    \"draught\": 8.5000,\r\n    \"turn\": 0,\r\n    \"course\": 344.9000,\r\n    \"heading\": 346,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 260,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001120,\r\n    \"imo\": 8206624,\r\n    \"callsign\": \"OA2064@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"BT TRANSGAS 1@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 79.0000,\r\n    \"to_stern\": 6.0000,\r\n    \"to_port\": 10.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 2.3000,\r\n    \"lon\": -77.14791166666700,\r\n    \"lat\": -12.05180666666700,\r\n    \"draught\": 4.5000,\r\n    \"turn\": 0,\r\n    \"course\": 296.2000,\r\n    \"heading\": 300,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 119,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001130,\r\n    \"imo\": 912600300,\r\n    \"callsign\": \"OA 2061\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"BT/NASCA\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 162.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.3000,\r\n    \"lon\": -77.21848333333300,\r\n    \"lat\": -12.00313166666700,\r\n    \"draught\": 11.2000,\r\n    \"turn\": 9,\r\n    \"course\": 134.5000,\r\n    \"heading\": 196,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 195,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538004408,\r\n    \"imo\": 9500039,\r\n    \"callsign\": \"V7WW2  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"BULK ORION          \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 162.0000,\r\n    \"to_stern\": 28.0000,\r\n    \"to_port\": 22.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"CALETA MI@@@@@@@@@@@\",\r\n    \"speed\": 13.9000,\r\n    \"lon\": -77.49021333333300,\r\n    \"lat\": -12.18237666666700,\r\n    \"draught\": 8.5000,\r\n    \"turn\": 0,\r\n    \"course\": 164.8000,\r\n    \"heading\": 165,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 283,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000550,\r\n    \"imo\": 9268356,\r\n    \"callsign\": \"OA2013@\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"CAO@@@@@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 12.0000,\r\n    \"to_stern\": 13.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"HARBOUR  E@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.14554833333300,\r\n    \"lat\": -12.05133166666700,\r\n    \"draught\": 5.5000,\r\n    \"turn\": 0,\r\n    \"course\": 155.3000,\r\n    \"heading\": 279,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 220,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 477639300,\r\n    \"imo\": 9484546,\r\n    \"callsign\": \"VRGA3  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CAP INES            \",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 208.0000,\r\n    \"to_stern\": 56.0000,\r\n    \"to_port\": 18.0000,\r\n    \"to_starboard\": 14.0000,\r\n    \"destination\": \"BUENAVENTE@@@@@@@@@@\",\r\n    \"speed\": 15.8000,\r\n    \"lon\": -77.42993000000000,\r\n    \"lat\": -11.85713833333300,\r\n    \"draught\": 1.2200,\r\n    \"turn\": 0,\r\n    \"course\": 311.4000,\r\n    \"heading\": 312,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 224,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538090170,\r\n    \"imo\": 9260067,\r\n    \"callsign\": \"V7FA9\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CAPE BIRD\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 149.0000,\r\n    \"to_stern\": 27.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 15.0000,\r\n    \"destination\": \"LA PAMPILLA\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.18353166666700,\r\n    \"lat\": -11.99544833333300,\r\n    \"draught\": 7.2000,\r\n    \"turn\": 0,\r\n    \"course\": 111.0000,\r\n    \"heading\": 273,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 734,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 16560,\r\n    \"imo\": 123456789,\r\n    \"callsign\": \"CAPRISA\",\r\n    \"NavigationStatus\": \"Engaged in Fishing\",\r\n    \"NavigationStatusShape\": \"diamond\",\r\n    \"shipname\": \"CAPRICORNIO 7@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 4.0000,\r\n    \"to_stern\": 12.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.4000,\r\n    \"lon\": -77.14132666666700,\r\n    \"lat\": -11.99718833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 24.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 712,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 6387,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"CAPRICORNIO_5 @@@@@@\",\r\n    \"shiptypeDesc\": \"Other Type, no additional information\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 5.0000,\r\n    \"to_stern\": 45.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 3.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.6000,\r\n    \"lon\": -77.14317000000000,\r\n    \"lat\": -11.99723666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 238.3000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 128,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636016417,\r\n    \"imo\": 9210062,\r\n    \"callsign\": \"D5GC3  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CAROLINA STAR       \",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category D\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 189.0000,\r\n    \"to_stern\": 54.0000,\r\n    \"to_port\": 20.0000,\r\n    \"to_starboard\": 12.0000,\r\n    \"destination\": \"PAITA    H@@@@@@@@@@\",\r\n    \"speed\": 13.0000,\r\n    \"lon\": -77.28453666666700,\r\n    \"lat\": -11.97737333333300,\r\n    \"draught\": 8.1000,\r\n    \"turn\": 0,\r\n    \"course\": 308.0000,\r\n    \"heading\": 305,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 267,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412329463,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CHANGSHUN 7\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 5.9000,\r\n    \"lon\": -77.21903666666700,\r\n    \"lat\": -12.02526000000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 250.3000,\r\n    \"heading\": 254,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 725,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412354056,\r\n    \"imo\": 0,\r\n    \"callsign\": \"#CZBBBB\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CHANGTAI806         \",\r\n    \"shiptypeDesc\": \"Reserved for future use\",\r\n    \"shiptypeColor\": \"#F5F6CE\",\r\n    \"to_bow\": 16.0000,\r\n    \"to_stern\": 130.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.1000,\r\n    \"lon\": -77.21018000000000,\r\n    \"lat\": -12.01989000000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 272.2000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 322,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 431682000,\r\n    \"imo\": 9109330,\r\n    \"callsign\": \"JINE\",\r\n    \"NavigationStatus\": \"Engaged in Fishing\",\r\n    \"NavigationStatusShape\": \"diamond\",\r\n    \"shipname\": \"CHOKYU MARU 11\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 30.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14096666666700,\r\n    \"lat\": -12.03912166666700,\r\n    \"draught\": 4.5000,\r\n    \"turn\": -128,\r\n    \"course\": 106.9000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 318,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 432374000,\r\n    \"imo\": 9279472,\r\n    \"callsign\": \"JIHM\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"CHOKYUMARUNO12\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 26.0000,\r\n    \"to_stern\": 26.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 2.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 4.6000,\r\n    \"lon\": -77.21533500000000,\r\n    \"lat\": -12.03811333333300,\r\n    \"draught\": 4.0000,\r\n    \"turn\": 0,\r\n    \"course\": 264.7000,\r\n    \"heading\": 263,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 239,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 371021000,\r\n    \"imo\": 0,\r\n    \"callsign\": \"H%L@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CLARA MARIS@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Reserved for future use\",\r\n    \"shiptypeColor\": \"#F5F6CE\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 5.0000,\r\n    \"lon\": -77.16700000000000,\r\n    \"lat\": -12.05835833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 284.8000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 700,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636012164,\r\n    \"imo\": 9280366,\r\n    \"callsign\": \"A8DU7\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CONFIDENCE\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 193.0000,\r\n    \"to_stern\": 36.0000,\r\n    \"to_port\": 22.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"LA PAMPILC@@@@@@@@@@\",\r\n    \"speed\": 12.8000,\r\n    \"lon\": -77.26796500000000,\r\n    \"lat\": -11.91708166666700,\r\n    \"draught\": 7.5000,\r\n    \"turn\": 0,\r\n    \"course\": 267.0000,\r\n    \"heading\": 269,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 148,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636015991,\r\n    \"imo\": 9325178,\r\n    \"callsign\": \"D5DX2  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"CSAV RIO AYSEN      \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 19.0000,\r\n    \"to_stern\": 164.0000,\r\n    \"to_port\": 15.0000,\r\n    \"to_starboard\": 17.0000,\r\n    \"destination\": \"IQUIQUE  H@@@@@@@@@@\",\r\n    \"speed\": 15.1000,\r\n    \"lon\": -77.24468166666700,\r\n    \"lat\": -12.27581500000000,\r\n    \"draught\": 8.4000,\r\n    \"turn\": 0,\r\n    \"course\": 165.0000,\r\n    \"heading\": 168,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 268,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000400,\r\n    \"imo\": 9763928,\r\n    \"callsign\": \"OA2150\",\r\n    \"NavigationStatus\": \"Under way sailing\",\r\n    \"NavigationStatusShape\": \"triangle\",\r\n    \"shipname\": \"DON OLE\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 41.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"EUREKA   H@@@@@@@@@@\",\r\n    \"speed\": 11.5000,\r\n    \"lon\": -77.33011500000000,\r\n    \"lat\": -12.19584833333300,\r\n    \"draught\": 6.0000,\r\n    \"turn\": 0,\r\n    \"course\": 166.1000,\r\n    \"heading\": 164,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 133,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 218023000,\r\n    \"imo\": 9232577,\r\n    \"callsign\": \"DDSB2@@\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"DUBLIN EXPRESS@@@@@@\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 230.0000,\r\n    \"to_stern\": 51.0000,\r\n    \"to_port\": 19.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14795833333300,\r\n    \"lat\": -12.05449000000000,\r\n    \"draught\": 11.9000,\r\n    \"turn\": 0,\r\n    \"course\": 0.0000,\r\n    \"heading\": 310,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 244,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 354441000,\r\n    \"imo\": 9443865,\r\n    \"callsign\": \"3EPV7@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"EAGLE MIRI@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 147.0000,\r\n    \"to_stern\": 36.0000,\r\n    \"to_port\": 14.0000,\r\n    \"to_starboard\": 18.0000,\r\n    \"destination\": \"CALLAO,PED@@@@@@@@@@\",\r\n    \"speed\": 10.6000,\r\n    \"lon\": -77.39608166666700,\r\n    \"lat\": -11.95510500000000,\r\n    \"draught\": 11.4000,\r\n    \"turn\": -128,\r\n    \"course\": 282.3000,\r\n    \"heading\": 285,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 273,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224591000,\r\n    \"imo\": 9339208,\r\n    \"callsign\": \"ECBO@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ECCE HOMO GLORIOSO @\",\r\n    \"shiptypeDesc\": \"unknown\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 23.0000,\r\n    \"to_stern\": 23.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 10.2000,\r\n    \"lon\": -77.47204000000000,\r\n    \"lat\": -12.17573166666700,\r\n    \"draught\": 0.4800,\r\n    \"turn\": 0,\r\n    \"course\": 233.6000,\r\n    \"heading\": 232,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 134,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 357513000,\r\n    \"imo\": 9454058,\r\n    \"callsign\": \"HP5457\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"ELITE FAITH\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 108.0000,\r\n    \"to_stern\": 14.0000,\r\n    \"to_port\": 11.0000,\r\n    \"to_starboard\": 9.0000,\r\n    \"destination\": \"MATARANI;D@@@@@@@@@@\",\r\n    \"speed\": 12.2000,\r\n    \"lon\": -77.25036333333300,\r\n    \"lat\": -12.20781833333300,\r\n    \"draught\": 7.0000,\r\n    \"turn\": 0,\r\n    \"course\": 158.0000,\r\n    \"heading\": 156,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 293,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636014956,\r\n    \"imo\": 9338967,\r\n    \"callsign\": \"A8XP7\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"EM HYDRA\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 158.0000,\r\n    \"to_stern\": 17.0000,\r\n    \"to_port\": 14.0000,\r\n    \"to_starboard\": 14.0000,\r\n    \"destination\": \"PAITA    H@@@@@@@@@@\",\r\n    \"speed\": 16.3000,\r\n    \"lon\": -77.32051833333300,\r\n    \"lat\": -11.95533666666700,\r\n    \"draught\": 9.1000,\r\n    \"turn\": 0,\r\n    \"course\": 306.8000,\r\n    \"heading\": 305,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 289,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 351041000,\r\n    \"imo\": 9116618,\r\n    \"callsign\": \"3FFG7\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"EVER UNION\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category D\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 210.0000,\r\n    \"to_stern\": 75.0000,\r\n    \"to_port\": 12.0000,\r\n    \"to_starboard\": 28.0000,\r\n    \"destination\": \"MANZANILLC@@@@@@@@@@\",\r\n    \"speed\": 19.5000,\r\n    \"lon\": -77.48599833333300,\r\n    \"lat\": -11.85733166666700,\r\n    \"draught\": 12.1000,\r\n    \"turn\": 0,\r\n    \"course\": 296.0000,\r\n    \"heading\": 296,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 123,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 236111804,\r\n    \"imo\": 9299032,\r\n    \"callsign\": \"ZDKT6@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"FRISIA ROTTERDAM@@@@\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 17.0000,\r\n    \"to_stern\": 191.0000,\r\n    \"to_port\": 15.0000,\r\n    \"to_starboard\": 15.0000,\r\n    \"destination\": \"BALBOA@@@@@@@@@@@@@@\",\r\n    \"speed\": 13.7000,\r\n    \"lon\": -77.35519166666700,\r\n    \"lat\": -11.93199666666700,\r\n    \"draught\": 8.7000,\r\n    \"turn\": 0,\r\n    \"course\": 292.8000,\r\n    \"heading\": 292,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 201,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420229,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G @@@@@@HHHHHHHA@DQA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 32.0000,\r\n    \"to_stern\": 17.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.6000,\r\n    \"lon\": -77.20435000000000,\r\n    \"lat\": -12.03368666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 277.2000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 471,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412328789,\r\n    \"imo\": 0,\r\n    \"callsign\": \"BBFK3\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G SP8HHH@ !\\\\\\\"\u003c8H@8EA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 28.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.8000,\r\n    \"lon\": -77.20511833333300,\r\n    \"lat\": -12.03256500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 261.6000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 617,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420877,\r\n    \"imo\": 0,\r\n    \"callsign\": \"BZU6C  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G SP8HHH@\u0026%] 8H@^H! \",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 15.0000,\r\n    \"to_stern\": 34.0000,\r\n    \"to_port\": 6.0000,\r\n    \"to_starboard\": 2.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.5000,\r\n    \"lon\": -77.21154500000000,\r\n    \"lat\": -12.03261166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 247.2000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 285,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420453,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G SP8HHH@@@@@@@@\u003cE 1\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 22.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"H@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.16714500000000,\r\n    \"lat\": -12.02577166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 166.1000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 474,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412354057,\r\n    \"imo\": 0,\r\n    \"callsign\": \"0      \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G SP8HHHLHHHHHH@^IQA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 15.0000,\r\n    \"to_stern\": 37.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.17145166666700,\r\n    \"lat\": -12.02082333333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 337.2000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 324,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420981,\r\n    \"imo\": 0,\r\n    \"callsign\": \"BZV9W\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G!%K\\\\]LNP\u0026%.U8H@6G!A\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 27.0000,\r\n    \"to_stern\": 30.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.9000,\r\n    \"lon\": -77.18031000000000,\r\n    \"lat\": -12.02660500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 275.2000,\r\n    \"heading\": 275,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 447,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420804,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G!%K\\\\]\\\\L8HHHHHH@\u003cC1A\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 15.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 7.3000,\r\n    \"lon\": -77.20257833333300,\r\n    \"lat\": -12.02833333333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 263.6000,\r\n    \"heading\": 263,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 320,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412222222,\r\n    \"imo\": 0,\r\n    \"callsign\": \"       \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G!%K]LNXHHHHHH@\u003cFQQ\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 25.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 5.9000,\r\n    \"lon\": -77.15830666666700,\r\n    \"lat\": -12.01500333333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 20.5000,\r\n    \"heading\": 20,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 280,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412424547,\r\n    \"imo\": 0,\r\n    \"callsign\": \"0@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G#\u0027?60UB\\\\@@@@@@A$DAA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 50.0000,\r\n    \"to_stern\": 16.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 2.9000,\r\n    \"lon\": -77.17046000000000,\r\n    \"lat\": -12.02280166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 279.7000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 443,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420409,\r\n    \"imo\": 0,\r\n    \"callsign\": \"BZUG8@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G#L4P\u0027T$P\u0026%Q\u003e@@@\\\\G!A\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 14.0000,\r\n    \"to_stern\": 30.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 5.1000,\r\n    \"lon\": -77.20233333333300,\r\n    \"lat\": -12.03330333333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 250.6000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 402,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420503,\r\n    \"imo\": 0,\r\n    \"callsign\": \"0@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G#T9@7PP\\\\@@@@@@ABEAP\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 33.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 3.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 8.5000,\r\n    \"lon\": -77.20769833333300,\r\n    \"lat\": -12.02603666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 264.7000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 537,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 431700090,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G$3UAL%8(HHHHHH@\u003cFP1\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 25.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14099500000000,\r\n    \"lat\": -12.04009166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 30.3000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 303,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420623,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G(HHHHHHHHHHHHH@2G@1\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 25.0000,\r\n    \"to_stern\": 28.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 102.3000,\r\n    \"lon\": -77.16968833333300,\r\n    \"lat\": -12.02445166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 360.0000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 555,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420228,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G(HHHHHHHHHHHHH@\u003cC1A\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 15.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 2.6000,\r\n    \"lon\": -17.29568500000000,\r\n    \"lat\": -98.49961500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 31.9000,\r\n    \"heading\": 451,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 473,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420231,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G(HHHHHHHHHHHHH@\u003cD1A\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 19.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 7.6000,\r\n    \"lon\": -77.20439833333300,\r\n    \"lat\": -12.03335833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 273.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 459,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420427,\r\n    \"imo\": 0,\r\n    \"callsign\": \"\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G(HHHHHHHHHHHHH@\u003cLAA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 30.0000,\r\n    \"to_stern\": 48.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 4.4000,\r\n    \"lon\": -77.19778500000000,\r\n    \"lat\": -12.03534333333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 248.3000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 496,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 374295000,\r\n    \"imo\": 9056296,\r\n    \"callsign\": \"3FMX7\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"GEMINI LEADER\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 24.0000,\r\n    \"to_stern\": 156.0000,\r\n    \"to_port\": 17.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"CL IQQ   H@@@@@@@@@@\",\r\n    \"speed\": 17.0000,\r\n    \"lon\": -77.29813500000000,\r\n    \"lat\": -12.23041833333300,\r\n    \"draught\": 8.5000,\r\n    \"turn\": 0,\r\n    \"course\": 159.4000,\r\n    \"heading\": 161,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 235,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 304297000,\r\n    \"imo\": 9230787,\r\n    \"callsign\": \"V2OG4\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"GLORIA\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 166.0000,\r\n    \"to_stern\": 19.0000,\r\n    \"to_port\": 13.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CARTAGENAH@@@@@@@@@@\",\r\n    \"speed\": 14.1000,\r\n    \"lon\": -77.27133166666700,\r\n    \"lat\": -11.99799833333300,\r\n    \"draught\": 9.9000,\r\n    \"turn\": 0,\r\n    \"course\": 310.0000,\r\n    \"heading\": 312,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 277,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636015657,\r\n    \"imo\": 9604914,\r\n    \"callsign\": \"D5CB7  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"GRACIOUS ACE        \",\r\n    \"shiptypeDesc\": \"Cargo, No additional information\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 19.0000,\r\n    \"to_stern\": 180.0000,\r\n    \"to_port\": 21.0000,\r\n    \"to_starboard\": 11.0000,\r\n    \"destination\": \"PE CCL   H@@@@@@@@@@\",\r\n    \"speed\": 16.8000,\r\n    \"lon\": -77.35551333333300,\r\n    \"lat\": -11.92686500000000,\r\n    \"draught\": 0.8600,\r\n    \"turn\": -248,\r\n    \"course\": 304.4000,\r\n    \"heading\": 304,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 143,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 431100690,\r\n    \"imo\": 0,\r\n    \"callsign\": \"JRWC\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"G\\\\\\\"P31]XV2$%08HH@6FA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 27.0000,\r\n    \"to_stern\": 24.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 2.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 9.4000,\r\n    \"lon\": -77.20475500000000,\r\n    \"lat\": -12.03260500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 260.3000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 701,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420452,\r\n    \"imo\": 0,\r\n    \"callsign\": \"CGD@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"H0NG RUN 11@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Military ops\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 7.2000,\r\n    \"lon\": -77.19307666666700,\r\n    \"lat\": -12.03228666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 270.1000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 479,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 518100126,\r\n    \"imo\": 8905397,\r\n    \"callsign\": \"E5U3071\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"HAI SOON 28\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 76.0000,\r\n    \"to_stern\": 29.0000,\r\n    \"to_port\": 8.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"CALLAO PED@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14335500000000,\r\n    \"lat\": -12.04009333333300,\r\n    \"draught\": 3.9000,\r\n    \"turn\": -128,\r\n    \"course\": 268.4000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 172,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 211627970,\r\n    \"imo\": 9459412,\r\n    \"callsign\": \"DISM2\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"HANSA EUROPE\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 185.0000,\r\n    \"to_stern\": 55.0000,\r\n    \"to_port\": 21.0000,\r\n    \"to_starboard\": 11.0000,\r\n    \"destination\": \"PECLL    H@@@@@@@@@@\",\r\n    \"speed\": 12.3000,\r\n    \"lon\": -77.38669166666700,\r\n    \"lat\": -11.90708333333300,\r\n    \"draught\": 8.3000,\r\n    \"turn\": 19,\r\n    \"course\": 295.0000,\r\n    \"heading\": 294,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 710,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420242,\r\n    \"imo\": 0,\r\n    \"callsign\": \"CK[FBBB\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"HUA YING 261\",\r\n    \"shiptypeDesc\": \"Dredging or underwater ops\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 16.0000,\r\n    \"to_stern\": 130.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.2000,\r\n    \"lon\": -77.17595833333300,\r\n    \"lat\": -12.02922833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 321.1000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 494,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760106000,\r\n    \"imo\": 6708692,\r\n    \"callsign\": \"OASC@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"HUMBOLDT@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Reserved for future use\",\r\n    \"shiptypeColor\": \"#F5F6CE\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"DEMERSAL C@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.15990500000000,\r\n    \"lat\": -12.05949333333300,\r\n    \"draught\": 4.5000,\r\n    \"turn\": -128,\r\n    \"course\": 241.6000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 122,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636011980,\r\n    \"imo\": 8608169,\r\n    \"callsign\": \"A8CT4@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"HYUNDAI NO.107@@@@@@\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 25.0000,\r\n    \"to_stern\": 159.0000,\r\n    \"to_port\": 18.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CL IQQ@@@@@@@@@@@@@@\",\r\n    \"speed\": 15.7000,\r\n    \"lon\": -77.29595333333300,\r\n    \"lat\": -12.05903666666700,\r\n    \"draught\": 7.7000,\r\n    \"turn\": -128,\r\n    \"course\": 235.6000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 718,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 373521000,\r\n    \"imo\": 0,\r\n    \"callsign\": \"HP5657@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ID4%A3@6RDM]-]0@\\\\@1Q\",\r\n    \"shiptypeDesc\": \"Sailing\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 14.0000,\r\n    \"to_stern\": 3.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.5000,\r\n    \"lon\": -77.16504666666700,\r\n    \"lat\": -12.06156166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 119.1000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 281,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 477115800,\r\n    \"imo\": 9464546,\r\n    \"callsign\": \"VREJ8  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"IDSHIP BULKER       \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 148.0000,\r\n    \"to_stern\": 21.0000,\r\n    \"to_port\": 18.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"NIIHAMA,J@@@@@@@@@@@\",\r\n    \"speed\": 12.3000,\r\n    \"lon\": -77.27559833333300,\r\n    \"lat\": -11.97376500000000,\r\n    \"draught\": 9.9000,\r\n    \"turn\": 0,\r\n    \"course\": 314.0000,\r\n    \"heading\": 317,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 294,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 338109083,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"IE1T5CPT @@@@@@@RA\",\r\n    \"shiptypeDesc\": \"Sailing\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 9.0000,\r\n    \"to_stern\": 6.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 2.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.5000,\r\n    \"lon\": -77.15030500000000,\r\n    \"lat\": -12.10907833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 128.9000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 486,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 645232000,\r\n    \"imo\": 0,\r\n    \"callsign\": \"3BOH\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"IL PRINCIPE\",\r\n    \"shiptypeDesc\": \"Other Type, all ships of this type\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 12.0000,\r\n    \"to_stern\": 48.0000,\r\n    \"to_port\": 6.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14111166666700,\r\n    \"lat\": -12.04208500000000,\r\n    \"draught\": 3.2000,\r\n    \"turn\": 0,\r\n    \"course\": 0.0000,\r\n    \"heading\": 62,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 176,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 353615000,\r\n    \"imo\": 0,\r\n    \"callsign\": \"HO4626@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"IS% 1\u0026AD2C=M,- @LB@\",\r\n    \"shiptypeDesc\": \"Pleasure Craft\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 6.0000,\r\n    \"to_stern\": 8.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 2.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.3000,\r\n    \"lon\": -77.16207000000000,\r\n    \"lat\": -12.06781666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 120.9000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 437,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 247253800,\r\n    \"imo\": 9396749,\r\n    \"callsign\": \"ICLT   \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ISOLA BLU           \",\r\n    \"shiptypeDesc\": \"Tanker, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 149.0000,\r\n    \"to_stern\": 34.0000,\r\n    \"to_port\": 8.0000,\r\n    \"to_starboard\": 24.0000,\r\n    \"destination\": \"CALLAO              \",\r\n    \"speed\": 12.5000,\r\n    \"lon\": -77.35535333333300,\r\n    \"lat\": -11.89499333333300,\r\n    \"draught\": 7.3000,\r\n    \"turn\": 0,\r\n    \"course\": 317.6000,\r\n    \"heading\": 318,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 299,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 566772000,\r\n    \"imo\": 9636383,\r\n    \"callsign\": \"9V7605 \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ISS BREEZE          \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 153.0000,\r\n    \"to_stern\": 25.0000,\r\n    \"to_port\": 21.0000,\r\n    \"to_starboard\": 8.0000,\r\n    \"destination\": \"RIO DE JAC@@@@@@@@@@\",\r\n    \"speed\": 12.3000,\r\n    \"lon\": -77.29150833333300,\r\n    \"lat\": -12.29916166666700,\r\n    \"draught\": 10.1000,\r\n    \"turn\": 0,\r\n    \"course\": 176.8000,\r\n    \"heading\": 179,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 132,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420959,\r\n    \"imo\": 0,\r\n    \"callsign\": \"_GT@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"JIN HAI 715@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"High speed craft (HSC), all ships of this type\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.5000,\r\n    \"lon\": -77.20859000000000,\r\n    \"lat\": -12.03834833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 261.1000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 495,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412421357,\r\n    \"imo\": 0,\r\n    \"callsign\": \"#[X@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"JIN HAI 866@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"High speed craft (HSC), all ships of this type\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 5.5000,\r\n    \"lon\": -77.20828333333300,\r\n    \"lat\": -12.03147833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 262.7000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 476,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 372089000,\r\n    \"imo\": 8513560,\r\n    \"callsign\": \"3FSN3  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"JK TAI SHAN         \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 40.0000,\r\n    \"to_stern\": 150.0000,\r\n    \"to_port\": 17.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"PE CLL   H@@@@@@@@@@\",\r\n    \"speed\": 14.6000,\r\n    \"lon\": -77.28946500000000,\r\n    \"lat\": -11.96390666666700,\r\n    \"draught\": 8.7000,\r\n    \"turn\": 0,\r\n    \"course\": 321.1000,\r\n    \"heading\": 321,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 158,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760018812,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"KIANA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 9.0000,\r\n    \"lon\": -17.29205833333300,\r\n    \"lat\": -99.63128166666700,\r\n    \"draught\": 4.0000,\r\n    \"turn\": 0,\r\n    \"course\": 21.9000,\r\n    \"heading\": 175,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 136,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 431704230,\r\n    \"imo\": 9011442,\r\n    \"callsign\": \"JJYR\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"KOKEI MARU NO.8\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 21.0000,\r\n    \"to_stern\": 22.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14215333333300,\r\n    \"lat\": -12.04240833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 223.2000,\r\n    \"heading\": 511,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 703,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 356875000,\r\n    \"imo\": 9650133,\r\n    \"callsign\": \"3FAA9  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"KOUYOU              \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 169.0000,\r\n    \"to_stern\": 28.0000,\r\n    \"to_port\": 14.0000,\r\n    \"to_starboard\": 19.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 9.7000,\r\n    \"lon\": -77.26210166666700,\r\n    \"lat\": -11.99400666666700,\r\n    \"draught\": 10.7000,\r\n    \"turn\": 0,\r\n    \"course\": 305.9000,\r\n    \"heading\": 303,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 317,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000008,\r\n    \"imo\": 0,\r\n    \"callsign\": \"HD:BBBB\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"M HUASCARAN        @\",\r\n    \"shiptypeDesc\": \"Anti-pollution equipment\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 16.0000,\r\n    \"to_stern\": 130.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 12.2000,\r\n    \"lon\": -15.88256500000000,\r\n    \"lat\": -99.49758500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 70.3000,\r\n    \"heading\": 485,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 259,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000500,\r\n    \"imo\": 9171321,\r\n    \"callsign\": \"OA-2004\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"M/T CAMISEA @@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 154.0000,\r\n    \"to_stern\": 29.0000,\r\n    \"to_port\": 19.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.18282333333300,\r\n    \"lat\": -11.98619333333300,\r\n    \"draught\": 8.8000,\r\n    \"turn\": 0,\r\n    \"course\": 110.8000,\r\n    \"heading\": 272,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 174,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 645159000,\r\n    \"imo\": 7931002,\r\n    \"callsign\": \"3BLH\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"MAGELLANO 1800\",\r\n    \"shiptypeDesc\": \"Other Type, all ships of this type\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 68.0000,\r\n    \"to_stern\": 12.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.2000,\r\n    \"lon\": -77.14288166666700,\r\n    \"lat\": -12.04368166666700,\r\n    \"draught\": 2.6000,\r\n    \"turn\": -128,\r\n    \"course\": 207.9000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 153,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224987000,\r\n    \"imo\": 9249946,\r\n    \"callsign\": \"ECBL@@@\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"MAICOA TRES @@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"CALLA0   H@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.17137000000000,\r\n    \"lat\": -12.02660000000000,\r\n    \"draught\": 5.0000,\r\n    \"turn\": -128,\r\n    \"course\": 170.0000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 144,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760015724,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Engaged in Fishing\",\r\n    \"NavigationStatusShape\": \"diamond\",\r\n    \"shipname\": \"MALENA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 12.9000,\r\n    \"lon\": -77.26436166666700,\r\n    \"lat\": -11.88783166666700,\r\n    \"draught\": 6.0000,\r\n    \"turn\": 0,\r\n    \"course\": 336.4000,\r\n    \"heading\": 340,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 142,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001030,\r\n    \"imo\": 9369875,\r\n    \"callsign\": \"OA-2241\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"MANTARO\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 150.0000,\r\n    \"to_stern\": 33.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 23.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.2000,\r\n    \"lon\": -77.20867833333300,\r\n    \"lat\": -11.98777500000000,\r\n    \"draught\": 8.1000,\r\n    \"turn\": 0,\r\n    \"course\": 296.7000,\r\n    \"heading\": 251,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 287,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001280,\r\n    \"imo\": 9102203,\r\n    \"callsign\": \"OA2220\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"MAR PACIFICO\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 244.0000,\r\n    \"to_stern\": 35.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 17.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.15094333333300,\r\n    \"lat\": -12.04301166666700,\r\n    \"draught\": 10.3000,\r\n    \"turn\": 0,\r\n    \"course\": 147.6000,\r\n    \"heading\": 189,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 248,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000690,\r\n    \"imo\": 9662277,\r\n    \"callsign\": \"OA-2222\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MARCAHUASI\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 10.0000,\r\n    \"to_stern\": 17.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"CALLAO  PERU\",\r\n    \"speed\": 6.7000,\r\n    \"lon\": -77.14670000000000,\r\n    \"lat\": -12.05066333333300,\r\n    \"draught\": 3.6000,\r\n    \"turn\": 127,\r\n    \"course\": 298.5000,\r\n    \"heading\": 321,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 135,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": 1\r\n  },\r\n  {\r\n    \"mmsi\": 760001090,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OA2348\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MARIA JOSE@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Other Type, no additional information\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 4.7000,\r\n    \"lon\": -77.29628500000000,\r\n    \"lat\": -12.17272500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 173.5000,\r\n    \"heading\": 174,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 300,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760015652,\r\n    \"imo\": 0,\r\n    \"callsign\": \"CO15652\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"MARIA PIA\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"CHIMBOTE H@@@@@@@@@@\",\r\n    \"speed\": 13.3000,\r\n    \"lon\": -77.32968000000000,\r\n    \"lat\": -12.16791666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 147.8000,\r\n    \"heading\": 145,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 212,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 249060000,\r\n    \"imo\": 9396622,\r\n    \"callsign\": \"9HA4072\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MAX WONDER\",\r\n    \"shiptypeDesc\": \"Other Type, all ships of this type\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 144.0000,\r\n    \"to_stern\": 18.0000,\r\n    \"to_port\": 12.0000,\r\n    \"to_starboard\": 12.0000,\r\n    \"destination\": \"IQUIQUE  H@@@@@@@@@@\",\r\n    \"speed\": 17.0000,\r\n    \"lon\": -77.25628833333300,\r\n    \"lat\": -12.21458166666700,\r\n    \"draught\": 8.8000,\r\n    \"turn\": 0,\r\n    \"course\": 164.4000,\r\n    \"heading\": 163,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 321,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 351137000,\r\n    \"imo\": 9338723,\r\n    \"callsign\": \"3EPF3\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MORNING CAROLINE\",\r\n    \"shiptypeDesc\": \"Cargo, No additional information\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 25.0000,\r\n    \"to_stern\": 174.0000,\r\n    \"to_port\": 22.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"PE CLL   H@@@@@@@@@@\",\r\n    \"speed\": 10.9000,\r\n    \"lon\": -77.29209833333300,\r\n    \"lat\": -12.25976500000000,\r\n    \"draught\": 8.6000,\r\n    \"turn\": 0,\r\n    \"course\": 168.0000,\r\n    \"heading\": 164,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 720,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 477050500,\r\n    \"imo\": 9605243,\r\n    \"callsign\": \"VRMO7\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MSC ALGECIRAS\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category D\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 110.0000,\r\n    \"to_stern\": 190.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 32.0000,\r\n    \"destination\": \"MX LZC   H@@@@@@@@@@\",\r\n    \"speed\": 19.6000,\r\n    \"lon\": -77.36560666666700,\r\n    \"lat\": -11.90954500000000,\r\n    \"draught\": 12.2000,\r\n    \"turn\": 0,\r\n    \"course\": 323.6000,\r\n    \"heading\": 325,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 274,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 255805864,\r\n    \"imo\": 9710438,\r\n    \"callsign\": \"CQZK   \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MSC CHANNE          \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 226.0000,\r\n    \"to_stern\": 73.0000,\r\n    \"to_port\": 30.0000,\r\n    \"to_starboard\": 18.0000,\r\n    \"destination\": \"LAZARO CAD@@@@@@@@@@\",\r\n    \"speed\": 19.6000,\r\n    \"lon\": -77.31655666666700,\r\n    \"lat\": -11.94740666666700,\r\n    \"draught\": 13.8000,\r\n    \"turn\": 0,\r\n    \"course\": 311.3000,\r\n    \"heading\": 312,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 124,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 357723000,\r\n    \"imo\": 8618310,\r\n    \"callsign\": \"3EXH3  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MSC LEANNE          \",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 197.0000,\r\n    \"to_stern\": 97.0000,\r\n    \"to_port\": 22.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"ALBOA    H@@@@@@@@@@\",\r\n    \"speed\": 20.3000,\r\n    \"lon\": -77.37997500000000,\r\n    \"lat\": -11.90963666666700,\r\n    \"draught\": 12.0000,\r\n    \"turn\": 0,\r\n    \"course\": 306.3000,\r\n    \"heading\": 309,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 296,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 372123000,\r\n    \"imo\": 9320439,\r\n    \"callsign\": \"3EGN4\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MSC LEIGH\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 20.0000,\r\n    \"to_stern\": 255.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"BALBOA   H@@@@@@@@@@\",\r\n    \"speed\": 14.4000,\r\n    \"lon\": -77.32375166666700,\r\n    \"lat\": -11.94317333333300,\r\n    \"draught\": 11.8000,\r\n    \"turn\": 0,\r\n    \"course\": 310.2000,\r\n    \"heading\": 310,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 272,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 355919000,\r\n    \"imo\": 9304423,\r\n    \"callsign\": \"3EGR2\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MSC MARIA ELENA\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 261.0000,\r\n    \"to_stern\": 76.0000,\r\n    \"to_port\": 14.0000,\r\n    \"to_starboard\": 32.0000,\r\n    \"destination\": \"SAN ANTONB@@@@@@@@@@\",\r\n    \"speed\": 19.2000,\r\n    \"lon\": -77.26202833333300,\r\n    \"lat\": -12.24127666666700,\r\n    \"draught\": 10.5000,\r\n    \"turn\": 0,\r\n    \"course\": 168.0000,\r\n    \"heading\": 166,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 717,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 371853000,\r\n    \"imo\": 8715871,\r\n    \"callsign\": \"H3XG\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"MSC PILAR\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 194.0000,\r\n    \"to_stern\": 100.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 23.0000,\r\n    \"destination\": \"ARICA    H@@@@@@@@@@\",\r\n    \"speed\": 0.3000,\r\n    \"lon\": -77.14842833333300,\r\n    \"lat\": -12.05372000000000,\r\n    \"draught\": 11.8000,\r\n    \"turn\": 0,\r\n    \"course\": 7.3000,\r\n    \"heading\": 142,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 311,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 372737000,\r\n    \"imo\": 9320453,\r\n    \"callsign\": \"3EKJ4@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MSC ROSARIA@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Cargo, No additional information\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 220.0000,\r\n    \"to_stern\": 55.0000,\r\n    \"to_port\": 17.0000,\r\n    \"to_starboard\": 15.0000,\r\n    \"destination\": \"BALBOA@@@@@@@@@@@@@@\",\r\n    \"speed\": 14.7000,\r\n    \"lon\": -77.39029666666700,\r\n    \"lat\": -11.89287833333300,\r\n    \"draught\": 11.8000,\r\n    \"turn\": 0,\r\n    \"course\": 309.2000,\r\n    \"heading\": 310,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 715,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538006488,\r\n    \"imo\": 9718741,\r\n    \"callsign\": \"V7NQ7  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"MUSCAT SILVER       \",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 147.0000,\r\n    \"to_stern\": 36.0000,\r\n    \"to_port\": 25.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"CONCHAN  H@@@@@@@@@@\",\r\n    \"speed\": 11.8000,\r\n    \"lon\": -77.02090000000000,\r\n    \"lat\": -12.43353500000000,\r\n    \"draught\": 1.1200,\r\n    \"turn\": 1,\r\n    \"course\": 206.3000,\r\n    \"heading\": 206,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 167,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538005208,\r\n    \"imo\": 9434747,\r\n    \"callsign\": \"V7BW2  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NAESS RESOLUTE      \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 170.0000,\r\n    \"to_stern\": 18.0000,\r\n    \"to_port\": 8.0000,\r\n    \"to_starboard\": 24.0000,\r\n    \"destination\": \"QINHUANGD@@@@@@@@@@@\",\r\n    \"speed\": 12.1000,\r\n    \"lon\": -77.35128500000000,\r\n    \"lat\": -11.95024833333300,\r\n    \"draught\": 13.2000,\r\n    \"turn\": 0,\r\n    \"course\": 285.6000,\r\n    \"heading\": 288,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 278,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420955,\r\n    \"imo\": 0,\r\n    \"callsign\": \"C[X@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NING TAI 66@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Spare - Local Vessel\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 8.0000,\r\n    \"lon\": -77.24183000000000,\r\n    \"lat\": -12.03960166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 239.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 460,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 440995000,\r\n    \"imo\": 9042051,\r\n    \"callsign\": \"6LRR@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NO 707 AMOR@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 28.0000,\r\n    \"to_stern\": 30.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"CALLAO.PED@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.17158833333300,\r\n    \"lat\": -12.02655500000000,\r\n    \"draught\": 5.0000,\r\n    \"turn\": -128,\r\n    \"course\": 38.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 724,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 441767000,\r\n    \"imo\": 8708141,\r\n    \"callsign\": \"DTBY7@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NO.705 AMOR@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 35.0000,\r\n    \"to_stern\": 28.0000,\r\n    \"to_port\": 6.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.17184000000000,\r\n    \"lat\": -12.02670833333300,\r\n    \"draught\": 6.9000,\r\n    \"turn\": -128,\r\n    \"course\": 122.9000,\r\n    \"heading\": 511,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 723,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 235080999,\r\n    \"imo\": 9463554,\r\n    \"callsign\": \"2DPQ2  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NOMADIC MILDE       \",\r\n    \"shiptypeDesc\": \"Cargo, No additional information\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 102.0000,\r\n    \"to_stern\": 36.0000,\r\n    \"to_port\": 14.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 12.4000,\r\n    \"lon\": -77.45304000000000,\r\n    \"lat\": -12.17689833333300,\r\n    \"draught\": 5.6000,\r\n    \"turn\": 16,\r\n    \"course\": 166.0000,\r\n    \"heading\": 165,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 151,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538005929,\r\n    \"imo\": 9565340,\r\n    \"callsign\": \"V7IE7\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NORDIC STRALSUND\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 188.0000,\r\n    \"to_stern\": 40.0000,\r\n    \"to_port\": 11.0000,\r\n    \"to_starboard\": 19.0000,\r\n    \"destination\": \"CALLAO/PEH@@@@@@@@@@\",\r\n    \"speed\": 14.7000,\r\n    \"lon\": -77.36094166666700,\r\n    \"lat\": -11.91543000000000,\r\n    \"draught\": 11.2000,\r\n    \"turn\": 0,\r\n    \"course\": 309.7000,\r\n    \"heading\": 308,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 713,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224156000,\r\n    \"imo\": 9148685,\r\n    \"callsign\": \"EANM\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NOVO XEIXAL\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 18.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"VACAMONTEK@@@@@@@@@@\",\r\n    \"speed\": 8.7000,\r\n    \"lon\": -77.28037500000000,\r\n    \"lat\": -12.04595833333300,\r\n    \"draught\": 4.0000,\r\n    \"turn\": 0,\r\n    \"course\": 250.5000,\r\n    \"heading\": 252,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 269,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636012465,\r\n    \"imo\": 9309588,\r\n    \"callsign\": \"A8FP2  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"NS STELLA           \",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 153.0000,\r\n    \"to_stern\": 30.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"CONCHAN  H@@@@@@@@@@\",\r\n    \"speed\": 13.6000,\r\n    \"lon\": -77.35463333333300,\r\n    \"lat\": -12.13681833333300,\r\n    \"draught\": 8.1000,\r\n    \"turn\": 11,\r\n    \"course\": 318.0000,\r\n    \"heading\": 319,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 302,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224017000,\r\n    \"imo\": 9221451,\r\n    \"callsign\": \"EAOS   \",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"NUEVO JOSMARU       \",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 20.0000,\r\n    \"to_stern\": 23.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"CALLAO _ H@@@@@@@@@@\",\r\n    \"speed\": 6.2000,\r\n    \"lon\": -77.16381333333300,\r\n    \"lat\": -12.04595333333300,\r\n    \"draught\": 4.0000,\r\n    \"turn\": 0,\r\n    \"course\": 273.1000,\r\n    \"heading\": 268,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 251,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 477535900,\r\n    \"imo\": 9597587,\r\n    \"callsign\": \"VRJJ7  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"OCTBREEZE ISLAND    \",\r\n    \"shiptypeDesc\": \"Cargo, No additional information\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 154.0000,\r\n    \"to_stern\": 26.0000,\r\n    \"to_port\": 14.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 14.9000,\r\n    \"lon\": -77.17772166666700,\r\n    \"lat\": -12.30827166666700,\r\n    \"draught\": 10.4000,\r\n    \"turn\": 0,\r\n    \"course\": 137.6000,\r\n    \"heading\": 135,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 315,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538002284,\r\n    \"imo\": 9273624,\r\n    \"callsign\": \"V7HP6\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"OVERSEAS ARIADMAR\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 148.0000,\r\n    \"to_stern\": 34.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 23.0000,\r\n    \"destination\": \"PISCO    H@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.20726500000000,\r\n    \"lat\": -12.02464833333300,\r\n    \"draught\": 8.3000,\r\n    \"turn\": 0,\r\n    \"course\": 3.0000,\r\n    \"heading\": 232,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 219,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 377288000,\r\n    \"imo\": 9599561,\r\n    \"callsign\": \"J8B4500\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"PAKATNAMU\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 8.0000,\r\n    \"to_stern\": 18.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 3.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 11.1000,\r\n    \"lon\": -77.26123333333300,\r\n    \"lat\": -11.98307333333300,\r\n    \"draught\": 3.4000,\r\n    \"turn\": 127,\r\n    \"course\": 308.9000,\r\n    \"heading\": 313,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 157,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000920,\r\n    \"imo\": 8902993,\r\n    \"callsign\": \"OA4910\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"PARACAS\",\r\n    \"shiptypeDesc\": \"Tanker, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 156.0000,\r\n    \"to_stern\": 36.0000,\r\n    \"to_port\": 12.0000,\r\n    \"to_starboard\": 14.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.2000,\r\n    \"lon\": -77.18433833333300,\r\n    \"lat\": -12.00773000000000,\r\n    \"draught\": 9.0000,\r\n    \"turn\": 0,\r\n    \"course\": 345.1000,\r\n    \"heading\": 275,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 159,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000320,\r\n    \"imo\": 7611743,\r\n    \"callsign\": \"OA 2044\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"PB 1@@@@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 56.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"AREA8@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.19011500000000,\r\n    \"lat\": -12.01323666666700,\r\n    \"draught\": 6.0000,\r\n    \"turn\": 0,\r\n    \"course\": 148.5000,\r\n    \"heading\": 267,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 145,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 357170000,\r\n    \"imo\": 9177430,\r\n    \"callsign\": \"3FBO9  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"PERSEUS LEADER      \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 18.0000,\r\n    \"to_stern\": 182.0000,\r\n    \"to_port\": 22.0000,\r\n    \"to_starboard\": 10.0000,\r\n    \"destination\": \"PE CLL   H@@@@@@@@@@\",\r\n    \"speed\": 16.4000,\r\n    \"lon\": -77.27136500000000,\r\n    \"lat\": -12.25295166666700,\r\n    \"draught\": 8.5000,\r\n    \"turn\": 0,\r\n    \"course\": 160.9000,\r\n    \"heading\": 162,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 249,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 377138000,\r\n    \"imo\": 9737876,\r\n    \"callsign\": \"J8B5223\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"POMAC\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 10.0000,\r\n    \"to_stern\": 2.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 16.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14473333333300,\r\n    \"lat\": -12.04907500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 271.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 114,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": 1\r\n  },\r\n  {\r\n    \"mmsi\": 636017479,\r\n    \"imo\": 9735127,\r\n    \"callsign\": \"D5LD8  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"PORT BELAVISTA      \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 168.0000,\r\n    \"to_stern\": 32.0000,\r\n    \"to_port\": 10.0000,\r\n    \"to_starboard\": 22.0000,\r\n    \"destination\": \"PISCO PERE@@@@@@@@@@\",\r\n    \"speed\": 15.6000,\r\n    \"lon\": -77.23036000000000,\r\n    \"lat\": -12.27424666666700,\r\n    \"draught\": 6.7000,\r\n    \"turn\": 0,\r\n    \"course\": 146.7000,\r\n    \"heading\": 147,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 166,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538004921,\r\n    \"imo\": 9639763,\r\n    \"callsign\": \"V7ZV2\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"PRETTY TEAM\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 154.0000,\r\n    \"to_stern\": 26.0000,\r\n    \"to_port\": 21.0000,\r\n    \"to_starboard\": 9.0000,\r\n    \"destination\": \"CALLAO  H@@@@@@@@@@\",\r\n    \"speed\": 1.3000,\r\n    \"lon\": -77.20157333333300,\r\n    \"lat\": -12.04107000000000,\r\n    \"draught\": 6.5000,\r\n    \"turn\": 0,\r\n    \"course\": 88.6000,\r\n    \"heading\": 99,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 263,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420248,\r\n    \"imo\": 0,\r\n    \"callsign\": \"#G^BBBB\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"PU YUAN 817\",\r\n    \"shiptypeDesc\": \"Passenger, Reserved for future use\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 16.0000,\r\n    \"to_stern\": 130.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"H@@@@@@@@@@\",\r\n    \"speed\": 6.3000,\r\n    \"lon\": -77.22493833333300,\r\n    \"lat\": -12.04145166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 257.2000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 478,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224366000,\r\n    \"imo\": 9245990,\r\n    \"callsign\": \"EBRS@@@\",\r\n    \"NavigationStatus\": \"Engaged in Fishing\",\r\n    \"NavigationStatusShape\": \"diamond\",\r\n    \"shipname\": \"PUNTAL  DE AGUETE @@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 25.0000,\r\n    \"to_stern\": 18.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO  @@@@@@@@@@@@\",\r\n    \"speed\": 8.9000,\r\n    \"lon\": -77.27081666666700,\r\n    \"lat\": -12.04678666666700,\r\n    \"draught\": 4.6000,\r\n    \"turn\": -128,\r\n    \"course\": 214.7000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 116,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000960,\r\n    \"imo\": 0,\r\n    \"callsign\": \"L@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"R/M LOBOS@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category D\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14370833333300,\r\n    \"lat\": -12.04040500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 309.3000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 461,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760122000,\r\n    \"imo\": 9570307,\r\n    \"callsign\": \"OA-2664\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"R/M SECHIN\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 10.0000,\r\n    \"to_stern\": 15.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.14064833333300,\r\n    \"lat\": -12.04001500000000,\r\n    \"draught\": 4.0000,\r\n    \"turn\": 0,\r\n    \"course\": 27.7000,\r\n    \"heading\": 29,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 147,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001691,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"RAM-CHIMU @@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Not available (default)\",\r\n    \"shiptypeColor\": \"#FFFFFF\",\r\n    \"to_bow\": 8.0000,\r\n    \"to_stern\": 14.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14958833333300,\r\n    \"lat\": -12.04220166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": -128,\r\n    \"course\": 50.8000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 742,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 725011500,\r\n    \"imo\": 9289245,\r\n    \"callsign\": \"..@@@@@\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"RM NEPTUNO@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 1.0000,\r\n    \"to_stern\": 5.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 1.0000,\r\n    \"destination\": \"CALLAO   @@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14275666666700,\r\n    \"lat\": -12.04245666666700,\r\n    \"draught\": 4.5000,\r\n    \"turn\": -128,\r\n    \"course\": 0.0000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 117,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000001,\r\n    \"imo\": 9673903,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way sailing\",\r\n    \"NavigationStatusShape\": \"triangle\",\r\n    \"shipname\": \"RM ZEUS\",\r\n    \"shiptypeDesc\": \"Tug\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 8.0000,\r\n    \"to_stern\": 19.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.9000,\r\n    \"lon\": -77.14863500000000,\r\n    \"lat\": -12.05295166666700,\r\n    \"draught\": 5.1000,\r\n    \"turn\": -129,\r\n    \"course\": 189.5000,\r\n    \"heading\": 237,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 120,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760999991,\r\n    \"imo\": 926000000,\r\n    \"callsign\": \"CO15725\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"RODAS\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 3.0000,\r\n    \"to_stern\": 13.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 11.2000,\r\n    \"lon\": -77.24933166666700,\r\n    \"lat\": -12.15349833333300,\r\n    \"draught\": 3.0000,\r\n    \"turn\": 127,\r\n    \"course\": 148.1000,\r\n    \"heading\": 151,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 234,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 305271000,\r\n    \"imo\": 9431719,\r\n    \"callsign\": \"V2DN6\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"RUDOLF SCHEPERS\",\r\n    \"shiptypeDesc\": \"Cargo, No additional information\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 190.0000,\r\n    \"to_stern\": 71.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 25.0000,\r\n    \"destination\": \"PECLL \u003e @@@@@@@@@@@\",\r\n    \"speed\": 20.4000,\r\n    \"lon\": -77.26655000000000,\r\n    \"lat\": -12.21355666666700,\r\n    \"draught\": 9.4000,\r\n    \"turn\": 7,\r\n    \"course\": 166.5000,\r\n    \"heading\": 166,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 309,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 373359000,\r\n    \"imo\": 0,\r\n    \"callsign\": \":ALEA@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"S/V OCEAN SAPPHIRE@@\",\r\n    \"shiptypeDesc\": \"Cargo, Reserved for future use\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 297.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.16143666666700,\r\n    \"lat\": -12.06038833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 35.6000,\r\n    \"heading\": 511,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 731,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760001220,\r\n    \"imo\": 8417261,\r\n    \"callsign\": \"OA-3563\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"SANTA CLARA B@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 108.0000,\r\n    \"to_stern\": 28.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 12.0000,\r\n    \"destination\": \"CALLAO  @@@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.18321500000000,\r\n    \"lat\": -12.01523833333300,\r\n    \"draught\": 6.7000,\r\n    \"turn\": 0,\r\n    \"course\": 11.8000,\r\n    \"heading\": 268,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 130,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 636092432,\r\n    \"imo\": 9444845,\r\n    \"callsign\": \"D5CL4\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"SANTA INES\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 227.0000,\r\n    \"to_stern\": 73.0000,\r\n    \"to_port\": 17.0000,\r\n    \"to_starboard\": 27.0000,\r\n    \"destination\": \"PECLL\u003e\u003eCLB@@@@@@@@@@\",\r\n    \"speed\": 17.4000,\r\n    \"lon\": -77.27713333333300,\r\n    \"lat\": -12.18385833333300,\r\n    \"draught\": 11.8000,\r\n    \"turn\": -250,\r\n    \"course\": 163.3000,\r\n    \"heading\": 162,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 729,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 255805604,\r\n    \"imo\": 9430387,\r\n    \"callsign\": \"CQFC   \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"SANTA URSULA        \",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 225.0000,\r\n    \"to_stern\": 75.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 27.0000,\r\n    \"destination\": \"PECLL\u003eCLID@@@@@@@@@@\",\r\n    \"speed\": 21.0000,\r\n    \"lon\": -77.25508000000000,\r\n    \"lat\": -12.21236833333300,\r\n    \"draught\": 10.4000,\r\n    \"turn\": 0,\r\n    \"course\": 162.1000,\r\n    \"heading\": 162,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 286,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 210998000,\r\n    \"imo\": 9393539,\r\n    \"callsign\": \"5BLQ2\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"SEABOARD VALPARAISO\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 144.0000,\r\n    \"to_stern\": 16.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 20.0000,\r\n    \"destination\": \"ARICA\",\r\n    \"speed\": 13.4000,\r\n    \"lon\": -77.27706000000000,\r\n    \"lat\": -12.05008333333300,\r\n    \"draught\": 8.0000,\r\n    \"turn\": -251,\r\n    \"course\": 238.8000,\r\n    \"heading\": 237,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 254,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 353903000,\r\n    \"imo\": 9560352,\r\n    \"callsign\": \"3FFH5\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"SEATTLE BRIDGE\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 220.0000,\r\n    \"to_stern\": 73.0000,\r\n    \"to_port\": 28.0000,\r\n    \"to_starboard\": 12.0000,\r\n    \"destination\": \"PE CLL   H@@@@@@@@@@\",\r\n    \"speed\": 12.8000,\r\n    \"lon\": -77.29851500000000,\r\n    \"lat\": -11.96246500000000,\r\n    \"draught\": 12.0000,\r\n    \"turn\": 0,\r\n    \"course\": 314.0000,\r\n    \"heading\": 314,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 233,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 372923000,\r\n    \"imo\": 9317157,\r\n    \"callsign\": \"3ELD7  \",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"STELLA MARIS        \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 165.0000,\r\n    \"to_stern\": 25.0000,\r\n    \"to_port\": 19.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"JINZHOU  H@@@@@@@@@@\",\r\n    \"speed\": 11.7000,\r\n    \"lon\": -77.30872666666700,\r\n    \"lat\": -11.96440833333300,\r\n    \"draught\": 10.6000,\r\n    \"turn\": 0,\r\n    \"course\": 305.9000,\r\n    \"heading\": 308,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 290,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 538005539,\r\n    \"imo\": 9706437,\r\n    \"callsign\": \"V7EV3  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"STI WESTMINSTER     \",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 148.0000,\r\n    \"to_stern\": 35.0000,\r\n    \"to_port\": 24.0000,\r\n    \"to_starboard\": 8.0000,\r\n    \"destination\": \"CALLAO    A         \",\r\n    \"speed\": 13.0000,\r\n    \"lon\": -77.40735000000000,\r\n    \"lat\": -12.13612500000000,\r\n    \"draught\": 11.7000,\r\n    \"turn\": 0,\r\n    \"course\": 320.9000,\r\n    \"heading\": 320,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 276,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 319014500,\r\n    \"imo\": 9359399,\r\n    \"callsign\": \"ZCYV9\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"STOLT GULF MIRDIF\",\r\n    \"shiptypeDesc\": \"Tanker, Hazardous category B\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 148.0000,\r\n    \"to_stern\": 35.0000,\r\n    \"to_port\": 9.0000,\r\n    \"to_starboard\": 23.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 13.3000,\r\n    \"lon\": -77.27105833333300,\r\n    \"lat\": -12.22013000000000,\r\n    \"draught\": 11.3000,\r\n    \"turn\": 0,\r\n    \"course\": 156.9000,\r\n    \"heading\": 157,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 170,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 563935000,\r\n    \"imo\": 9648087,\r\n    \"callsign\": \"9VAG4  \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"STRATEGIC SYNERGY   \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 160.0000,\r\n    \"to_stern\": 20.0000,\r\n    \"to_port\": 16.0000,\r\n    \"to_starboard\": 14.0000,\r\n    \"destination\": \" TOCOPILL@@@@@@@@@@@\",\r\n    \"speed\": 13.6000,\r\n    \"lon\": -77.31476333333300,\r\n    \"lat\": -12.18175166666700,\r\n    \"draught\": 6.5000,\r\n    \"turn\": -248,\r\n    \"course\": 168.0000,\r\n    \"heading\": 168,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 301,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 311015100,\r\n    \"imo\": 9338852,\r\n    \"callsign\": \"C6XN6\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"SUNSHINE ACE\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 20.0000,\r\n    \"to_stern\": 180.0000,\r\n    \"to_port\": 25.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"CLIQQ    H@@@@@@@@@@\",\r\n    \"speed\": 18.5000,\r\n    \"lon\": -77.25124833333300,\r\n    \"lat\": -12.25309833333300,\r\n    \"draught\": 8.7000,\r\n    \"turn\": -249,\r\n    \"course\": 163.0000,\r\n    \"heading\": 163,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 722,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 219145000,\r\n    \"imo\": 9146467,\r\n    \"callsign\": \"OZSK2\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"SVENDBORG MAERSK\",\r\n    \"shiptypeDesc\": \"Cargo, Hazardous category C\",\r\n    \"shiptypeColor\": \"\",\r\n    \"to_bow\": 249.0000,\r\n    \"to_stern\": 98.0000,\r\n    \"to_port\": 22.0000,\r\n    \"to_starboard\": 20.0000,\r\n    \"destination\": \"SAN ANTONB@@@@@@@@@@\",\r\n    \"speed\": 15.4000,\r\n    \"lon\": -77.32851500000000,\r\n    \"lat\": -12.28825166666700,\r\n    \"draught\": 11.1000,\r\n    \"turn\": -243,\r\n    \"course\": 190.0000,\r\n    \"heading\": 188,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 739,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224166160,\r\n    \"imo\": 5348512,\r\n    \"callsign\": \"EBZP  @\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"TAFIRA@@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 22.0000,\r\n    \"to_stern\": 14.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 3.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 7.3000,\r\n    \"lon\": -77.23104833333300,\r\n    \"lat\": -12.03179833333300,\r\n    \"draught\": 4.0000,\r\n    \"turn\": -128,\r\n    \"course\": 266.0000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 115,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224581000,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"TALASA @@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Other Type, no additional information\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 28.0000,\r\n    \"to_stern\": 11.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 10.8000,\r\n    \"lon\": -77.35005166666700,\r\n    \"lat\": -12.13457166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 219.3000,\r\n    \"heading\": 221,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 131,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000510,\r\n    \"imo\": 9130016,\r\n    \"callsign\": \"OA-3386\",\r\n    \"NavigationStatus\": \"Not defined (default)\",\r\n    \"NavigationStatusShape\": \"point\",\r\n    \"shipname\": \"TASA 419 @@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 11.1000,\r\n    \"lon\": -77.23452000000000,\r\n    \"lat\": -12.18784166666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 155.3000,\r\n    \"heading\": 152,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 182,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000570,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OA-4634\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"TASA 427@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 9.0000,\r\n    \"to_stern\": 34.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"ANCHOAS@@@@@@@@@@@@@\",\r\n    \"speed\": 12.0000,\r\n    \"lon\": -77.18556166666700,\r\n    \"lat\": -11.93841500000000,\r\n    \"draught\": 2.0000,\r\n    \"turn\": 0,\r\n    \"course\": 293.3000,\r\n    \"heading\": 292,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 140,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 1172,\r\n    \"imo\": 42,\r\n    \"callsign\": \"CO18294\",\r\n    \"NavigationStatus\": \"Engaged in Fishing\",\r\n    \"NavigationStatusShape\": \"diamond\",\r\n    \"shipname\": \"TASA 42@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"ZONA DE PA@@@@@@@@@@\",\r\n    \"speed\": 102.3000,\r\n    \"lon\": -77.28008666666700,\r\n    \"lat\": -12.11845500000000,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 360.0000,\r\n    \"heading\": 177,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 184,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000620,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OA-4661\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"TASA 52@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 8.0000,\r\n    \"to_stern\": 42.0000,\r\n    \"to_port\": 6.0000,\r\n    \"to_starboard\": 6.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 102.3000,\r\n    \"lon\": -77.14177333333300,\r\n    \"lat\": -11.96242500000000,\r\n    \"draught\": 2.0000,\r\n    \"turn\": 0,\r\n    \"course\": 360.0000,\r\n    \"heading\": 181,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 169,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000770,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OA-4665\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"TASA 54@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 5.0000,\r\n    \"to_stern\": 46.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 1.0000,\r\n    \"lon\": -77.14358333333300,\r\n    \"lat\": -11.96317000000000,\r\n    \"draught\": 2.0000,\r\n    \"turn\": -129,\r\n    \"course\": 240.1000,\r\n    \"heading\": 11,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 156,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000680,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OA-4667\",\r\n    \"NavigationStatus\": \"Restricted manoeuverability\",\r\n    \"NavigationStatusShape\": \"cross\",\r\n    \"shipname\": \"TASA 55@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 4.0000,\r\n    \"to_stern\": 37.0000,\r\n    \"to_port\": 3.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"BUSCANDO D@@@@@@@@@@\",\r\n    \"speed\": 102.3000,\r\n    \"lon\": -77.14473000000000,\r\n    \"lat\": -11.96199666666700,\r\n    \"draught\": 6.0000,\r\n    \"turn\": 0,\r\n    \"course\": 360.0000,\r\n    \"heading\": 248,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 198,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 60000270,\r\n    \"imo\": 9140712,\r\n    \"callsign\": \"OA-3877\",\r\n    \"NavigationStatus\": \"Constrained by her draught\",\r\n    \"NavigationStatusShape\": \"hexagon\",\r\n    \"shipname\": \"TASA 57@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 5.0000,\r\n    \"to_stern\": 41.0000,\r\n    \"to_port\": 7.0000,\r\n    \"to_starboard\": 3.0000,\r\n    \"destination\": \"PISCO @@@@@@@@@@@@@@\",\r\n    \"speed\": 12.1000,\r\n    \"lon\": -77.27761500000000,\r\n    \"lat\": -12.14056000000000,\r\n    \"draught\": 3.5000,\r\n    \"turn\": -129,\r\n    \"course\": 173.8000,\r\n    \"heading\": 172,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 129,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000170,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OA-3874\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"TASA 58@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 8.0000,\r\n    \"to_stern\": 40.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"@@@@@@@@@@@@@@@@@@@@\",\r\n    \"speed\": 12.5000,\r\n    \"lon\": -77.16458166666700,\r\n    \"lat\": -11.95203166666700,\r\n    \"draught\": 25.5000,\r\n    \"turn\": 0,\r\n    \"course\": 304.5000,\r\n    \"heading\": 300,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 192,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000030,\r\n    \"imo\": 0,\r\n    \"callsign\": \"OBRL017\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"TASA 71@@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 5.0000,\r\n    \"to_stern\": 45.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 5.0000,\r\n    \"destination\": \"CALLAO@@@@@@@@@@@@@@\",\r\n    \"speed\": 0.5000,\r\n    \"lon\": -77.14510333333300,\r\n    \"lat\": -11.96013500000000,\r\n    \"draught\": 2.0000,\r\n    \"turn\": 0,\r\n    \"course\": 232.3000,\r\n    \"heading\": 263,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 175,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 224392000,\r\n    \"imo\": 7396941,\r\n    \"callsign\": \"EGNK\",\r\n    \"NavigationStatus\": \"Engaged in Fishing\",\r\n    \"NavigationStatusShape\": \"diamond\",\r\n    \"shipname\": \"TEMIS PRIMERO\",\r\n    \"shiptypeDesc\": \"Fishing\",\r\n    \"shiptypeColor\": \"#00FFFF\",\r\n    \"to_bow\": 22.0000,\r\n    \"to_stern\": 16.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 3.0000,\r\n    \"destination\": \"LONG LINEH@@@@@@@@@@\",\r\n    \"speed\": 0.1000,\r\n    \"lon\": -77.14168166666700,\r\n    \"lat\": -12.04226500000000,\r\n    \"draught\": 6.2000,\r\n    \"turn\": 0,\r\n    \"course\": 315.4000,\r\n    \"heading\": 59,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 719,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 412420647,\r\n    \"imo\": 0,\r\n    \"callsign\": \"@@@@@@@\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"TIANYUE2@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 0.0000,\r\n    \"to_stern\": 0.0000,\r\n    \"to_port\": 0.0000,\r\n    \"to_starboard\": 0.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 6.3000,\r\n    \"lon\": -77.21981666666700,\r\n    \"lat\": -12.03618833333300,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 244.7000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 644,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 566689000,\r\n    \"imo\": 9593658,\r\n    \"callsign\": \"9V9602\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"TONG AN CHENG\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 144.0000,\r\n    \"to_stern\": 17.0000,\r\n    \"to_port\": 20.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"JPTOY    H@@@@@@@@@@\",\r\n    \"speed\": 13.0000,\r\n    \"lon\": -77.36217000000000,\r\n    \"lat\": -11.88667000000000,\r\n    \"draught\": 10.0000,\r\n    \"turn\": 0,\r\n    \"course\": 318.0000,\r\n    \"heading\": 320,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 733,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000470,\r\n    \"imo\": 9299410,\r\n    \"callsign\": \"OA3487\",\r\n    \"NavigationStatus\": \"Under way sailing\",\r\n    \"NavigationStatusShape\": \"triangle\",\r\n    \"shipname\": \"TROMPETEROS1\",\r\n    \"shiptypeDesc\": \"Tanker, all ships of this type\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 131.0000,\r\n    \"to_stern\": 38.0000,\r\n    \"to_port\": 23.0000,\r\n    \"to_starboard\": 7.0000,\r\n    \"destination\": \"CALLAO   H@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.21561500000000,\r\n    \"lat\": -12.00963166666700,\r\n    \"draught\": 10.6000,\r\n    \"turn\": 127,\r\n    \"course\": 109.0000,\r\n    \"heading\": 185,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 149,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 760000880,\r\n    \"imo\": 9293985,\r\n    \"callsign\": \"OA 4991\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"URUBAMBA@@@@@@@@@@@@\",\r\n    \"shiptypeDesc\": \"Tanker, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 144.0000,\r\n    \"to_stern\": 32.0000,\r\n    \"to_port\": 18.0000,\r\n    \"to_starboard\": 17.0000,\r\n    \"destination\": \"BAYAVOR@@@@@@@@@@@@@\",\r\n    \"speed\": 12.0000,\r\n    \"lon\": -77.28474833333300,\r\n    \"lat\": -11.97224833333300,\r\n    \"draught\": 7.3000,\r\n    \"turn\": -241,\r\n    \"course\": 360.0000,\r\n    \"heading\": 321,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 150,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 341564000,\r\n    \"imo\": 0,\r\n    \"callsign\": \"V4CI3\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"V!!P\u003cLLLU-@2\\\\8H@ZCQA\",\r\n    \"shiptypeDesc\": \"Other Type, all ships of this type\",\r\n    \"shiptypeColor\": \"#FA5858\",\r\n    \"to_bow\": 13.0000,\r\n    \"to_stern\": 13.0000,\r\n    \"to_port\": 4.0000,\r\n    \"to_starboard\": 4.0000,\r\n    \"destination\": \"\",\r\n    \"speed\": 0.5000,\r\n    \"lon\": -77.16411000000000,\r\n    \"lat\": -12.06146666666700,\r\n    \"draught\": 0.0000,\r\n    \"turn\": 0,\r\n    \"course\": 11.5000,\r\n    \"heading\": 511,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 696,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 645160000,\r\n    \"imo\": 7931014,\r\n    \"callsign\": \"3BLI\",\r\n    \"NavigationStatus\": \"Moored\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"VERRAZZANO 1800\",\r\n    \"shiptypeDesc\": \"Dredging or underwater ops\",\r\n    \"shiptypeColor\": \"#BFFF00\",\r\n    \"to_bow\": 65.0000,\r\n    \"to_stern\": 15.0000,\r\n    \"to_port\": 5.0000,\r\n    \"to_starboard\": 9.0000,\r\n    \"destination\": \"CALLAO\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.14157500000000,\r\n    \"lat\": -12.04247333333300,\r\n    \"draught\": 2.7000,\r\n    \"turn\": 0,\r\n    \"course\": 237.8000,\r\n    \"heading\": 63,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 146,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 566828000,\r\n    \"imo\": 9457646,\r\n    \"callsign\": \"9V7581\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"WAN HAI 515\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 197.0000,\r\n    \"to_stern\": 62.0000,\r\n    \"to_port\": 26.0000,\r\n    \"to_starboard\": 11.0000,\r\n    \"destination\": \"MXZLO    H@@@@@@@@@@\",\r\n    \"speed\": 5.8000,\r\n    \"lon\": -77.27848166666700,\r\n    \"lat\": -11.99471500000000,\r\n    \"draught\": 9.7000,\r\n    \"turn\": -251,\r\n    \"course\": 308.0000,\r\n    \"heading\": 308,\r\n    \"id_company\": 2,\r\n    \"id_ship\": 705,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 566886000,\r\n    \"imo\": 9457658,\r\n    \"callsign\": \"9V7582 \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"WAN HAI 516         \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 197.0000,\r\n    \"to_stern\": 62.0000,\r\n    \"to_port\": 26.0000,\r\n    \"to_starboard\": 11.0000,\r\n    \"destination\": \"MXZLO    H@@@@@@@@@@\",\r\n    \"speed\": 18.9000,\r\n    \"lon\": -77.27498166666700,\r\n    \"lat\": -11.98204833333300,\r\n    \"draught\": 9.1000,\r\n    \"turn\": -243,\r\n    \"course\": 311.0000,\r\n    \"heading\": 310,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 226,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 210159000,\r\n    \"imo\": 9395070,\r\n    \"callsign\": \"5BTW3\",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"WARNOW DOLPHIN\",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 145.0000,\r\n    \"to_stern\": 22.0000,\r\n    \"to_port\": 2.0000,\r\n    \"to_starboard\": 23.0000,\r\n    \"destination\": \"GUAYAQUILH@@@@@@@@@@\",\r\n    \"speed\": 14.1000,\r\n    \"lon\": -77.35965833333300,\r\n    \"lat\": -11.92317666666700,\r\n    \"draught\": 9.1000,\r\n    \"turn\": 0,\r\n    \"course\": 312.4000,\r\n    \"heading\": 312,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 319,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 351206000,\r\n    \"imo\": 9422392,\r\n    \"callsign\": \"3FDY8\",\r\n    \"NavigationStatus\": \"At anchor\",\r\n    \"NavigationStatusShape\": \"square\",\r\n    \"shipname\": \"ZARUMA\",\r\n    \"shiptypeDesc\": \"Tanker, Hazardous category A\",\r\n    \"shiptypeColor\": \"#FF00FF\",\r\n    \"to_bow\": 202.0000,\r\n    \"to_stern\": 42.0000,\r\n    \"to_port\": 28.0000,\r\n    \"to_starboard\": 13.0000,\r\n    \"destination\": \"CALLAO - D@@@@@@@@@@\",\r\n    \"speed\": 0.0000,\r\n    \"lon\": -77.20483166666700,\r\n    \"lat\": -11.99649833333300,\r\n    \"draught\": 14.9000,\r\n    \"turn\": 0,\r\n    \"course\": 313.0000,\r\n    \"heading\": 235,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 181,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  },\r\n  {\r\n    \"mmsi\": 413442980,\r\n    \"imo\": 9567477,\r\n    \"callsign\": \"BLWN   \",\r\n    \"NavigationStatus\": \"Under way using engine\",\r\n    \"NavigationStatusShape\": \"arrow\",\r\n    \"shipname\": \"ZHE HAI 505         \",\r\n    \"shiptypeDesc\": \"Cargo, all ships of this type\",\r\n    \"shiptypeColor\": \"#FE9A2E\",\r\n    \"to_bow\": 158.0000,\r\n    \"to_stern\": 21.0000,\r\n    \"to_port\": 10.0000,\r\n    \"to_starboard\": 18.0000,\r\n    \"destination\": \"CALLAO PEPT-S\u0026-P@HNW\",\r\n    \"speed\": 11.8000,\r\n    \"lon\": -77.33365333333300,\r\n    \"lat\": -11.96149000000000,\r\n    \"draught\": 0.9600,\r\n    \"turn\": 0,\r\n    \"course\": 287.8000,\r\n    \"heading\": 288,\r\n    \"id_company\": 0,\r\n    \"id_ship\": 168,\r\n    \"id_lenguage\": \"Esp\",\r\n    \"bo_guard_state\": null\r\n  }\r\n]"});
        
        
        $.ajax({
            type: "POST",
            url: "MyTracking.aspx/GetLocationPrintRealTime",
            data: '{str_Id_ship: "' + str_Id_ship + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AddArrayPoint,
            failure: function (response) {
                alert(response);
            }
        });
        */
    },
    AddPoint:function(response) {
        try {
            var myLatlngA = { lat: -12.162208, lng: -76.986291 };
            var markerA = new google.maps.Marker({
                position: myLatlngA,
                map: map,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|FF3417|FFFFFF'
                /*icon: 'images/white-car.png'*/
            });

            markerA.setMap(map);
        }
        catch (err) {
            //alert(err.message);
        }
    },
    ValResponse:function(response) {
        console.log("VALRESPONSE");
        try {
            str_mapRefresh = response.d;
            setInterval(indexActivity.RefreshBoat, parseInt(str_mapRefresh) * 1000);
        }
        catch (err) {
            alert(err.message);
        }
    },
    AddArrayPoint:function() {
        try {
            result = indexActivity.ships;
            var marker0;
            var marker1;
            var line;
            var color = '';
            var admill = 0;
            var fladmill = 0;
            var vfillOpacity = 0.5;
            var vstrokeOpacity = 0.0;
            var vstrokeColor = '';
            
            for (i = 0; i < result.length; i++) {
                vfillOpacity = 1;
                vstrokeOpacity = 1;
                vstrokeColor = '#0080FF';
                try {
                    color = result[i].shiptypeColor; //getRandomColor();
                    //vstrokeColor = result[i].shiptypeColor;
                    var lat0 = '';//parseFloat(result[i].lat_old);
                    var lon0 = '';//parseFloat(result[i].lon_old);
                    var course = parseFloat(result[i].course);
                    var lat1 = parseFloat(result[i].lat);
                    var lon1 = parseFloat(result[i].lon);
                    admill = parseFloat(result[i].speed);
                    fladmill = admill;
                    admill = admill.toFixed(2);

                    if (parseInt(result[i].id_company) == id_company)
                    {
                        vfillOpacity = 0.5;
                        vstrokeOpacity = 1;
                        vstrokeColor = '#FF0000';
                    }

                    if (result[i].NavigationStatusShape == 'point')
                    {
                        if (!isNaN(lat1) && !isNaN(lon1)) {
                            var myLatlng1 = { lat: lat1, lng: lon1 };
                            marker1 = new google.maps.Marker({
                                position: myLatlng1,
                                map: map,
                                strokeColor: vstrokeColor,
                                strokeOpacity: vstrokeOpacity,
                                strokeWeight: 3,
                                icon: {
                                    path: google.maps.SymbolPath.CIRCLE,
                                    strokeWeight: 2,
                                    fillColor: color,
                                    strokeColor: vstrokeColor,
                                    strokeOpacity: vstrokeOpacity,
                                    fillOpacity: vfillOpacity,
                                    scale: 6,
                                    rotation: course
                                },
                                source: result[i]
                            });
                        }
                    }
                    else
                    {
                        if (result[i].NavigationStatusShape == 'arrow') {
                            if (!isNaN(lat1) && !isNaN(lon1)) {
                                var myLatlng1 = { lat: lat1, lng: lon1 };
                                marker1 = new google.maps.Marker({
                                    position: myLatlng1,
                                    map: map,
                                    strokeColor: vstrokeColor,
                                    strokeOpacity: vstrokeOpacity,
                                    strokeWeight: 3,
                                    icon: {
                                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                        strokeWeight: 2,
                                        fillColor: color,
                                        strokeColor: vstrokeColor,
                                        strokeOpacity: vstrokeOpacity,
                                        fillOpacity: vfillOpacity,
                                        scale: 4,
                                        rotation: course
                                    },
                                    source: result[i]
                                });
                            }
                        }
                        else
                        {
                            if (!isNaN(lat1) && !isNaN(lon1))
                            {
                                marker1 = indexActivity.square(result[i].NavigationStatusShape,
                                           vstrokeColor,
                                           color,
                                           vfillOpacity,
                                           vstrokeOpacity,
                                           3, lat1, lon1);
                                //marker1.setMap(map);
                                marker1.source = result[i];
                            }
                        }
                    }
                    
                    var strInfoMessage = '<b>Nombre del barco:</b> ' + result[i].shipname + '<br>';
                    strInfoMessage += '<b>Tipo de barco:</b> ' + result[i].shiptypeDesc + '<br>';
                    strInfoMessage += '<b>MMSI:</b> ' + result[i].mmsi + '<br>';
                    strInfoMessage += '<b>IMO:</b> ' + result[i].imo + '<br>';
                    strInfoMessage += '<b>Call Sign:</b> ' + result[i].callsign + '<br>';
                    strInfoMessage += '<b>Lat:</b> ' + result[i].lat + ' <b>Lng:</b> ' + result[i].lon + '<br>';
                    strInfoMessage += '<b>Status:</b> ' + result[i].NavigationStatus + '<br>';
                    strInfoMessage += '<b>Speed:</b> ' + admill + " Kntos<br>";
                    strInfoMessage += '<b>Draught:</b> ' + result[i].draught + ' mts.';

                    indexActivity.bindInfoWindow(marker1, map, myInfoWindow, strInfoMessage, result[i].id_ship);
                    marker1.setMap(map);
                    markersArray.push(marker1);
                }
                catch (err) {
                    //alert(err.message);
                }
            }
        }
        catch (err) {
            alert(err.message + ' Start:' + indexActivity.ships);
            console.log("error", indexActivity.ships);
        }
    },
    load: function(){
        /*if(!load_map)
        {

             point1=null;
             point2=null;
             poly=null;
             directionsDisplay=null;
             map=null;
             distancia = 0;
             tiempo = 0;
             markersArray = [];
             lineSymbol=null;
             linesArray = [];
             rectangleArray = [];
             myInfoWindow=null;
             str_mapRefresh = '';
             result=null;

             getInfoMyShips=false;
             select_id_ship=0;
             select_marker=null;

             load_map = true;

            console.log("RECARGANDO MAPA");
            indexActivity.initMap();
        }*/

        //////////////////////////////////////////
    }
}