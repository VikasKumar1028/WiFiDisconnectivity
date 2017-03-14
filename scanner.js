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

//var results = WiFiControl.connectToAP( _ap, function(err, response) {
//    if (err) console.log(err);
//    console.log(response);
//});

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

var wifiConnectionStatus = {};
var new_env = util._extend(process.env, { LANG: "en" });
console.log("Starting the application...");

console.log("Turning off Eth1...");
turnOffEth1(new_env);

console.log("sleeping...");
sleep(5000).then(function(){
	console.log("Turning on WiFi...");
	turnOnWiFi(new_env);
});

function sleep(ms){
    return(new Promise(function(resolve, reject) {
        setTimeout(function() { resolve(); }, ms);
    }));
}

function turnOnWiFi(){
   var new_env = util._extend(process.env, { LANG: "en" });
   exec('sudo ifup wlan0', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('turnOnWiFi error:'+err);
            callbackWiFiInterfaceWlan0(err,'failed');
            return;
        }
        console.log("wlan0 (WiFi) interface is up now");
        // if wlan0 (WiFi) interface if found to be successfully turned back on, then turn off eth1
        console.log("Turning off eth1...");
        turnOffEth1();
        console.log("sleeping...");
        sleep(10000).then(function(){
               callbackWiFiInterfaceWlan0(null,'success');
       } );
    });
}

function turnOffWiFi(){
    var new_env = util._extend(process.env, { LANG: "en" });
    exec('sudo ifdown wlan0', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('turnOffWiFi error:'+err);
            //callback1(err,'failed');
            return;
        }
        wifiConnectionStatus["connected"] = "false";
        // if wlan0 (WiFi) interface if found to be down, then turn on eth1
        console.log("Turning on eth1...");
        turnOnEth1();
        //callback1(null,'success');
    });
}

function turnOnEth1(){
    var new_env = util._extend(process.env, { LANG: "en" });
    exec('sudo ifconfig eth1 up', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('turnOnEth1 error:'+err);
            //callback1(err,'failed');
            return;
        }
        //callback1(null,'success');
    });
}

function turnOffEth1(){
    var new_env = util._extend(process.env, { LANG: "en" });
    exec('sudo ifconfig eth1 down', new_env, function (err, stdout, stderr) {
        if (err) {
            console.log('turnOffEth error:'+err);
            //callback1(err,'failed');
            return;
        }
        //callback1(null,'success');
    });
}

function callbackWiFiInterfaceWlan0(error, flag){ 
    try{
    console.log("callbackWiFiInterfaceWlan0 called, flag:"+flag);
    if(flag == "success"){
       wifiConnectionStatus["connected"] = "true";
       checkInternetConnectivity();
    }
    if(flag == "failed"){
       wifiConnectionStatus["connected"] = "false";
       console.log("Turning On Eth1...");
       turnOnEth1();
       reportStatus("failed");
    }
   }catch(error){
      console.log("callbackWiFiInterfaceWlan0() error:"+error);
   }
}

function checkInternetConnectivity(){
     console.log("==>checkInternetConnectivity()"); 
     var url = "https://api-aercloud-preprod.aeriscloud.com/v1";
     var accountId = "17352";
     var deviceId = "0752533678900244";
     var containerId = "fleetStream";
     var apiKey = "782f0d14-2d03-11e6-a2c1-f1d0cc517352"; 
     try{
     var httpClient2 = new HttpClient2(url, accountId, apiKey); 
     
     httpClient2.get(containerId, deviceId)
         .then(function (response) {
              console.log("GET success:"+response);
              console.log("sleeping...");
              sleep(2000)
               .then(function(){
                  // before checking the Internet connectivity, just check if the WiFi interface is "off" or not, if it's off, then try to bring it back up
                  // before we try to check trhe connectivity. This is needed as the connectivity could be on the "3G Dongle"                  
                  if(typeof wifiConnectionStatus != "undefined"){
                       console.log('wifiConnectionStatus["connected"]:'+wifiConnectionStatus["connected"]);
                       if(wifiConnectionStatus["connected"] == "false"){
                              console.log("WiFi interface is found to be down, trying to start this interface again...");
                              turnOnWiFi();
                       }else{
                  	      checkInternetConnectivity();
                       }
                  }
               });
         })
          .catch(function (error) {
              console.log("GET error:"+error);
              console.log("Internet connectivity is down...");
              console.log("shutting down wlan0(WiFi) interface...");
              turnOffWiFi();
              console.log("sleeping...");
              sleep(10000)
               .then(function(){
                 reportStatus("failed");
                 checkInternetConnectivity();
               });
         });
      }catch(error){
            console.log("checkInternetConnectivity() error:"+error);
      }
}

function reportStatus(flag){
    console.log("==>reportStatus()");
    if(flag == "failed"){
            console.log("reporting to AerCloud about the status flag:"+flag);
	    // keep on calling any url to make sure that the connectivity is there
	     var url = "https://api-aercloud-preprod.aeriscloud.com/v1";
	     var accountId = "17352";
	     var deviceId = "0752533678900244";
	     var containerId = "testContainer";
	     var apiKey = "782f0d14-2d03-11e6-a2c1-f1d0cc517352"; 
	 
	     var httpClient = new HttpClient(url, accountId, apiKey); 
             var timeStamp = (new Date()).getTime();
	     var content = '{"timestamp":'+timeStamp+', "status":"'+flag+'", "deviceId":"0752533678900244"}';
	     
	     httpClient.post(containerId, deviceId, content).
	       then(function(success){
	               console.log("success");
	            },
	            function(error){
	               console.log("error:"+error);
	            }
	       );
    }
}
