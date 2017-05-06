var SENSOR_ZONES = {"31 Fenlon St S":"31 Fenlon Street South","06 Lifetime Fitn":"06 Lifetime Fitness Parking","22 Easton Loop E":"22 Easton Loop E","08 West Garage G":"08 West Garage Ground","24 Fenlon Street":"24 Fenlon Street North","18 Regent St N":"18 Regent Street North","25 Nordstom SE":"25 Nordstom South East","39 Macy Garage":"39 Macys New Parking Garage","04 Townsfair":"04 Townsfair Way West","21 NordstromLot1":"21 Nordstrom Lot # 1","32 The Strand E":"32 The Strand East","20 The Strand N":"20 The Strand North","17 Container Sto":"17 The Container Store Parking","38 The Strand W":"38 The Strand West","37 Townsfair Way":"37 Townsfair Way East","14 Regent Street":"14 Regent Street South","36 Easton Statio":"36 Easton Station East","10 West Garage R":"10 West Garage 1st Floor","07 Easton Statio":"07 Easton Station West","23 Easton Loop E":"23 Easton Loop E","02 Easton Sq Pl":"02 Easton Square Place","16 New Bond St":"16 New Bond Street","03 Crate&Barrel":"03 Crate and Barrel","01 Easton Sq Pl":"01 Easton Square Place","26 North Park W":"26 North Parking Garage West","28 Macy E Lot N":"28 Macys Parking East Lot North","33 Garage E L1":"33 Parking Garage East Level 1","27 North Park E":"27 North Parking Garage East","19 NordstromLotS":"19 Nordstrom Lot South","35 Garage E L2":"35 Parking Garage East Level 2","11 West Garage L":"11 West Garage 1st Floor","34 Garage E L2":"34 Parking Garage East Level 2","15 Abuelos Lot":"15 Abuelos Parking Lot","13 HHGregg Front":"13 HH Gregg Front","05 Trader Joes":"05 Trader Joes Parking","12 HH Gregg Side":"12 HH Gregg Side"};
var RECTANGLES = [];

if (typeof ZONE_LOCATIONS == "undefined") {
    ZONE_LOCATIONS = {};
}

var map;
function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {
                lat: 40.0507247,
                lng: -82.9175626
            },
            zoom: 18
        }
    );
}

function hsv2rgb(h, s, v) {
  // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
    return ("0" + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
}

function moveToLocation(lat, lng){
    var center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
}

function drawRectangle(zoneName, trafficCount) {
    var bounds = {
        north: 40.0540000,
        south: 40.0542000,
        east: -82.9125000,
        west: -82.9127000
    };

    if (typeof ZONE_LOCATIONS[zoneName] == "undefined") {
        console.log("NOTE: Could not find: "+ zoneName);
        return;
    }

    var zoneLocation = ZONE_LOCATIONS[zoneName].location;
    bounds.north = zoneLocation.northeast.lat;
    bounds.south = zoneLocation.southwest.lat;
    bounds.east = zoneLocation.northeast.lng;
    bounds.west = zoneLocation.southwest.lng;

    console.log("Drawing Zone: "+ zoneName);
    console.log(bounds);
    console.log("");

    // moveToLocation(bounds.north, bounds.east);

    var assumedScale = 10; // Assuming scale is between 0 and 10.

    var occupancy = parseFloat(trafficCount.occupancy) * assumedScale;

    var hue = Math.floor((100 - occupancy) * 120 / 100);  // go from green to red
    var saturation = Math.abs(occupancy - 50)/50;   // fade to white as it approaches 50
    var rgb = hsv2rgb(hue, saturation, 1);

    var rectangle = new google.maps.Rectangle({
        strokeColor: rgb,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: rgb,
        fillOpacity: 0.35,
        map: map,
        bounds: bounds
    });

    RECTANGLES.push(rectangle);
}

function clearMap() {
    while (RECTANGLES.length > 0) {
        var rectangle = RECTANGLES.pop();
        rectangle.setMap(null);
    }
}

function postJson(url, json, callback) {
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback,
        failure: function() { }
    });
}

function addMinutes(timeString, minuteCount) {
    var oldDateObject = new Date("2000-01-01 "+ timeString);
    var newDateObject = new Date(oldDateObject.getTime() + minuteCount * 60000);

      var hours = newDateObject.getHours();
      var minutes = newDateObject.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return hours + ":" + minutes + ":00";
}

function requestTrafficCount(key, value, startTime, endTime) {

    var callback = function(data) {
        var trafficCounts = data.trafficCounts;
        for (var i in trafficCounts) {
            var trafficCount = trafficCounts[i];
            console.log("Callback for: "+ key);
            drawRectangle(value, trafficCount);
        }
    };

    postJson(
        "//smart-columbus.softwareverde.com/rest/easton-parking-data/getTrafficCounts/",
        {
            "apiKey":       "0f9d2a84-c2ee-411d-ab27-ec136a830c57",
            "sensor_group": "",
            "sensor_zone":  key,
            "start_time":   startTime,
            "end_time":     endTime
        },
        callback
    );
}

$(function() {
    $("#datepicker").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm:00",
        stepHour: 1,
        stepMinute: 5,
        stepSecond: 60
    });

    $("#control-submit").on("click", function() {
        var rawDateTime = $("#datepicker").val().trim();
        var date = rawDateTime.substring(0, 10);
        var time = rawDateTime.substring(11, 19);

        var useTimezone = true;

        var startTime = date + "T" + addMinutes(time, -20) + (useTimezone ? "-0500" : "-0000");
        var endTime = date + "T" + addMinutes(time, 40) + (useTimezone ? "-0500" : "-0000");

        // startTime = "2017-01-01T00:00:00-0500";
        // endTime = "2017-01-01T23:00:00-0500";

        clearMap();

        // "http://smrtsandbox.com:8080/rest/easton-parking-data/getTrafficCounts"
        for (var key in SENSOR_ZONES) {
            var value = SENSOR_ZONES[key];
            requestTrafficCount(key, value, startTime, endTime);
        }
    });
});

