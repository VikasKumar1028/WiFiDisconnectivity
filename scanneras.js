
var wifiscanner = require('./lib/wifiscanner.js');
var WiFiControl = require('wifi-control');
var exec = require('child_process').exec;
var util = require('util');

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



call checkWifi();

function checkWifi(){
 var chw = new XMLHttpRequest();
 var file = "http://www.google.com/";
 var r = Math.round(Math.random() * 10000);
 chw.open('HEAD', file + "?subins=" + r, false);
 try {
  chw.send();
  if (xhr.status >= 200 && xhr.status < 304) {
   return true;
  } else {
   return false;
  }
 } catch (e) {
  return false;
 }

A

A
A

D
D
D
D
D
D
D
D
D
D
D
D
D
}
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
            callback1(err, null);
            return;
        }
        callback1(null, null);
    });

function callback1(param1, iwlist){ 
  console.log("callback called");
}
