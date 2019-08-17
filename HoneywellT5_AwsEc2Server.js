// Author: Jordan Randleman - AWS EC2 Server to Interface w/ Honeywell T5 Thermostat
const moment = require('moment-timezone');
const request = require('request');
const express = require('express');
var app = express();

/******************************************************************************/
// GLOBAL VARIABLES / VARIABLE CREATION FUNCTIONS
/******************************************************************************/

function getReqCode(reqUrl) {
  var codeIndex = reqUrl.indexOf('?code=') + 6, scopeIndex = reqUrl.lastIndexOf('&');
  if(codeIndex === -1) return null;
  return reqUrl.slice(codeIndex, (scopeIndex > codeIndex) ? scopeIndex : reqUrl.length);
}
function base64Encode(str) { return Buffer.from(str).toString('base64'); }
const heatAttrib = "heatSetpoint", coolAttrib = "coolSetpoint", scheduleAttrib = "thermostatSetpointStatus";
const apiKey = "n0TactUalAPik3yBuTN1c3TrYmYdUd3S", apiSecret = "Uw15hiDK3pt1TL0l";
const redirUri = 'http://ec2-31-65-801-312.us-west-1.compute.amazonaws.com:3000/api/thermo/'; // original altered
const author64 = base64Encode([apiKey, apiSecret].join(':'));

/******************************************************************************/
// MAIN EXECUTION - GETS ACCESS_TOKEN'S & CAN COMMUNICATE WITH DEVICE
/******************************************************************************/

// Get HoneyWell API code response from req.url then make a post request with appropriate requestOptions.
app.get('/api/thermo/', (req, res) => { // Post to server with /extension/  after':3000'
  var reqCode = getReqCode(req.url);
  if(!reqCode) { res.send('NEW CODE-COINTAINING URL FORMAT!'); return; }
  getToken(reqCode).then((access_token) => { // GENERATE NEW ACCESS_TOKEN
    res.send(`access_token: ${access_token}`);
    res.end();

     getLocationId(access_token).then((locationId) => { // GET LOCATIONID
      getDeviceInfo(access_token, locationId).then((deviceJSON) => { // GET DEVICE INFO
        var deviceId = deviceJSON[0];

        /* NEW DEVICE SETTINGS TO CHANGE T5'S OPERATION GO IN ARGUMENT BELOW !!! */

        deviceJSON = newDeviceSettings(deviceJSON[1], 'Heat', 10, 'HoldUntil', 1); // Last 2 arguments for scheduling, unused in our demo.
        postNewDeviceSettings(deviceJSON, access_token, deviceId, locationId).then((success) => {
          console.log(success);
        }).catch((err) => { console.log(err); });   
      }).catch((err) => { console.log(err); });
    }).catch((err) => { console.log(err); });

  }).catch((err) => { console.log(err); res.send('ERROR GETTING ACCESS TOKEN: ' + err); });
});

/******************************************************************************/
// TOKEN REQUEST FUNCTION
/******************************************************************************/

