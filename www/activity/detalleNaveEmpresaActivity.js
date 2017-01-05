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
        //$$('#mdlInfoBarco').modal('show');
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
            //$('#aisP').load('../UC/ucInfoShipAIS.ascx?idship=' + id_ship + "&id_lenguage=" + id_lenguage);
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
                //console.log(data);
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
        //$$('#tabnaveinformation').html("");
        //var r = {"d":"\r\n\u003cstyle\u003e\r\n    #divShipCompany {\r\n        overflow: auto;\r\n        height: 100%;\r\n        width: 100%;\r\n        border-top: none;\r\n    }\r\n\r\n    #divShipCompany .col-md-12,\r\n    #divShipCompany .col-md-4,\r\n    #divShipCompany .col-md-6,\r\n    #divShipCompany .col-md-8{\r\n        padding:1px;\r\n    }\r\n\r\n    .imgClassCompany {\r\n        height: 250px;\r\n        width:400px;\r\n    }\r\n\r\n    #tbShipCompany {\r\n        font-size:10pt;\r\n    }\r\n\r\n    .pnl-item{\r\n        border-bottom:1px solid #DDD;\r\n        padding: 4px !important;\r\n    }\r\n\r\n    .txt_info {\r\n        font-weight:bold;\r\n    }\r\n\r\n\u003c/style\u003e\r\n\u003cdiv class=\"col-md-12\" id=\"divShipCompany\"\u003e\r\n    \u003cdiv class=\"col-md-6\"\u003e\r\n        \u003cdiv id=\"ctl01_pnlShipCompany\" class=\"col-md-12\"\u003e\r\n\t\r\n        \u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_2\"\u003eMMSI\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_2\" class=\"txt_info\"\u003e760000131\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_3\"\u003eIMO\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_3\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_4\"\u003eCall Sign\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_4\" class=\"txt_info\"\u003eOA-4710\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_5\"\u003eNombre del Barco\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_5\" class=\"txt_info\"\u003eUsqay\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_6\"\u003eTipo Barco\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_6\" class=\"txt_info\"\u003eLanchas\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_7\"\u003eEslora\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_7\" class=\"txt_info\"\u003e9.14000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_8\"\u003eManga\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_8\" class=\"txt_info\"\u003e3.00000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_9\"\u003ePuntal\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_9\" class=\"txt_info\"\u003e1.00000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_10\"\u003eRegistration\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_10\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_11\"\u003eBandera\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_11\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_12\"\u003eAis\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_12\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_13\"\u003eMotor\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_13\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_14\"\u003eCasco\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_14\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_15\"\u003ePropulsion\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_15\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_16\"\u003eGrosstonnage\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_16\" class=\"txt_info\"\u003e0\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_17\"\u003eDead Weight\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_17\" class=\"txt_info\"\u003e0\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_18\"\u003eLength Overall\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_18\" class=\"txt_info\"\u003e0.00000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_19\"\u003eBreadth extreme\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_19\" class=\"txt_info\"\u003e0.00000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_20\"\u003eYear Built\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_20\" class=\"txt_info\"\u003e1982\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_21\"\u003eHP\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_21\" class=\"txt_info\"\u003e320\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_22\"\u003eSpeed\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_22\" class=\"txt_info\"\u003e\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_23\"\u003ePeso enrosca\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_23\" class=\"txt_info\"\u003e0.00000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_24\"\u003eAB\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_24\" class=\"txt_info\"\u003e6.82000000\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\u003cdiv class=\"col-md-12 pnl-item\"\u003e\r\n\t\t\u003cdiv class=\"col-md-4\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Lbl_25\"\u003eBollard Pull\u003c/span\u003e\r\n\t\t\u003c/div\u003e\u003cdiv class=\"col-md-8\"\u003e\r\n\t\t\t\u003cspan id=\"ctl01_dtInfo_Txt_25\" class=\"txt_info\"\u003eN/A\u003c/span\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\r\n\u003c/div\u003e\r\n    \u003c/div\u003e\r\n    \u003cdiv class=\"col-md-6\" style=\"text-align:center\"\u003e\r\n        \u003cimg id=\"ctl01_imgShipCompany\" class=\"imgClassCompany\" src=\"http://aistracking.com/Images/ship/Usqay.png\" /\u003e\r\n    \u003c/div\u003e\r\n\u003c/div\u003e"};
        //$$("#tabnaveinformation").append(r.d);


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

        /*$$.ajax({
            type: "POST",
            url: "MyTracking.aspx/GetUcInfoShipCompany",
            data: '{id_ship: ' + id_ship + ', _id_lenguage: "' + id_lenguage + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                $$("#barco").append(r.d);
            },
            failure: function (response) {
                alert(response);
            }
        });*/
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

                $$.each(data,function(index,value){
                    if(!guard)
                    {
                        $$("#naveEmpresaGuardia .buque").html(shipname);
                        $$("#naveEmpresaGuardia .inicio").html(value.dt_guard_start_format);
                        $$("#naveEmpresaGuardia .horas").html(value.dt_guard_hours);
                    }

                    if(value.id_mastertable_workposition==1)
                    {
                        $$("#naveEmpresaCapitan .nombre").html(value.PersonName);
                        $$("#naveEmpresaCapitan .cargo").html(value.workposition);
                        $$("#naveEmpresaCapitan .nacionalidad").html(value.birthplace);
                    }else{
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

                
                //var htmlShipCompany = '<div class="page-content" id="divShipCompany">' + htmlDataCrewList + '</div>';
                //$$("#tabnaveinformation").html(htmlShipCompany);
            }
        );

        //$$('#tabnavetripulation').html("");
        //var r = {"d":"\r\n\u003cstyle\u003e\r\n    #tripulacion {\r\n        overflow: auto;\r\n        height: 100%;\r\n        width: 100%;\r\n        border-top: none;\r\n    }\r\n\r\n    .panel-body{\r\n        padding: 1px 5px !important;\r\n    }\r\n    #tripulacion .col-md-12,\r\n    #tripulacion .col-md-4,\r\n    #tripulacion .col-md-5,\r\n    #tripulacion .col-md-6,\r\n    #tripulacion .col-md-7,\r\n    #tripulacion .col-md-8{\r\n        padding:2px;\r\n    }\r\n    \r\n    .imgClassPhoto {\r\n        height: 110px;\r\n        width:100px;\r\n    }\r\n\u003c/style\u003e\r\n\r\n\u003cdiv class=\"col-md-12\" id=\"divCrew\"\u003e\r\n\u003cdiv class=\"col-xs-6 col-md-5\"\u003e\r\n\t\u003cdiv class=\"panel panel-default\"\u003e\r\n\t\t\u003cdiv class=\"panel-heading\"\u003e\r\n\t\t\t\u003ch3 class=\"panel-title\"\u003eInformacion del Capitan\u003c/h3\u003e\r\n\t\t\u003c/div\u003e\r\n\t\t\u003cdiv class=\"panel-body\"\u003e                    \r\n\t\t\t\u003ctable class=\"table table-condensed table-striped table-bordered table-hover\"\u003e\r\n\t\t\t\t\u003ctbody\u003e\r\n\t\t\t\t\t\u003ctr\u003e\r\n\t\t\t\t\t\t\u003ctd\u003e\u003csmall\u003eNombre Completo\u003c/small\u003e\u003c/td\u003e\r\n\t\t\t\t\t\t\u003ctd\u003e\u003cb\u003e\u003csmall\u003e\u003cspan id=\"ctl01_lblNomCapitan\"\u003e\u003c/span\u003e\u003c/small\u003e\u003c/b\u003e\u003c/td\u003e\r\n\t\t\t\t\t\t\u003ctd rowspan=\"3\"\u003e\r\n\t\t\t\t\t\t\u003c!--img style=\"width: 150px; height: 150px;\" src=\"http://aistracking.com/00JoseJaramilloBonneff.jpg\" class=\"img-thumbnail\"/!--\u003e\r\n                            \u003cimg id=\"ctl01_imgFotoCapitan\" class=\"imgClassPhoto\" src=\"http://aistracking.com/Images/person/blank.jpg\" /\u003e\r\n\t\t\t\t\t\t\u003c/td\u003e\t\r\n\t\t\t\t\t\u003c/tr\u003e\r\n\t\t\t\t\t\u003ctr\u003e\r\n\t\t\t\t\t\t\u003ctd\u003e\u003csmall\u003eCargo\u003c/small\u003e\u003c/td\u003e\r\n\t\t\t\t\t\t\u003ctd\u003e\u003cb\u003e\u003csmall\u003e\u003cspan id=\"ctl01_lblCargoCapitan\"\u003e\u003c/span\u003e\u003c/small\u003e\u003c/b\u003e\u003c/td\u003e\r\n\t\t\t\t\t\u003c/tr\u003e\r\n\t\t\t\t\t\u003ctr\u003e\r\n\t\t\t\t\t\t\u003ctd\u003e\u003csmall\u003eNacionalidad\u003c/small\u003e\u003c/td\u003e\r\n\t\t\t\t\t\t\u003ctd\u003e\u003cb\u003e\u003csmall\u003e\u003cspan id=\"ctl01_lblNacionCapitan\"\u003e\u003c/span\u003e\u003c/small\u003e\u003c/b\u003e\u003c/td\u003e\r\n\t\t\t\t\t\u003c/tr\u003e\r\n\t\t\t\t\u003c/tbody\u003e\r\n\t\t\t\u003c/table\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e\r\n\t\u003cdiv class=\"panel panel-default\"\u003e\r\n\t\t\u003cdiv class=\"panel-heading\"\u003e\r\n\t\t\t\u003ch3 class=\"panel-title\"\u003eInformacion Guardia\u003c/h3\u003e\r\n\t\t\u003c/div\u003e\r\n\t\t\u003cdiv class=\"panel-body\"\u003e\r\n\t\t\u003ctable class=\"table table-striped table-bordered table-hover\"\u003e\r\n\t\t\u003ctbody\u003e\r\n\t\t\u003ctr\u003e\r\n\t\t\u003ctd\u003e\u003csmall\u003eBuque\u003c/small\u003e\u003c/td\u003e\r\n\t\t\u003ctd\u003e\u003cb\u003e\u003csmall\u003e\u003cspan id=\"ctl01_lblNomBarco\"\u003eUSQAY       @@@@@@@@\u003c/span\u003e\u003c/small\u003e\u003c/b\u003e\u003c/td\u003e\r\n\t\t\u003c/tr\u003e\r\n\t\t\u003ctr\u003e\r\n\t\t\u003ctd\u003e\u003csmall\u003eInicio Guardia\u003c/small\u003e\u003c/td\u003e\r\n\t\t\u003ctd\u003e\u003cb\u003e\u003csmall\u003e\u003cspan id=\"ctl01_lblDateGuardia\"\u003e\u003c/span\u003e\u003c/small\u003e\u003c/b\u003e\u003c/td\u003e\u003c!-- lblDateGuardia !--\u003e\r\n\t\t\r\n\t\t\u003c/tr\u003e\r\n\t\t\u003ctr\u003e\r\n\t\t\u003ctd\u003e\u003csmall\u003eHoras de Guardia\u003c/small\u003e\u003c/td\u003e\r\n\t\t\u003ctd\u003e\u003cb\u003e\u003csmall\u003e\u003cspan id=\"ctl01_lblHrsGuardia\"\u003e\u003c/span\u003e\u003c/small\u003e\u003c/b\u003e\u003c/td\u003e\u003c!-- lblHrsGuardia !--\u003e\r\n\t\t\r\n\t\t\u003c/tr\u003e\r\n\t\t\u003c/tbody\u003e\r\n\t\t\u003c/table\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e                  \r\n\u003c/div\u003e                \r\n\u003cdiv class=\"col-xs-12 col-md-7\"\u003e\r\n\t\u003cdiv class=\"panel panel-default\"\u003e\r\n\t\t\u003cdiv class=\"panel-heading\"\u003e\r\n\t\t\t\u003ch3 class=\"panel-title\"\u003eInformacion de Tripulacion\u003c/h3\u003e\r\n\t\t\u003c/div\u003e\r\n\t\t\u003cdiv class=\"panel-body\"\u003e\r\n            \u003cdiv class=\"form-group\" id=\"divTripulacion\"\u003e\r\n                \u003ctable class=\"table table-condensed table-striped table-bordered table-hover\" cellspacing=\"0\" rules=\"all\" border=\"1\" id=\"tbTripulacion\" style=\"font-size:11pt;border-collapse:collapse;\"\u003e\r\n\t\u003ctr\u003e\r\n\t\t\u003ctd style=\"font-weight:bold;\"\u003eNombres\u003c/td\u003e\u003ctd style=\"font-weight:bold;\"\u003eCargo\u003c/td\u003e\u003ctd style=\"font-weight:bold;\"\u003eTítulo\u003c/td\u003e\u003ctd\u003eFoto\u003c/td\u003e\r\n\t\u003c/tr\u003e\r\n\u003c/table\u003e\r\n            \u003c/div\u003e\r\n\t\t\u003c/div\u003e\r\n\t\u003c/div\u003e                  \r\n\u003c/div\u003e\r\n        \u003c!-- Modal de mantenimiento !--\u003e\r\n        \u003c!--div class=\"modal fade in\" id=\"mdlAgregar\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mdlAgregar\"\u003e\r\n            \u003cdiv class=\"modal-dialog\"\u003e\r\n                \u003cdiv class=\"modal-content\"\u003e\r\n                    \u003cdiv class=\"modal-header\"\u003e\r\n                        \u003clabel\u003eSeleccionar tripulantes\u003c/label\u003e\r\n                        \u003cbutton type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" aria-labelledby=\"mdlAgregar\"\u003e\u003cspan aria-hidden=\"true\"\u003e×\u003c/span\u003e\u003c/button\u003e\r\n                    \u003c/div\u003e\r\n                    \u003cdiv class=\"modal-body\"\u003e\r\n                        \u003clabel\u003eLista de personas disponibles:\u003c/label\u003e\u003cbr /\u003e\r\n                        \u003ctable class=\"table table-stripped table-condensed table-bordered\"\u003e\r\n                            \u003ctr\u003e\r\n                                \u003ctd\u003eNombre 1\u003c/td\u003e\u003ctd\u003e\u003cinput type=\"checkbox\" data-id=\"1\" /\u003e\u003c/td\u003e\r\n                            \u003c/tr\u003e\r\n                            \u003ctr\u003e\r\n                                \u003ctd\u003eNombre 2\u003c/td\u003e\u003ctd\u003e\u003cinput type=\"checkbox\" data-id=\"2\" /\u003e\u003c/td\u003e\r\n                            \u003c/tr\u003e\r\n                            \u003ctr\u003e\r\n                                \u003ctd\u003eNombre 3\u003c/td\u003e\u003ctd\u003e\u003cinput type=\"checkbox\" data-id=\"3\" /\u003e\u003c/td\u003e\r\n                            \u003c/tr\u003e\r\n                        \u003c/table\u003e\r\n                    \u003c/div\u003e\r\n                    \u003cdiv class=\"modal-footer\"\u003e\r\n                        \u003cbutton id=\"btnGuardarTripulacion\" type=\"button\" class=\"btn btn-primary\"\u003e\u003ci class=\"glyphicon glyphicon-hdd\"\u003e\u003c/i\u003e Guardar\u003c/button\u003e\r\n                    \u003c/div\u003e\r\n                \u003c/div\u003e\r\n            \u003c/div\u003e\r\n        \u003c/div!--\u003e\r\n        \u003c!--button class=\"btn btn-danger btn-sm\" onclick=\"eliminar(this)\" type=\"button\" data-id=\"\"\u003e\r\n                \u003ci class=\"glyphicon glyphicon-remove\"\u003e\u003c/i\u003e Eliminar\r\n        \u003c/button!--\u003e\r\n\u003c/div\u003e"};
        //$$("#tabnavetripulation").append(r.d);

        /*$$.ajax({
            type: "POST",
            url: "MyTracking.aspx/GetUcCrewList",
            data: '{id_company: ' + id_company + ', id_ship: ' + id_ship + ', nom_barco:"' + shipname + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                $$("#tripulacion").append(r.d);
            },
            failure: function (response) {
                alert(response);
            }
        });*/
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