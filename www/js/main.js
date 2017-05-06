var SENSOR_ZONES = {"31 Fenlon St S":"31 Fenlon Street South","06 Lifetime Fitn":"06 Lifetime Fitness Parking","22 Easton Loop E":"22 Easton Loop E","08 West Garage G":"08 West Garage Ground","24 Fenlon Street":"24 Fenlon Street North","18 Regent St N":"18 Regent Street North","25 Nordstom SE":"25 Nordstom South East","39 Macy Garage":"39 Macys New Parking Garage","04 Townsfair":"04 Townsfair Way West","21 NordstromLot1":"21 Nordstrom Lot # 1","32 The Strand E":"32 The Strand East","20 The Strand N":"20 The Strand North","17 Container Sto":"17 The Container Store Parking","38 The Strand W":"38 The Strand West","37 Townsfair Way":"37 Townsfair Way East","14 Regent Street":"14 Regent Street South","36 Easton Statio":"36 Easton Station East","10 West Garage R":"10 West Garage 1st Floor","07 Easton Statio":"07 Easton Station West","23 Easton Loop E":"23 Easton Loop E","02 Easton Sq Pl":"02 Easton Square Place","16 New Bond St":"16 New Bond Street","03 Crate&Barrel":"03 Crate and Barrel","01 Easton Sq Pl":"01 Easton Square Place","26 North Park W":"26 North Parking Garage West","28 Macy E Lot N":"28 Macys Parking East Lot North","33 Garage E L1":"33 Parking Garage East Level 1","27 North Park E":"27 North Parking Garage East","19 NordstromLotS":"19 Nordstrom Lot South","35 Garage E L2":"35 Parking Garage East Level 2","11 West Garage L":"11 West Garage 1st Floor","34 Garage E L2":"34 Parking Garage East Level 2","15 Abuelos Lot":"15 Abuelos Parking Lot","13 HHGregg Front":"13 HH Gregg Front","05 Trader Joes":"05 Trader Joes Parking","12 HH Gregg Side":"12 HH Gregg Side"};

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

function drawRectangle(trafficCount) {
    var bounds = {
        north: 40.0540000,
        south: 40.0542000,
        east: -82.9125000,
        west: -82.9127000
    };

    var northOffset = Math.random() / 200;
    var westOffset = Math.random() / 200;

    bounds.north -= northOffset;
    bounds.south -= northOffset;
    bounds.west -= westOffset;
    bounds.east -= westOffset;

    var rectangle = new google.maps.Rectangle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        bounds: bounds
    });

    return rectangle;
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

        var useTimezone = false;

        var startTime = date + "T" + addMinutes(time, -20) + (useTimezone ? "-0500" : "-0000");
        var endTime = date + "T" + addMinutes(time, 40) + (useTimezone ? "-0500" : "-0000");

        // startTime = "2017-01-01T00:00:00-0500";
        // endTime = "2017-01-01T23:00:00-0500";

        // "http://smrtsandbox.com:8080/rest/easton-parking-data/getTrafficCounts"
        for (var sensorZone in SENSOR_ZONES) {
            var value = SENSOR_ZONES[sensorZone];
            postJson(
                "//smart-columbus.softwareverde.com/rest/easton-parking-data/getTrafficCounts/",
                {
                    "apiKey":       "0f9d2a84-c2ee-411d-ab27-ec136a830c57",
                    "sensor_group": "",
                    "sensor_zone":  sensorZone,
                    "start_time":   startTime,
                    "end_time":     endTime
                },
                function(data) {
                    var trafficCounts = data.trafficCounts;
                    for (var i in trafficCounts) {
                        var trafficCount = trafficCounts[i];
                        console.log(trafficCount);
                        drawRectangle(trafficCount);
                    }
                }
            );
        }
    });
});

