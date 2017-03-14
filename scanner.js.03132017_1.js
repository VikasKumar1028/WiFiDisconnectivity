var wifiscanner = require('./lib/wifiscanner.js');
var WiFiControl = require('wifi-control');
var exec = require('child_process').exec;
var util = require('util');
var HttpClient = require('./HttpClient.js');

var HttpClient2 = require('./HttpClient2.js');

/* Making changes */
wifiscanner.scan(function(err, data){
	if (err) {
		console.log("Error : " + err);
		return;
	}

	console.log(data);
});

var settings = {
    debug: true || false,
    iface: 'wlan0',
    connectionTimeout: 100000 // in ms
  };

WiFiControl.configure( settings );

var _ap = {
    ssid: "Aeris-India-Engg",
    password: "Aer!$En@!23"
};
var results = WiFiControl.connectToAP( _ap, function(err, response) {
    if (err) console.log(err);
    console.log(response);
});

/*
var new_env = util._extend(process.env, { LANG: "en" });
    exec('sudo ifdown wlan0', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('iwlist error:'+err);
            callback1(err, null);
            return;
        }
        callback1(null, null);
    }); */

var new_env = util._extend(process.env, { LANG: "en" });
    exec('sudo ifup wlan0', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('iwlist error:'+err);
            callback1(err,'failed');
            return;
        }
        callback1(null,'success');
    });

function callback1(error, flag){ 
  console.log("callback called");
  if(flag == "success"){
     // keep on calling any url to make sure that the connectivity is there
     var url = "https://api-aercloud-preprod.aeriscloud.com/v1";
     var accountId = "17352";
     var deviceId = "0752533678900244";
     var containerId = "fleetStream";
     var apiKey = "782f0d14-2d03-11e6-a2c1-f1d0cc517352"; 
 
     var httpClient = new HttpClient(url, accountId, apiKey); 
     var content = '{"altitude":0,"mobileIdType":"1","serviceType":"0","messageType":"2","heading":0,"satellites":0,"carrier":0,"rssi":0,"commState":0,"hdop":0,"inputs":0,"unitStatus":0,"eventIndex":0,"eventCode":"a","accums":16,"append":0,"accumulator0":"00000000","accumulator1":"00000000","accumulator2":"00000000","accumulator3":"00000000","accumulator4":"00000000","accumulator5":"00000000","accumulator6":"00000000","accumulator7":"0000049f","accumulator8":"00000001","accumulator9":"00000000","accumulator10":"00000000","accumulator11":"00000000","accumulator12":"00000000","accumulator13":"00000000","accumulator14":"00000000","accumulator15":"00000000","mobileId":"0752533678900244","updateTime":1487333860,"timeOfFix":1487333860,"latitude":23.11175111111111,"longitude":114.40929777777778,"speed":80,"fitStatus":1,"sequenceNumber":8}';
     
     httpClient.post(containerId, deviceId, content).
       then(function(success){
               console.log("success");
            },
            function(error){
               console.log("error:"+error);
            }
       );
     checkInternetConnectivity();
  }
}

function checkInternetConnectivity(){
     console.log("==>checkInternetConnectivity()"); 
     var url = "https://api-aercloud-preprod.aeriscloud.com/v1";
     var accountId = "17352";
     var deviceId = "0752533678900244";
     var containerId = "fleetStream";
     var apiKey = "782f0d14-2d03-11e6-a2c1-f1d0cc517352"; 
 
     var httpClient2 = new HttpClient2(url, accountId, apiKey); 
     
     httpClient2.get(containerId, deviceId)
         .then(function (response) {
              console.log("GET success:"+response);
              console.log("sleeping...");
              sleep(2000)
               .then(function(){
                  checkInternetConnectivity();
               });
         })
          .catch(function (error) {
              console.log("GET error:"+error);
              console.log("shutting down wlan0(WiFi) interface...");
              turnOffWiFi();
              console.log("sleeping...");
              sleep(10000)
               .then(function(){
                 checkInternetConnectivity();
               });
         });
}

function sleep(ms){
    return(new Promise(function(resolve, reject) {
        setTimeout(function() { resolve(); }, ms);
    }));
}

function turnOffWiFi(){
    var new_env = util._extend(process.env, { LANG: "en" });
    exec('sudo ifdown wlan0', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('iwlist error:'+err);
            callback1(err,'failed');
            return;
        }
        callback1(null,'success');
    });
}
