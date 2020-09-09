 
function createMap(earthquakes, legend) {
    // Create a baseMaps object to hold the lightmap layer
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY,
        crossOrigin: true,
    });

    var street = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var overlayMaps = {
        "Past Weeks Earthquakes": earthquakes
    };

    // Create the map object with options
    var baseMaps = {
        "Light Map": light,
        "Street": street
    };

    var mymap = L.map("map", {
        center: [37.0902, -98.5795],
        zoom: 4,
        layers: [light, earthquakes]
    });
   
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(mymap)
    legend.addTo(mymap)
}

function createEQMarkers(response) {
    var event = response.features

    var EQMarkers =  []

    function chooseColor(magnitude) {
        return magnitude < 1?"green":
            magnitude < 2?"#90EE90":
            magnitude < 3?"yellow":
            magnitude < 4?"orange":
            magnitude < 5?"#FF4500":
            "red";
        
    }
    
    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd =function(map) {
        var div = L.DomUtil.create('div', 'info legend')
        var grades = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style=background:'+ chooseColor(grades[i]) +';></i >'+grades[i] + (grades[i + 1] ?'&ndash;'+grades[i + 1] + '<br>' : '+');
            }
        return div;
    };


    for (var i = 0; i < event.length; i++) {
        var cords = event[i].geometry;
        var mag = event[i].properties

        var EQMarker = L.circle([cords.coordinates[1], cords.coordinates[0]], {
            stroke: true,
            weight: .3,
            fillOpacity: 0.4,
            color: "black",
            fillColor: chooseColor(mag.mag),
            radius: mag.mag *35000
        }).bindPopup("<h3> Location: " + mag.place + "<h3> Magnitude: " + mag.mag + "<h3>");
    
        EQMarkers.push(EQMarker);
        // console.log(cords.coordinates[1])
    }
    // console.log(EQMarkers)
    createMap(L.layerGroup(EQMarkers), legend)
}



var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json( url, createEQMarkers);








// .legend {
//     position: absolute;
//     bottom: 20px;
//     right: 10px;
//     line - height: 18px;
//     color: #555;
//     border - radius: 10px;
//     background: rgba(255, 255, 255, 0.8);
//     box - shadow: 0 0 15px rgba(0, 0, 0, 0.2);
//     border - radius: 5px;
//     padding: 10px;
//     width: 100px;
//     font: 14px / 16px Arial, Helvetica, sans - serif;
//     line - height: 18px;
//     color: #555;
// }
// 	.legend i {
//     width: 18px;
//     height: 18px;
//     float: left;
//     margin - right: 8px;
//     opacity: 0.7;
// }