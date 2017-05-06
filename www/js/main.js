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

        postJson(
            "http://smrtsandbox.com:8080/rest/easton-parking-data/getTrafficCounts",
            {
                "apiKey": "cd914c64-08e2-4245-84a9-8d767a299425",
                "sensor_group": "",
                "sensor_zone": "31 Fenlon St S",
                "start_time": "2017-01-01T00:00:00-0500",
                "end_time": "2017-01-31T23:00:00-0500"
            },
            function(data) {
                console.log(data);
            }
        );
    });
});

