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

$(function() {
    $("#datepicker").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm:00",
        stepHour: 1,
        stepMinute: 5,
        stepSecond: 60
    });
});

