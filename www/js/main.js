var map;
function initMap() {
    map = new google.maps.Map(
        document.getElementById('map'),
        {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        }
    );
}

$(function() {
    $("#datepicker").datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "hh:mm tt",
        stepHour: 1,
        stepMinute: 5,
        stepSecond: 60
    });
});

