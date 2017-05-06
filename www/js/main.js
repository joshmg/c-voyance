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

function postJson(url, json, callback) {
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: callback,
        failure: callback
    });
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
        var date = $("#datepicker").val().replace(" ", "T") + "-0500";

        // "http://smrtsandbox.com:8080/rest/easton-parking-data/getTrafficCounts"

        postJson(
            "//smart-columbus.softwareverde.com/rest/easton-parking-data/getTrafficCounts/",
            {
                "apiKey":       "0f9d2a84-c2ee-411d-ab27-ec136a830c57",
                "sensor_group": "",
                "sensor_zone":  "31 Fenlon St S"
            },
            function(data) {
                console.log(data);
            }
        );
    });
});

