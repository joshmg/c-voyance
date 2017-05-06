const rp = require('request-promise');
const fs = require('fs');
const _ = require('lodash');

var dataOptions = {
    uri: 'http://smrtsandbox.com:8080/rest/easton-parking-data/getSensors',
    method: 'POST',
    body: {
	   apiKey: '0f9d2a84-c2ee-411d-ab27-ec136a830c57'
    },
    json: true
};

var mapOptions = {
    uri: 'https://www.google.com/maps/api/geocode/json',
    qs: {
        address: ''
    },
    json: true
};

var mappedZones = {};
    
rp(dataOptions)
    .then(function (parsedBody) {
        var zones = parsedBody.sensorZones;
        _.forOwn(zones, function(value, key) {
            mapOptions.qs.address = value + ',+Columbus,+OH';
            rp(mapOptions)
                .then(function (parsedBody) {
                    var mappedZone = new Object();
                    if (typeof parsedBody.results[0] !== 'undefined') {
                        mappedZone.location = new Object();
                        mappedZone.location.northeast = parsedBody.results[0].geometry.viewport.northeast;
                        mappedZone.location.southwest = parsedBody.results[0].geometry.viewport.southwest;
                        mappedZones[value] = mappedZone;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    var outputFile = "../www/data/mappedZones.json";
                    fs.truncate(outputFile, 0, function() {
                        fs.writeFile(outputFile, JSON.stringify(mappedZones), function(err) {
                            if (err) throw err;
                        });
                    });
                });            
        });
    })
    .catch(function (err) {
        console.log(err);
    });