 
function createMap(earthquakes) {
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
}

function createEQMarkers(response) {
    var event = response.features

    var EQMarkers =  []

    function chooseColor(magnitude) {
        switch (true) {
            case (magnitude < 1):
                return "green"; 
            case (magnitude < 2):
                return "#90EE90";
            case (magnitude < 3):
                return "yellow";
            case (magnitude < 4):
                return "orange";
            case (magnitude < 5):
                return "#FF4500";
            default:
                return "red";
        }
    }

    for (var i = 0; i < event.length; i++) {
        var cords = event[i].geometry;
        var mag = event[i].properties

        var EQMarker = L.circle([cords.coordinates[1], cords.coordinates[0]], {
            stroke: true,
            weight: .3,
            fillOpacity: 0.4,
            color: "black",
            fillColor: chooseColor(mag.mag),
            radius: mag.mag *30000
        }).bindPopup("<h3> Location: " + mag.place + "<h3> Magnitude: " + mag.mag + "<h3>");
    
        EQMarkers.push(EQMarker);
        // console.log(cords.coordinates[1])
    }
    console.log(EQMarkers)
    createMap(L.layerGroup(EQMarkers))
}



var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json( url, createEQMarkers);