// Returns auth-token.
function getToken(reqCode) {
  var authorizationOptions = {
    url: 'https://api.honeywell.com/oauth2/token',
    headers: { 'Authorization': 'Basic ' + author64, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=authorization_code&code=' + reqCode + '&redirect_uri=' + redirUri
  };
  return new Promise((resolve, reject) => {
    request.post(authorizationOptions, (err, response, body) => {
      var badReq = 'Fatal Access Token Error: ' + err;
      return (err || response.statusCode != 200 || !body) ? reject(badReq) : resolve(JSON.parse(body)["access_token"]);
    });
  });
}

/******************************************************************************/
// DEVICE SETTINGS CHANGER FUNCTION
/******************************************************************************/

// Changes the device's current settings. 
// 'Menu' -> 'ChangeOver' -> 'Auto' (on the device) to enable remote changes.
function newDeviceSettings(deviceJSON, heatOrCoolMode, deltaTemp, sched, holdHours) {
  console.log(deviceJSON);
  var tempAttrib = heatAttrib, changedAttrib = 'heatSetpoint';
  if(heatOrCoolMode == 'Cool') { tempAttrib = coolAttrib; changedAttrib = 'coolSetpoint'; } // Heat or Cool.
  console.log(`OLD Device ${changedAttrib}: ${deviceJSON[tempAttrib]}`);
  if(deviceJSON["mode"] != heatOrCoolMode) deviceJSON["mode"] = heatOrCoolMode;
  if(deviceJSON["autoChangeoverActive"] === false) deviceJSON["autoChangeoverActive"] = true;
  // Following 3 lines for scheduling, unused in our demo.
  // var changeLength = moment.tz('America/Los_Angeles').add(holdHours, 'hours').startOf('Hour').format('HH:mm:ss');
  // if(deviceJSON[scheduleAttrib] != sched) deviceJSON[scheduleAttrib] = sched; 
  // if(sched == "HoldUntil") deviceJSON["nextPeriodTime"] = changeLength; // For scheduling
  deviceJSON[tempAttrib] += deltaTemp; // Change the temperature.
  console.log(`POSTING NEW Device ${changedAttrib}: ${deviceJSON[tempAttrib]}`);
  console.log(deviceJSON);
  return deviceJSON;
}

// Changes Device's New Settings.
function postNewDeviceSettings(deviceJSON, access_token, deviceId, locationId) {
  var newDeviceJSON = JSON.stringify(deviceJSON);
  var changeDeviceOptions = {
    url: 'https://api.honeywell.com/v2/devices/thermostats/' + deviceId + '?apikey=' + apiKey + '&locationId=' + locationId,
    headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' },
    body: newDeviceJSON
  };
  return new Promise((resolve, reject) => {
    request.post(changeDeviceOptions, (err, response, body) => {
      var badReq = `FATAL ERROR POSTING NEW DEVICE SETTINGS! Error: ${err}, Response Code: ${response.statusCode}`;
      var goodReq = `Successful Device Settings Change! Response Code: ${response.statusCode}`;
      return (err || response.statusCode != 200) ? reject(badReq) : resolve(goodReq);
    });
  });
}

/******************************************************************************/
// DEVICE REQUEST FUNCTIONS
/******************************************************************************/

// Returns device information (id & changeable values).
function getDeviceInfo(access_token, locationId) {
  var deviceInfoOptions = {
    url: 'https://api.honeywell.com/v2/devices/thermostats?apikey=' + apiKey + '&locationId=' + locationId,
    headers: { 'Authorization': 'Bearer ' + access_token }
  };
  return new Promise((resolve, reject) => {
    request(deviceInfoOptions, (err, response, body) => {
      if(err || response.statusCode != 200 || !body) {
        return reject('FATAL ERROR GETTING DEVICE INFO: ' + err);
      } else {
        var deviceJSON = JSON.parse(body)[0];
        var changeable = deviceJSON["changeableValues"];
        if(!changeable[heatAttrib] || !changeable[coolAttrib] || !changeable[scheduleAttrib]) {
          console.log(changeable);
          return reject('CHANGEABLE VALUES MISSING HEAT/COOL/SCHEDULING PTS!');
        }
        return resolve([deviceJSON["deviceID"], changeable]);
      }
    });
  });
}

// Returns location ID
function getLocationId(access_token) {
  var locationOptions = {
    url: 'https://api.honeywell.com/v2/locations?apikey=' + apiKey,
    headers: { 'Authorization': 'Bearer ' + access_token }
  };
  return new Promise((resolve, reject) => {
    request(locationOptions, (err, response, body) => {
      var badReq = 'FATAL ERROR GETTING LOCATION ID: ' + err;
      return (err || response.statusCode != 200 || !body) ? reject(badReq) : resolve(JSON.parse(body)[0]["locationID"]);
    });
  });
}

/******************************************************************************/
// SHOW SERVER'S UP & RUNNING
/******************************************************************************/

app.listen(3000, () => console.log('Server running on port 3000'));
