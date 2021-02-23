var previousValue = [];
var previousLength = 0;
google.charts.load("current", {
    packages: ['corechart']
});
google.charts.setOnLoadCallback(refreshItems);
$(document).ready(function () {


    // Fetch the initial table
    refreshItems();

    // Fetch every 1 second
    setInterval(refreshItems, 1000);
});

function refreshItems() {
    var url = "https://spreadsheets.google.com/feeds/list/1nXS8Yt_g43kDDVGP4A8GmCnC32Mz_tguSjljr2f4A3Y/1/public/full?alt=json"
    var graph_arr = [
        ['Order ID', 'Time Taken', {
            role: 'style'
        }]
    ];
    var bar_color = [];
    var jsonDataObject = [];
    var jsonMapObject = [];
    var container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }
    var map = L.map('map').setView([20.5937, 78.9629], 4);


    $.getJSON(url, function (data) {
        var currentValue = [];
        var flag = false;
        for (var i = 0; i < data.feed.entry.length; i++) {
            var obj = {
                "Dispatched": data.feed.entry[i].gsx$dispatched.$t,
                "Shipped": data.feed.entry[i].gsx$shipped.$t
            }

            currentValue.push(obj);
        }
        for (var i = 0; i < data.feed.entry.length; i++) {

            if (previousLength != data.feed.entry.length) {
                break;
            }
            if (previousValue[i].Dispatched != data.feed.entry[i].gsx$dispatched.$t || previousValue[i].Shipped != data.feed.entry[i].gsx$shipped.$t) {
                flag = true;
                break;
            }
        }


        var trHTML = '';
        if (previousLength != data.feed.entry.length || flag == true) {

            previousLength = data.feed.entry.length;
            previousValue = currentValue;
            console.log(previousValue)

            //table
            for (var i = 0; i < data.feed.entry.length; ++i) {
                var myData_map, myData_order;

                var json_data2 = {
                    "City": data.feed.entry[i].gsx$city.$t,
                    "OderID": data.feed.entry[i].gsx$orderid.$t,
                    "Item": data.feed.entry[i].gsx$item.$t,
                    "Latitude": parseFloat(data.feed.entry[i].gsx$latitude.$t),
                    "Longitude": parseFloat(data.feed.entry[i].gsx$longitude.$t),
                    "Dispatched": data.feed.entry[i].gsx$dispatched.$t,
                    "Shipped": data.feed.entry[i].gsx$shipped.$t
                };
                jsonMapObject.push(json_data2);

            }

            for (var j = 0; j < jsonMapObject.length; j++) {

                var colorIcon;

                var LeafIcon = L.Icon.extend({
                    options: {

                        iconAnchor: [20, 30]
                    }
                });

                var greenIcon = new LeafIcon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
                }),
                    redIcon = new LeafIcon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
                    }),
                    yellowIcon = new LeafIcon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png'
                    });



                if (jsonMapObject[j].Dispatched == "YES" && jsonMapObject[j].Shipped == "YES") {
                    colorIcon = greenIcon;
                } else if (jsonMapObject[j].Dispatched == "YES" && jsonMapObject[j].Shipped != "YES") {
                    colorIcon = yellowIcon;
                } else if (jsonMapObject[j].Dispatched != "YES" && jsonMapObject[j].Dispatched != "YES") {
                    colorIcon = redIcon;
                }
                var marker = L.marker(L.latLng(parseFloat(jsonMapObject[j].Latitude), parseFloat(jsonMapObject[j].Longitude)), {
                    icon: colorIcon
                }).addTo(map);

                marker.on('click', onClick_Marker)
                marker.on('mousehover')
                // Attach the corresponding JSON data to your marker:
                marker.myJsonData = jsonMapObject[j];
                console.log(marker.myJsonData)

                function onClick_Marker(e) {
                    var marker = e.target;
                    popup = L.popup()
                        .setLatLng(marker.getLatLng())
                        // .setContent("Order ID: " + marker.myJsonData.OderID + " || Item: " +
                        //     marker.myJsonData.Item)
                        .setContent(
                            "<center>" +
                            "<h2><b>" +
                            marker.myJsonData.City +
                            "</b></h2>" +
                            "<b>Order ID:</b>  " +
                            marker.myJsonData.OderID +
                            ", <b>Item:</b> " +
                            marker.myJsonData.Item +
                            "<br />" +
                            " <b>Dispatched:</b> " +
                            marker.myJsonData.Dispatched +
                            ", <b>Shipped:</b> " +
                            marker.myJsonData.Shipped +
                            "</center>"
                        )
                        .openOn(map);
                }

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);


            }


        }


    });
}