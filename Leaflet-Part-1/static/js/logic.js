// Creating map object
var myMap = L.map("map", {
      center: [33.3943, -104.5230],
    zoom: 6
  });
  
  //Gray Mapbox background
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Load in geojson data
  var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // var geojson;
  
  //Grab data with d3
  d3.json(geoData, function (data) {
  
    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  
    // This function determines the color of the marker based on the magnitude of the earthquake.
    function getColor(magnitude) {
      switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
      }
    }
  
    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 4;
    }
  
  
    L.geoJson(data, {
  
      pointToLayer: function (feature, latlong) {
        return L.circleMarker(latlong);
      },
  
      style: styleInfo,
  
  
  
      // Binding a pop-up to each layer
      onEachFeature: function (feature, layer) {
  
        layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
      }
    }).addTo(myMap);
  
    //add legend on Bottom Right Corner
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (map) {
      //Dom Utility that puts legend into DIV & Info Legend
      var div = L.DomUtil.create('div', 'info legend'),
        //Magnitude Grades, stops at 5 magnitude
        grades = [0, 1, 2, 3, 4, 5];
  
      //Legend Label Earthquake <break> Magnitude  
      div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          //HTML code with nbs(non-breaking space) and ndash
          '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
    //Adds Legend to myMap
    legend.addTo(myMap);
  
  });