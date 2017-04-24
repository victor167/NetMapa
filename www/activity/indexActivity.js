
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
//var maplabels = new Array();
var indexActivity = 
{
    labelActive: false,
    maplabels: [],
    ini: function() {
        
        $$("body").on("click","#btnLabel",function(){
            if(!$$(this).hasClass("check"))
            {
                //LABEL ACTIVADO
                $$(this).addClass("check");
                indexActivity.labelActive = true;
            }
            else
            {
                //LABEL DESACTIVADO
                $$(this).removeClass("check");
                indexActivity.labelActive = false;
            }
            indexActivity.addLabels();
            /*$$("#search .search-icon").html('');
            $$("#search").toggleClass("show");
            $$('#search .search.input input[type="text"]').val("").focus();*/
        });

        $$("body").on("click","#btnSearch",function(){
            $$("#search .search-icon").html('');
            $$("#btnSearch").toggleClass("show");
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
                position: {lat: lati, lng: lon},
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

        /*

        */

        load_map = true;
        Main.appendScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDqqseQsCvkJfCpy6gswmpUY4IBhCCrtZU&callback=indexActivity.initMap&libraries=geometry");
        
    },
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
    clearLabels: function(){
        console.log("maplabels: " + indexActivity.maplabels.length);
        for (y = 0; y < indexActivity.maplabels.length; y++)
        {
            console.log(y);
            indexActivity.maplabels[y].set('map', null);
            if(y+1==indexActivity.maplabels.length)
            {
                indexActivity.maplabels = new Array();
            }
        }
    },
    /*addLabels: function(){

        if(indexActivity.labelActive)
        {
            for (x = 0; x < indexActivity.ships.length; x++)
            {
                if(indexActivity.ships[x].shipname!="" && indexActivity.ships[x].shipname.length>0)
                {
                    var _lat = parseFloat(indexActivity.ships[x].lat);
                    var _lon = parseFloat(indexActivity.ships[x].lon);
                    //console.log("shipname:" + indexActivity.ships[x].shipname + " | position(" + _lat + "," + _lon + ")");

                    indexActivity.maplabels[indexActivity.maplabels.length] = new MapLabel({
                        text: '   ' + indexActivity.ships[x].shipname,
                        position: new google.maps.LatLng(_lat, _lon),
                        map: map,
                        fontSize: 9,
                        align: 'left'
                    });
                }
            } 
        }
        else
        {
            indexActivity.clearLabels();
        }
    },*/
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
        Main.appendScript("js/maplabel-compiled.js");

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
 
        var styledMap = new google.maps.StyledMapType(styles,{ name: 'Mar' });

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

        //map.mapTypes.set('map_style', styledMap);
        //map.setMapTypeId('map_style');

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



        Main.restFul(
            API + 'Ship',
            'GET',
            {},
            function(respondBody,respondHeader)
            {
                indexActivity.removeRectangle();
                indexActivity.removeLines();
                indexActivity.clearOverlays();
                
                console.log("AddArrayPoint");
                if(respondBody.data.d!="null")
                {
                    indexActivity.ships = JSON.parse(respondBody.data.d);
                }
                
                indexActivity.AddArrayPoint();
            }
        );


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
        try
        {
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
            
            for (i = 0; i < result.length; i++) 
            {
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
                    //var shipname = result[i].shipname;
                    fladmill = admill;
                    admill = admill.toFixed(2);

                    /////////////////////////////////////////
                    

                    
                    /////////////////////////////////////////

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
                                source: result[i],
                                /*label: {
                                    text: "ok vamos",
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                    fontSize: "10px"
                                    color: "red"
                                }*/
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
                    
                    var strInfoMessage = '<b>Nombre de nave:</b> ' + result[i].shipname + '<br>';
                    strInfoMessage += '<b>Tipo de nave:</b> ' + result[i].shiptypeDesc + '<br>';
                    strInfoMessage += '<b>MMSI:</b> ' + result[i].mmsi + '<br>';
                    //strInfoMessage += '<b>IMO:</b> ' + result[i].imo + '<br>';
                    //strInfoMessage += '<b>Call Sign:</b> ' + result[i].callsign + '<br>';
                    //strInfoMessage += '<b>Lat:</b> ' + result[i].lat + ' <b>Lng:</b> ' + result[i].lon + '<br>';
                    //strInfoMessage += '<b>Status:</b> ' + result[i].NavigationStatus + '<br>';
                    strInfoMessage += '<b>Velocidad:</b> ' + admill + " Kntos<br>";
                    strInfoMessage += '<b>Destino:</b> ' + result[i].destination;
                    //console.log("result X:",result);
                    indexActivity.bindInfoWindow(marker1, map, myInfoWindow, strInfoMessage, result[i].id_ship);
                    marker1.setMap(map);
                    markersArray.push(marker1);
                }
                catch (err) {
                    //alert(err.message);
                }

                if(i+1==result.length)
                {
                    setTimeout(indexActivity.addLabels,200);
                }
            }
        }
        catch (err) {
            //alert(err.message + ' Start:' + indexActivity.ships);
            console.log("error", err);
        }
    },
    load: function(){
        if(!load_map)
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
        }

        //////////////////////////////////////////
    }
}