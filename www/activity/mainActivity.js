/*window.alert = function (txt,callback){myApp.alert(txt,callback);};*/
function isIOS() {return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);}
function onResume(){window.plugin.backgroundMode.disable();}
function onPause(){window.plugin.backgroundMode.enable();}

var statusError401=false;
$$(document).on('pageInit', function(e) {var page = e.detail.page;$$(page.container).find("script").each(function(el){eval($$(this).text());});}); var monthNamesShort =   ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago' , 'Sep' , 'Oct', 'Nov', 'Dic'];var monthNames      =   ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto' , 'Septiembre' , 'Octubre', 'Noviembre', 'Diciembre'];

var meses    = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var anios    = [(new Date()).getFullYear() - 1,(new Date()).getFullYear()];
var loadTypeInspectionAndSedes=false;
var app_error               = false;
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var SESSION                 =   new Object();
var DB;
var UPDATE_DATABASE_COUNT   = 0;

/*********************************************************************/

var app = {
    initialize: function() {
        Main.listenBackButton('index',function(){
            Main.exit();
        });

        /*$$(document).on('click','#version',function(e){
            $$(this).css("opacity","0");
        });
        */
        
        $$("#logout").on("click",function(){
            Main.logout();
        });

        moment.locale('es');
        
        if(isMobile())
        {
            if(typeof window.plugins.TaskDescriptionColor !== 'undefined')
            {
                window.plugins.TaskDescriptionColor.setColor('#ffffff','#154c77');
            }
        }
    },
    //points: [],
    loadMap: function(){
        Main.restFul(
            API + 'Ship',
            'GET',
            {},
            function(respondBody,respondHeader)
            {
                console.log("AddArrayPoint");
                ships = JSON.parse(respondBody.data.d);
                var i = 0;
                $.each(ships, function( index, ship ) {
                    i++;
                    points[index] = new Object();

                    if(typeof ship.shipname !== "undefined" && typeof ship.lat !== "undefined" && typeof ship.lon !== "undefined"){
                        points[index].title = ship.shipname;
                        points[index].position = new Object();
                        points[index].position.lat = ship.lat;
                        points[index].position.lng = ship.lon;
                    }
                    if(i==index)
                    {
                        addMarkers(map,points,function(markers){
                            var bounds = [];
                            for(var i=0; i<markers.length; i++){
                                bounds.push(markers[i].getPosition());
                            }
                            map.moveCamera({target:bounds});
                        });
                    }
                });

            }
        );
    },
    ready: function(){

        setTimeout(function(){
            $$("#backgroundLogo").hide();
        },100);//6000

        Main.backgroundTopShow();

        Main.internet(function(){
            app.loadInitLayout(function(){
                Main.backgroundTopHide();
                $$(".views").show();
                map.setVisible(false);
                mainView.router.load({
                    'url':'layout/login.html',
                    'animatePages':false
                });

                setTimeout(function(){
                    Main.backgroundTopHide();
                    $$(".views").hide();
                    map.setVisible(true);
                    app.loadMap();
                    /*mainView.router.load({
                        'url':'layout/index.html',
                        'animatePages':false
                    });*/
                },250);

            });

        },function(){

            myApp.confirm(
                "No se ha podido conectar con el servidor. Comprueba tu conexión a internet y vuelve a intentarlo.",
                "",
                function(){
                    location.reload();
                },
                function(){
                    Main.exit();
                }
            );
            $$(".modal-buttons-2 .modal-button").html("Salir");
            $$(".modal-buttons-2 .modal-button.modal-button-bold").html("REINTENTAR");
        });            
            
            //mainView.router.loadPage('layout/categoriaInspeccion.html');
            //mainView.router.loadPage('layout/nuevaInspeccion.html');
            //mainView.router.loadPage('layout/inspector.html');
            //Main.loadActivity('panelMapActivity');
        
    },
    /*loadTypeInspection: function(callbackTypeInspectionOK){
        ////console.log("loadTypeInspection");
        Main.restFul(
            API + 'api/typeInspection',
            'GET',
            {
                company: SESSION.idCompany,
            },
            function(respondBody,respondHeader)
            {
                if(typeof respondBody.success !=='undefined' && respondBody.success)
                {
                    if(typeof respondBody.data !=='undefined')
                    {
                        SESSION.listTypeInspection = respondBody.data;
                        app.loadSede(callbackTypeInspectionOK);
                    }
                    else
                    {
                        alert('Lo sentimos ocurrio un error al cargar la inspeccion');
                    }
                }
            }
        );
    },
    loadSede: function(callbackSedeOK){
        Main.restFul(
            API + 'api/sede',
            'GET',
            {
                company: SESSION.idCompany,
            },
            function(respondBody,respondHeader)
            {
                if(typeof respondBody.success !=='undefined' && respondBody.success)
                {
                    if(typeof respondBody.data !=='undefined')
                    {
                        SESSION.listSede = respondBody.data;
                        callbackSedeOK();
                    }
                    else
                    {
                        alert('Lo sentimos ocurrio un error al cargar la sede');
                    }
                }
            }
        );
    },*/
    loadInitLayout: function(callbackLayoutOK){
        ////console.log("LOAD_INIT_LAYOUT");
        //mainView.router.loadPage('layout/login.html');
        DB.query("select value from session where name='connect'",function(trans,result){
            if(result.rows.length && result.rows.item(0).value=='1')
            {
                ////console.log("LOAD_INIT_LAYOUT(2)");
                if(typeof callbackLayoutOK !=="undefined")
                {
                    callbackLayoutOK();
                }
                /*app.loadTypeInspection(function(){
                    loadTypeInspectionAndSedes=true;
                });*/

                /*
                if(typeof callbackLayoutOK !=="undefined")
                {
                    app.loadTypeInspection(callbackLayoutOK);
                }
                else
                {
                    app.loadTypeInspection(function(){});
                }*/
            }
            else
            {
                setTimeout(function(){
                    $$(".views").show();
                    map.setVisible(false);
                    mainView.router.loadPage('layout/login.html');
                    Main.backgroundTopHide();
                },1000);
            }
        });
    },
    activities:[
        'loginActivity',
        'indexActivity',
        'detalleNaveEmpresaActivity'
    ],
    saveCountQuest:[],
    saveCountCat:[],
    countIns: function(id_inspuser,callback)
    {
        app.saveCountQuest  = null;
        app.saveCountQuest  = new Array();

        app.saveCountCat    = null;
        app.saveCountCat    = new Array();

        var selectCats  = "select DISTINCT id_inspusersurv id from generalinspection where id_inspuser="+id_inspuser;
        DB.query(selectCats,function(transCat,resultCat){

            ///////////////////////////////////////////////////////////////
            var total               =   resultCat.rows.length;
            var i                   =   0;
            var next                =   true;

            var insRespond          =   0;
            var insTotal            =   0;

            var interval = setInterval(function(){
                if(next && i<total)
                {
                    next = false;

                    var id = resultCat.rows.item(i).id;
                    app.countCat(id,function(xquesRespond,xquesTotal){
                        insRespond  +=  xquesRespond;
                        insTotal    +=  xquesTotal;
                        next=true;
                    });

                    i++;
                }
                else if(next && i==total)
                {
                    console.log("INSPECCION("+id_inspuser+")=["+ insRespond +"/"+ insTotal +"]");
                    clearInterval(interval);
                    if(typeof callback !== "undefined"){
                        callback();
                    }
                    
                }
            },0.5);
            ///////////////////////////////////////////////////////////////

        });
    },
    countCat: function(id_inspusersurv,_callback){
        console.log("countCat("+id_inspusersurv+")");

        var selectQuest     = "select id_inspusersurvques id,nu_inspsurvques_son son,tx_inpsurvques_decription desc from generalinspection where id_inspusersurv="+ id_inspusersurv +" AND IFNULL(id_inspusersurvques_fk,0)=0;";
        DB.query(selectQuest,function(transQuest,resultQuest){

            ///////////////////////////////////////////////////////////////
            var total               =   resultQuest.rows.length;
            var i                   =   0;
            var next                =   true;

            var catRespond          =   0;
            var catTotal            =   0;


            var interval = setInterval(function(){
                if(next && i<total)
                {
                    next = false;

                    var id = resultQuest.rows.item(i).id;
                    var son = resultQuest.rows.item(i).son;
                    app.countsQuest(id,son,function(xquesRespond,xquesTotal){
                        catRespond  +=  xquesRespond;
                        catTotal    +=  xquesTotal;
                        next=true;
                    });

                    i++;
                }
                else if(next && i==total)
                {
                    console.log("CATEGORIA("+id_inspusersurv+")=["+ catRespond +"/"+ catTotal +"]");

                    app.saveCountCat[id_inspusersurv] = new Object();
                    app.saveCountCat[id_inspusersurv].respond = catRespond;
                    app.saveCountCat[id_inspusersurv].total     = catTotal;

                    _callback(catRespond,catTotal);
                    clearInterval(interval);
                }
            },0.5);
            ///////////////////////////////////////////////////////////////

        });
    },
    countsQuest: function(_id,_son,_callback){
        if(_son!=0)
        {
            console.log("PARENT");
            app.countsQuestParent(_id,_callback);
        }
        else
        {
            console.log("CHILD");
            app.countsQuestChild(_id,_callback);
        }
    },
    countsQuestParent: function(_id,_callback){

        selectQuestParent = "select id_inspusersurvques id,nu_inspsurvques_son son,tx_inpsurvques_decription desc from generalinspection where id_inspusersurvques_fk="+_id+";";
        
        DB.query(selectQuestParent,function(tranQuestParent,resultQuestParent){

            ///////////////////////////////////////////////////////////////
            var total               =   resultQuestParent.rows.length;
            var i                   =   0;
            var next                =   true;

            var catRespond          =   0;
            var catTotal            =   0;


            var interval = setInterval(function(){
                if(next && i<total)
                {
                    next = false;

                    var id = resultQuestParent.rows.item(i).id;
                    var son = resultQuestParent.rows.item(i).son;
                    app.countsQuest(id,son,function(xquesRespond,xquesTotal){
                        catRespond  +=  xquesRespond;
                        catTotal    +=  xquesTotal;
                        next=true;
                    });

                    i++;
                }
                else if(next && i==total)
                {
                    console.log("PREGUNTA[]("+_id+")=["+ catRespond +"/"+ catTotal +"]");
                    app.saveCountQuest[_id] = new Object();
                    app.saveCountQuest[_id].respond = catRespond;
                    app.saveCountQuest[_id].total   = catTotal;

                    clearInterval(interval);
                    _callback(catRespond,catTotal);
                }
            },0.5);
            ///////////////////////////////////////////////////////////////

            console.log("RESULT");
            
        });
    },
    countsQuestChild:function(_id,_callback){

        selectQuestChild = "select Case When bo_inspusersurvques_apply = 0 Then 0 When bo_inspusersurvques_apply = 1 Then 1 When bo_inspusersurvques_apply = 2 Then 1 When bo_inspusersurvques_apply Is Null Then 0 End as apply from generalinspection where id_inspusersurvques="+_id+";";
        DB.query(selectQuestChild,function(transQuestChild,resultQuestChild){
            apply = resultQuestChild.rows.item(0).apply
            apply = (apply==0 || apply=="")? 0:1;
            total = 1;

            app.saveCountQuest[_id] = new Object();
            app.saveCountQuest[_id].respond = apply;
            app.saveCountQuest[_id].total   = total;

            _callback(apply,total);
        });
        
    },
    llenarCountsCat: function(isEmpty){
        console.re.log("app.saveCountCat");
        console.re.log(app.saveCountCat);
        var classEmpty = "";
        if(typeof isEmpty!== "undefined" && isEmpty){
            classEmpty = ".empty";
        }else{
            isEmpty=false;
            classEmpty = "";
        }

        $$(".categoryBadge" + classEmpty).each(function(){

            $$(this).removeClass("empty");

            var id = $$(this).attr("id");
            console.log("LLENANDO CAT: " + id);
            if(typeof app.saveCountCat[id] !== "undefined")
            {
                respond = app.saveCountCat[id].respond;
                total   = app.saveCountCat[id].total;

                if(respond==total)
                {
                    $$(this).closest("li").addClass("lleno");
                }
                else
                {
                    $$(this).closest("li").removeClass("lleno");
                }
                $$(this).html(respond + "/" + total);
            }
        });
    },
    llenarCountsQuestions:function(isEmpty){
        var classEmpty = "";
        if(typeof isEmpty!== "undefined" && isEmpty){
            classEmpty = ".empty";
        }else{
            isEmpty=false;
            classEmpty = "";
        }
        $$(".questionBadge" + classEmpty).each(function(){
        //$$(".questionBadge" + classEmpty).each(function(){

            $$(this).removeClass("empty");

            var id = $$(this).attr("id");
            console.log("LLENANDO QUES: " + id);
            if(typeof app.saveCountQuest[id] !== "undefined")
            {
                respond = app.saveCountQuest[id].respond;
                total   = app.saveCountQuest[id].total;

                if(respond==total)
                {
                    $$(this).closest("li").addClass("lleno");
                }
                else
                {
                    $$(this).closest("li").removeClass("lleno");
                }
                $$(this).html(respond + "/" + total);
            }
        });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var DB          =   {

    ini: function(){
        DB.open("client","Client DataBase",5*1024*1024);

        DB.format("session",
            "resources/dtb/client_session.sql",
            function(){
                system.dbFinish();
            },
            function(){
                alert("LO SENTIMOS OCURRIO UN ERROR");
            }
        );
    },
    open:function(name,description,size){
        html5sql.openDatabase(name,description,size);
    },
    error: function(a,b){
        alert("Lo sentimos ocurrio un error interno");
        //console.log("ERROR:DB");
        console.log(a);
        console.log(b);
    },
    format: function(table,fileNameTable,resultTrue,resultFalse){
        DB.hasTable(table,function(exist){
            if(!exist)
            {
                $$.get(fileNameTable,function(sql){
                    sql = sql.replace("@UPDATE_DATABASE_MOBIL", UPDATE_DATABASE_MOBIL);
                    DB.query(sql,function(){
                        DB.hasTable(table,function(TableExist){
                            if(TableExist)
                            {
                                resultTrue();
                            }
                            else
                            {
                                resultFalse();
                            }
                        });
                    });
                });
            }
            else
            {
                resultTrue();
            }

        });
    },
    process: function(queries,functionSuccess,functionError){
        html5sql.process(
            queries,
            functionSuccess,
            functionError        
        );
    },
    hasTable: function(table,result){
        if(typeof table =="string")
        {
            DB.query("select * from sqlite_master where tbl_name='" + table + "'",function(transaction, results){
                if(typeof result == "function")
                {
                    if(results.rows.length > 0 )
                    {
                        result(true);
                    }
                    else
                    {
                        result(false,results);
                    }
                }
            });
        }
        else
        {
            console.error("ERROR AL INSTANCIAR hasTable");
        }
    },
    updateDatabase: function()
    {
        var queries_remove_tables  = new Array();
        //var count                   = 0;

        DB.query("select * from sqlite_master where type='table'",function(transaction, results){
            //.item(0)
            var x = 0;
            for(var i=0;i<results.rows.length;i++)
            {
                table = results.rows.item(i).tbl_name;

                if(table!='__WebKitDatabaseInfoTable__')
                {
                    queries_remove_tables[x] = "DROP TABLE " + table;
                    x++;
                }
            }


            if(queries_remove_tables.length)
            {

                html5sql.process(
                    queries_remove_tables,
                    function(){
                        DB.ini();
                    },
                    function(error, statement){
                        //console.error("Error: " + error.message + " when processing " + statement);
                    }
                );
            }
            else
            {
                DB.ini();
                //ready();
            }
        });
    },
    query: function(query,result){
        if(typeof query =="string")
        {
            if(typeof result == "function")
            {
                html5sql.process(query,result,this.error);
            }
            else
            {
                html5sql.process(query,function(trans,result){
                    //console.log(result);
                },this.error);
            }
        }
    },
    toArray: function(result,index){

        var returning = new Object();

        var existColum = false;

        for (var i = 0; i < result.rows.length; i++) {
            var val = result.rows.item(i);
            if(existColum || (typeof val !=='undefined' && typeof val[index] !=='undefined'))
            {
                existColum = true;
                returning[val[index]] = val;
            }
        }
        return returning;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var system                  =   {
  checkInternet: true,
  countCheckNoInternet: 0,
    ini:    function()
    {
        $$("#version").html(VERSION);
        document.addEventListener("resume", function(){
            //console.re.log("RESUME");
            //console.re.log(device);
        }, false);
        document.addEventListener("pause", function(){
            //console.re.log("PAUSE");
            //console.re.log(device);
        }, false);

        this.dbLoad();
        this.analiticCheckInternet();
        this.analiticTouchMove();
        this.analiticBackButton();
        this.analiticKeyPressCode();
        this.activitiesInitialize();
    },
    dbLoad: function(){
        DB.ini();
    },
    dbFinish: function(){
        this.sessionLoad(function(){
            app.ready();
        });
    },
    sessionLoad: function(ready)
    {
        SESSION.connect         = false;
        SESSION.updateDatabaseMobil  = '';
        SESSION.token           = '';

        SESSION.listTypeInspection = [];
        /*SESSION.user            = '';
        SESSION.namePerson      = '';
        SESSION.profile         = '';*/

        DB.query("select name,value from session;",function(trans,result){
            if(result.rows.length)
            {
                var newResult           = DB.toArray(result,"name");

                $$.each(newResult,function(ind,val){
                    if(val.name=='connect')
                    {
                        SESSION.connect     = (newResult.connect.value=="1")?true:false;
                    }
                    else
                    {
                        SESSION[val.name]   = val.value;
                    }
                });
                
                /*SESSION.updateDatabaseMobil  = (typeof newResult.updateDatabaseMobil!='undefined')?newResult.updateDatabaseMobil.value:'';
                SESSION.token           = (typeof newResult.token!='undefined')?newResult.token.value:'';
                SESSION.user            = (typeof newResult.user!=='undefined')?newResult.user.value:'';
                SESSION.namePerson      = (typeof newResult.namePerson!=='undefined')?newResult.namePerson.value:'';
                SESSION.profile         = (typeof newResult.profile!=='undefined')?newResult.profile.value:'';*/
            }else{
                alert('La aplicación detecto un problema.');
            }

            if(SESSION.updateDatabaseMobil == UPDATE_DATABASE_MOBIL)
            {
                if(typeof ready !=='undefined')
                {
                    ready();
                }
            }
            else
            {
                UPDATE_DATABASE_COUNT++;
                if(UPDATE_DATABASE_COUNT<=1)
                {
                    DB.updateDatabase();
                }
                else
                {
                    alert('Lo sentimos ocurrio un error en la aplicación');
                }

            }
        });


    },
    analiticCheckInternet: function()
    {
        setInterval(function () {
            if(window.navigator.onLine)
            {
                system.countCheckNoInternet =    0;
            }
            else
            {
                system.countCheckNoInternet++;
            }

            if(system.countCheckNoInternet>=10)
            {
                system.checkInternet       =   false;
            }
            else
            {
                system.checkInternet       =   true;
            }
        }, 100);
    },
    analiticTouchMove: function()
    {
        document.body.addEventListener('touchmove', function(e){
            for (i in listensTouchMove)
            {
                selector    =   listensTouchMove[i];
                if (e.target === $(selector)[0])
                {
                    e.preventDefault();
                }
            }
        });
    },
    analiticBackButton: function(){
        document.addEventListener('backbutton', function(e) {
            for (i in listensBackButton)
            {
                //if(Main.getPageActive()==i)
                var str = Main.getPageActive();
                var patt = new RegExp('^' + i + '$');
                if(patt.test(str))
                {
                    callback    =   listensBackButton[i];
                    callback();
                }
            }
        });
    },
    analiticKeyPressCode: function()
    {
        //document.onKeypress
        document.onkeydown = function (e)
        {
            for (i in listensKeyPressCode)
            {
                listenKeyPressCode  =   listensKeyPressCode[i];
                if(e.keyCode==listenKeyPressCode.code && e.target==$$(listenKeyPressCode.select)[0])
                {
                    listenKeyPressCode.callback();
                }
            }
        };
    },
    activitiesInitialize: function(x)
    {
        if(typeof x ==='undefined')
        {
            var x = 0;
        }

        var countActivities = (app.activities).length;

        if(countActivities>x)
        {
            var activity = app.activities[x];
            var url =   'activity/' + activity + '.js';

            $$.ajax({
                type: "GET",
                url: url,
                dataType: "text",
                success: function(data)
                {
                    var jsElm       =   document.createElement("script");
                    jsElm.type      =   "text/javascript";
                    jsElm.innerHTML =   data;
                    document.body.appendChild(jsElm);
                    if(countActivities==x+1)
                    {
                        var jsElm       =   document.createElement("script");
                        jsElm.type      =   "text/javascript";
                        jsElm.innerHTML =   'app.initialize();';
                        document.body.appendChild(jsElm);
                    }
                    if(typeof app.activities[x+1] !== 'undefined')
                    {
                        system.activitiesInitialize(x+1);
                    }

                },
                error: function(){
                    myApp.alert("Lo sentimos ocurrio un error",'',function(){});
                }
            });

        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var activities              =   new Array();
var listensTouchMove        =   new Array();
var listensBackButton       =   new Array();
var listensKeyPressCode     =   new Array();
var layoutActive            =   'index';
var Main                    =   {
    appendScript: function(pathToScript) {
        var head = document.getElementsByTagName("head")[0];
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = pathToScript;
        head.appendChild(js);
    },
    internet: function(functionON,functionOFF) {
        var checkInternet;
        if(isMobile())
        {
            var networkState            = navigator.connection.type;
            var states                  = {};
            states[Connection.UNKNOWN]  = false;
            states[Connection.ETHERNET] = true;
            states[Connection.WIFI]     = true;
            states[Connection.CELL_2G]  = true;
            states[Connection.CELL_3G]  = true;
            states[Connection.CELL_4G]  = true;
            states[Connection.CELL]     = true;
            states[Connection.NONE]     = false;
            checkInternet = states[networkState];
        }
        else
        {
            checkInternet = system.checkInternet;
        }

        if(checkInternet)
        {
            if(typeof functionON !=='undefined')
            {
                functionON();
            }
        }
        else
        {
            if(typeof functionOFF !=='undefined')
            {
                functionOFF();
            }
        }
    },
    logout: function(){
        load_map = false;
        Main.backgroundTopShow("Cerrando sesión...");
        myApp.closePanel("left");
         DB.process(
             [
                 "UPDATE session SET value='0' WHERE name='connect'",
                 "UPDATE session SET value='' WHERE name='token'",
                 "UPDATE session SET value='0' WHERE name='user'",
                 "UPDATE session SET value='0' WHERE name='idUser'",
                 "UPDATE session SET value='' WHERE name='idCompany'",
                 "UPDATE session SET value='' WHERE name='namePerson'",
                 "UPDATE session SET value='' WHERE name='profile'"
             ],
             function(){
                 Main.disablePanels(true);
                 if($$("#masterlogin").length)
                 {
                    $$("#masterlogin").show();
                     //console.log("VOLVIENDO AL LOGIN[1]");
                     var countHistory = mainView.history.length;
                     var interval;
                     var return_login = function(){
                         if(countHistory<=2)
                         {
                             setTimeout(function () {
                                 Main.backgroundTopHide();
                             },100);
                            clearInterval(interval);
                         }
                         else
                         {
                             //console.log("BACK");
                             mainView.router.back({'animatePages':false});

                            $$(".views").show();
                            map.setVisible(false);
                         }
                         countHistory--;
                     };
                     return_login();
                     interval = setInterval(return_login,210);
                 }
                 else
                 {
                    $$(".views").show();
                    map.setVisible(false);
                     //console.log("VOLVIENDO AL LOGIN[2]");
                     mainView.router.load({
                         'url':'layout/login.html',
                         'animatePages':false
                     });
                     setTimeout(function () {
                         Main.backgroundTopHide();
                     },100);
                 }

             },
             function(error, statement){
                 console.error("Error: " + error.message + " when processing " + statement);
                 Main.backgroundTopHide();
             }        
         );
    },
    backgroundTopShow: function(message,opacity){
        if(typeof message ==='undefined')
        {
            message = '<div class="spinner" style="margin-top:-50px;"></div>';
        }
        if(typeof opacity ==='undefined')
        {
            opacity = '1';
        }
        $$("#BackgroundTop .title").html(message);
        $$("#BackgroundTop").show().css("opacity",opacity);
    },
    backgroundTopHide: function(){
        $$("#BackgroundTop").hide();
    },
    isPhoneGap: function ()
    {
        var est =  (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
            if(est){
                if(typeof sqlitePlugin !=='undefined')
                {
                    return true;
                }
            }
        return false;
    },
    disablePanels: function(action)
    {
        if(typeof action === 'undefined')
        {
            var action  =   true;
        }

        if(action)
        {
            myApp.params.swipePanel = false;
        }
        else
        {
            myApp.params.swipePanel = 'left';
        }
    },
    restFulLostConection:function(loadxhr)
    {
        /*Main.backgroundTopShow(
            '<div class="imargin-top-60"><div class="icon_global">:(</div>'+
            '<div>Lo sentimos usted no cuenta con internet.</div>'
        );*/
        //alert("Conexión a internet perdida");
    },
    restFulError: function()
    {
        //alert("Conexión a internet perdida...");
        /*Main.backgroundTopShow(
            '<div class="imargin-top-60"><div class="icon_global">:(</div>'+
            '<div>Lo sentimos el servidor no se encuentra disponible.</div>'+
            '<div>Por favor, inténtelo más tarde</div></div>'
        );*/
    },
    restFul: function(_url,_type,_data,_callback,_persistence,_timeout)
    {
        if(typeof _timeout === 'undefined')
        {
            _timeout   =   15000;
        }

        if(_type=='GET')
        {
            _persistence = true;
        }

        var id = Math.floor(Math.random() * 10000) + 1;
        if(typeof _data === 'undefined')
        {
            _data   =   {};
        }
        if(typeof _persistence === 'undefined')
        {
            _persistence   =   false;
        }
        _data = ((_type=="GET")?_data:JSON.stringify(_data));

        var _headers = {"token":SESSION.token};
        var loadxhr=null;
        var nro_conections = 0;

        var intervalFunction = function() {
            nro_conections++;
            if(loadxhr!=null)
            {
                loadxhr.abort();
            }
            if(nro_conections<3)
            {
                loadxhr = Main.restFulExecute(id,_url, _type, _data, _headers, _callback,function(){
                    ////console.log("FINALIZO AJAX");
                    clearInterval(sinterval);
                });
                if(!_persistence)
                {
                    clearInterval(sinterval);
                }
            }
            else
            {
                clearInterval(sinterval);
                alert("Hay un problema de conexión, intentémoslo de nuevo",function(){
                    location.reload();
                });
            }
        };
        intervalFunction();
        if(_timeout==0)
        {
            var sinterval = setInterval(intervalFunction, _timeout);
        }
        
        return id;
    },
    restFulExecute: function(id,_url,_type,_data,_headers,_callback,_complete)
    {
        var loadxhr = $$.ajax({
            url: _url,
            type: _type,
            data: _data,
            headers: _headers,
            dataType: 'json',
            processData: false,
            contentType: 'application/json',
            success: function(data,textStatus,respondHeader)
            {   
                try{
                    var request   = {data:_data,headers:_headers};
                    var returning = {id:id,url:_url,type:_type,request:request,success:true,data:data};
                    if(isMobile())
                    {
                        console.re.info(returning);
                    }
                    else
                    {
                        console.info(returning);
                    }
                    _callback(returning,respondHeader);
                }
                catch(err)
                {
                    console.error(err,"ERROR IN SUCESS RESTFUL, ID_RESTFUL:" + id);
                }

            },
            error: function(respondHeader, textStatus, errorThrown)
            {
                _complete();
                if(respondHeader.status==0)
                {
                    Main.restFulLostConection(loadxhr);
                }
                else if(respondHeader.status==401 && !statusError401)
                {
                    //console.log("respondHeader");
                    //console.log(respondHeader);

                    //console.log("textStatus");
                    //console.log(textStatus);

                    statusError401=true;

                    if(isMobile())
                    {
                        console.re.info("REDIRECT 401");
                    }
                    else
                    {
                        console.info("REDIRECT 401");
                    }

                    
                    if(respondHeader.statusText=="NOT TOKEN")
                    {
                        alert(respondHeader.responseText,function(){
                            statusError401=false;
                            Main.logout();
                        });
                    }
                    else if(respondHeader.statusText=="TOKEN EXPIRED")
                    {
                        alert(respondHeader.responseText,function(){
                            statusError401=false;
                            Main.logout();
                        });
                    }
                    else
                    {
                        statusError401=false;
                    }
                }
                else
                {
                    var request   = {data:_data,headers:_headers};
                    var returning = {id:id,url:_url,type:_type,request:request,success:false,data:null,respondHeader:respondHeader,textStatus:textStatus,errorThrown:errorThrown};
                    console.info(returning);
                    Main.restFulError(returning,respondHeader);
                    _callback(returning,respondHeader);
                }
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
            },
            complete: function(xhr, status)
            {
                _complete();
            }
        });

        return loadxhr;
    },
    loadActivity: function (activity)
    {
        ////console.log("LOAD ACTIVITY");
        ////console.log(activity);
        if(!this.inArray(activities,activity))
        {
            activities[activities.length]   =   activity;
            console.re.log("INARRAY:" + activity);
            console.re.log(window[activity]);
            window[activity].ini();
        }
        window[activity].load();
    },
    setLayout: function(layout){
        layoutActive    =   layout;
    },
    getPageActive : function(){
        return myApp.getCurrentView().activePage.name;
    },
    getSelectPageActive: function(){
        return $$('.views .pages .page[data-page="' +  Main.getPageActive() + '"]');
    },
    loadCSS: function(name){
        var ss      =   document.createElement("link");
        ss.type     =   "text/css";
        ss.rel      =   "stylesheet";
        ss.href     =   'res/css/' + name + '.css';
        document.body.appendChild(ss);
    },
    checkLayout: function ()
    {
        return layoutActive;
    },
    listenScroll: function(callback)
    {
        Main.select(window).scroll(function (event) {
            var scroll = Main.select(window).scrollTop();
            callback(event,scroll);
        });
    },
    inArray: function (a, obj)
    {
        var i = a.length;
        while (i--) {
           if (a[i] === obj) {
               return true;
           }
        }
        return false;
    },
    on: function(event,select,callback)
    {
        Main.select("body").on(event,select,callback);
    },
    checkIntervalInternet: function(callbackOnINternet,callbackOffINternet)
    {
        setInterval(function(){
            if(system.checkInternet)
            {
                if(typeof callbackOnINternet !== 'undefined')
                {
                    callbackOnINternet();
                }
            }
            else
            {
                if(typeof callbackOffINternet !== 'undefined')
                {
                    callbackOffINternet();
                }
            }
        },1000);
    },
    listenBackButton: function(name,callback)
    {

        listensBackButton[name]   =   callback;
        //document.addEventListener('backbutton', callback, false);
    },
    select: function(select)
    {
        return $$(select);
    },
    disableTouchMove: function(selector)
    {
        /*document.body.addEventListener('touchmove', function(e){
            if (e.target === $(selector)[0])
            {
                e.preventDefault();
            }
        });*/
        listensTouchMove[listensTouchMove.length]   =   selector;
    },
    keyPressCode: function(select,code,callback)
    {
        var newId  =   listensKeyPressCode.length;
        listensKeyPressCode[newId]          =   new Array();
        listensKeyPressCode[newId].select   =   select;
        listensKeyPressCode[newId].code     =   code;
        listensKeyPressCode[newId].callback =   callback;


        /*
        document.onkeypress = function (e) {
            if(e.keyCode==code && e.target==$(select)[0])
            {
                callback();
            }
        };
        */
    },
    validateInput: function(filters)
    {
        var resultSucess    =   true;
        for(selector in filters.inputs)
        {
            var rules   =   filters.inputs[selector];
            var val     =   Main.select(selector).val();


            Main.select(selector).parent().removeClass('validationInputError');
            Main.select(selector).parent().find('.validationInputMessage').html('').hide();
            for(rule in rules)
            {
                var option = rules[rule];
                switch(rule)
                {
                    case 'required':
                        if(option[0] && val.length==0 || !option[0] && val.length>0)
                        {
                            var message = option[1];

                            Main.select(selector).parent().addClass('validationInputError');
                            Main.select(selector).parent().find('.validationInputMessage').html(message).show();
                            resultSucess = false;
                        }
                        break;
                    case 'minlength':
                        if(val.length<option[0])
                        {
                            var message = (option[1]).replace('{0}', option[0]);

                            Main.select(selector).parent().addClass('validationInputError');
                            Main.select(selector).parent().find('.validationInputMessage').html(message).show();
                            resultSucess = false;
                        }
                        break;
                    case 'maxlength':
                        if(val.length>=option[0])
                        {
                            var message = (option[1]).replace('{0}', option[0]);

                            Main.select(selector).parent().addClass('validationInputError');
                            Main.select(selector).parent().find('.validationInputMessage').html(message).show();
                            resultSucess = false;
                        }
                    break;
                    case 'email':

                    break;
                    case 'equalTo':

                    break;
                }
            }
        }
        return resultSucess;
    },
    exit: function (){
        navigator.app.exitApp();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Main.checkIntervalInternet(function(){
    Main.select("#noInternetConnection").hide();
},function(){
    Main.select("#noInternetConnection").show();
});


/*
Main.listenScroll(function(e,scroll){
    if(scroll>25)
    {
        Main.select("#listaDeEvaluaciones #title").addClass('shadow');
    }
    else
    {
        Main.select("#listaDeEvaluaciones #title").removeClass('shadow');
    }
});

Main.on("click","#listaDeEvaluaciones .row",function(){
    var selectRow = Main.select(this).parent().find(".row.select");
    if(selectRow.length)
    {
        Main.select("#listaDeEvaluaciones #lista").removeClass("modeBackground");
        Main.select(this).parent().find(".row.select").removeClass('select');
    }
    else
    {
        Main.select("#listaDeEvaluaciones #lista").addClass("modeBackground");
        Main.select(this).addClass('select');
    }

});

Main.on("click","#listaDeEvaluaciones .btnEvaluar",function(e){
    e.stopPropagation();
});

Main.on("click","#exit",function(){
    navigator.app.exitApp();
});

Main.on("click",".btnEvaluar.abierto",function(){
    Main.loadLayout('#app','listaDeEvaluados',{});
    Main.select("#listaDeEvaluaciones").hide();
});

Main.on("click",".btnEvaluar.finalizado",function(){
    Main.loadLayout('#app','listaDeEvaluados',{});
    Main.select("#listaDeEvaluaciones").hide();
});*/



//////////////////////////////////
