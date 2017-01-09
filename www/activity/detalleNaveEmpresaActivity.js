var detalleNaveEmpresaActivity =
{
	ini: function(){

	},
	fnDialog : function(){
		                //if (id_ship === null) return; 
		var id_ship = select_id_ship;
		var marker = select_marker;

        var source = marker.source;

        var id_company = source.id_company;
        var shipname = source.shipname;
        var id_lenguage = source.id_lenguage;

        $$('#lblNomBarco').html(source.shipname);            

        $$('#my-tab-content .tab-pane').removeClass('active');
        if($$('#barco')!=null)
            $$('#barco').addClass('active');
        else
            $$('#ais').addClass('active');


        $$('#tabs li').removeClass('active');
        if($$('#liBarco')!=null)
            $$('#liBarco').addClass('active');
        else
            $$('#liAIS').addClass('active');

        if ($$('#ais') != null)
            detalleNaveEmpresaActivity.loadUcInfoShipAIS(id_ship, id_lenguage);

        if ($$('#barco') != null)
            detalleNaveEmpresaActivity.GetUcInfoShipCompany(id_ship, id_lenguage);

        if ($$('#tripulacion') != null)
            detalleNaveEmpresaActivity.GetUcCrewList(id_company, id_ship, shipname);
        /////////////////////////////////////////////////////////////////////MOSTRAR MODAL
	},
	fnDialogPublic : function(){
		//if (id_ship === null) return;
				var id_ship = select_id_ship;
		var marker = select_marker;


        var source = marker.source;

        var shipname = source.shipname;
        var id_lenguage = source.id_lenguage;

        $$('#lblNomBarcoP').html(source.shipname);

        $$('#my-tab-content-public .tab-pane').removeClass('active');
        if ($$('#aisP') != null)
            $$('#aisP').addClass('active');

        $$('#tabs-public li').removeClass('active');
        if ($$('#liAISP') != null)
            $$('#liAISP').addClass('active');

        if ($$('#aisP') != null)
            detalleNaveEmpresaActivity.loadUcInfoShipAISP(id_ship, id_lenguage);
        /////////////////////////////////////////////////////////////////////MOSTRAR MODAL

        //$$('#mdInfoPublic').modal('show');
	},
    indexTabletoTitle(index){
        switch(index){
            case "mmsi": return "MMSI";break;
            case "ais_imo": return "Numero IMO";break;
            case "ais_callsign": return "Call Sign";break;
            case "ais_shipname": return "Nombre de la nave";break;
            //case "ais_shiptype": return "Tipo de nave";break;
            case "id_mastertable_typeship": return "Tipo de nave";break;
            case "ais_to_bow": return "Dimension to Bow";break;
            case "ais_to_stern": return "Dimension to Stern";break;
            case "ais_to_port": return "Dimension to Port";break;
            case "ais_to_starboard": return "Dimension to Starboard";break;

            case "nu_ship_eslora": return "Eslora";break;
            case "nu_ship_manga": return "Manga";break;
            case "nu_ship_puntal": return "Puntual";break;
            case "tx_ship_registration": return "Registro";break;

            case "nu_ship_yearbuilt": return "Fecha Fabricación";break;
            case "nu_ship_HP": return "HP";break;
            case "nu_ship_speed": return "Velocidad";break;
            case "nu_ship_AB": return "AB";break;
            case "tx_ship_bollardpull": return "Bollard Pull";break;

            case "nu_ship_grosstonnage": return "Gross tonnage";break;
            case "nu_ship_deadweight": return "Deadweight";break;
            case "nu_ship_lengthoverall": return "Length overall";break;
            case "nu_ship_breadthextreme": return "Breadth extreme";break;
            case "nu_ship_pesoenrosca": return "Peso en rosca";break;

            default: return "";break;
        }
    },
	loadUcInfoShipAISP:function(id_ship, id_lenguage) {
        $$('#tabnaveais').html("");

        Main.restFul(
            API + 'InfoShipAIS',
            'GET',
            {
                id_ship:id_ship,
                id_lenguage:id_lenguage
            },
            function(respondBody,respondHeader)
            {
                var data = respondBody.data.d[0];
                console.log("loadUcInfoShipAISP");
                console.log(data);
                var htmlDataShip = "";
                
                Object.keys(data).map(function(indexAsoc, indexNum) {
                    var title = detalleNaveEmpresaActivity.indexTabletoTitle(indexAsoc);
                    if(title!="")
                    {
                        htmlDataShip += '<div class="col-md-12 pnl-item"><div> <span class="txt_title">' + title + '</span> </div><div> <span class="txt_info">'+((data[indexAsoc]==null)? "":data[indexAsoc])+'</span> </div> </div>';
                    }
                    else
                    {
                        console.log(indexAsoc + ": " + data[indexAsoc]);
                    }
                });
                
                var htmlShip = '<div id="divAIS">' + htmlDataShip + '</div>';
                $$("#tabnaveais").append(htmlShip);
            }
        );
    },
    loadUcInfoShipAIS:function(id_ship, id_lenguage) {
        $$('#tabnaveais').html("");

        Main.restFul(
            API + 'InfoShipAIS',
            'GET',
            {
                id_ship:id_ship,
                id_lenguage:id_lenguage
            },
            function(respondBody,respondHeader)
            {
                var data = respondBody.data.d[0];
                console.log("loadUcInfoShipAIS");
                var htmlDataShip = "";
                
                Object.keys(data).map(function(indexAsoc, indexNum) {
                    var title = detalleNaveEmpresaActivity.indexTabletoTitle(indexAsoc);
                    if(title!="")
                    {
                        htmlDataShip += '<div class="col-md-12 pnl-item"><div> <span class="txt_title">' + title + '</span> </div><div> <span class="txt_info">'+((data[indexAsoc]==null)? "":data[indexAsoc])+'</span> </div> </div>';
                    }
                    else
                    {
                        //HAY IMAGEN EN tx_shipfile_name
                        console.log(indexAsoc + ": " + data[indexAsoc]);
                    }
                });
                
                var htmlShip = '<div class="page-content" id="divAIS">' + htmlDataShip + '</div>';
                $$("#tabnaveais").html(htmlShip);
            }
        );
    },
    GetUcInfoShipCompany: function(id_ship, id_lenguage) {

        $$('#tabnaveinformation').html("");

        Main.restFul(
            API + 'InfoShipCompany',
            'GET',
            {
                id_ship:id_ship,
                id_lenguage:id_lenguage
            },
            function(respondBody,respondHeader)
            {
                var data = respondBody.data.d[0];
                console.log("GetUcInfoShipCompany");
                //console.log(data);
                var htmlDataShipCompany = "";
                
                Object.keys(data).map(function(indexAsoc, indexNum) {
                    var title = detalleNaveEmpresaActivity.indexTabletoTitle(indexAsoc);
                    if(title!="")
                    {
                        htmlDataShipCompany += '<div class="col-md-12 pnl-item"><div> <span class="txt_title">' + title + '</span> </div><div> <span class="txt_info">'+((data[indexAsoc]==null)? "":data[indexAsoc])+'</span> </div> </div>';
                    }
                    else
                    {
                        console.log(indexAsoc);
                    }
                });
                
                var htmlShipCompany = '<div class="page-content" id="divShipCompany">' + htmlDataShipCompany + '</div>';
                $$("#tabnaveinformation").html(htmlShipCompany);
            }
        );

    },
    GetUcCrewList: function(id_company,id_ship,shipname) {
        var guard = false;
        Main.restFul(
            API + 'CrewList',
            'GET',
            {
                id_company:id_company,
                id_ship:id_ship
            },
            function(respondBody,respondHeader)
            {
                var data = respondBody.data.d;
                console.log("GetUcCrewList");
                $$("#naveEmpresaTripulacion ul").html("");
                var htmlDataCrewList = "";

                var countInfoCapitan        = 0;
                var countInfoTripulacion    = 0;
                console.log("data.length----------");
                console.log(data.length);
                if(data.length>0)
                {
                    $$.each(data,function(index,value){
                        if(!guard)
                        {
                            $$("#naveEmpresaGuardia .buque").html(shipname);
                            $$("#naveEmpresaGuardia .inicio").html(value.dt_guard_start_format);
                            $$("#naveEmpresaGuardia .horas").html(value.dt_guard_hours);
                        }

                        if(value.id_mastertable_workposition==1)
                        {
                            countInfoCapitan++;
                            $$("#naveEmpresaCapitan .nombre").html(value.PersonName);
                            $$("#naveEmpresaCapitan .cargo").html(value.workposition);
                            $$("#naveEmpresaCapitan .nacionalidad").html(value.birthplace);
                        }else{
                            countInfoTripulacion++;
                            htmlDataCrewList += '<li> <div class="item-content"> <div class="item-inner" style="margin: 0;"> <div class="item-title">Nombre</div> <div class="item-after">'+
                            value.PersonName
                            +'</div> </div> </div> <div class="item-content"> <div class="item-inner" style="margin: 0;"> <div class="item-title">Cargo</div> <div class="item-after">'+
                            value.workposition
                            +'</div> </div> </div> <div class="item-content"> <div class="item-inner" style="margin: 0;"> <div class="item-title">Título</div> <div class="item-after">'+
                            value.personprofession
                            +'</div> </div> </div> </li>';
                        }
                    });
                    $$("#naveEmpresaTripulacion ul").html(htmlDataCrewList);
                }
                else
                {
                    $$("#tabnavetripulation").html('<div class="item-inner" style="margin: 0;"><div class="item-after text-center">Esta nave no cuenta con tripulacion registrada</div></div>');
                }

                if(countInfoCapitan==0)
                {
                    var notInfoCapitan      = '<div class="text-center">Esta nave no cuenta con capitan registrado</div>';
                    $$("#naveEmpresaGuardia").html(notInfoCapitan);
                }
                if(countInfoTripulacion==0)
                {
                    var notInfoTripulacion  = '<div class="text-center">Esta nave no cuenta con tripulacion registrada</div>';
                    $$("#naveEmpresaTripulacion").html(notInfoTripulacion);
                }
            }
        );

    },
	load: function(){
		if(getInfoMyShips){
			this.fnDialog();
		}else{
			$$('div[data-page="detalleNaveEmpresa"] .toolbar').remove();
			$$("#tabnaveinformation.tab").remove();
			$$("#tabnavetripulation.tab").remove();
			this.fnDialogPublic();
		}


	}
}