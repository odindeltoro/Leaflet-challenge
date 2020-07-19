// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Data markers should reflect the magnitude of the earthquake in their size and color (higher == larger | darker).
// Include popups that provide context for map data.

// Get tectonic plates data
let platesData = 'static/data/tectonicplates-master/GeoJSON/PB2002_plates.json';
// Grab the data with d3
d3.json(platesData,function(response){
  plates = L.geoJSON(response,{  
      style: function(feature){
          return {
              color:'#990000',
              fillColor: '#990000',
              fillOpacity: 0
          }
      },      
// Add lines to map according to geometry coordinates
      onEachFeature: function(feature,layer){
          console.log(feature.coordinates);
          layer.bindPopup('Plate Name: ' + feature.properties.PlateName);
      }   
  });
// Get data set from USGS
// Store API query variables past 30 days All Earthquakes
let baseURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
// Grab the data with d3
d3.json(baseURL,function(data){
// Set the data earthquakes properties to a variable
  createFeatures(data.features);
});
// Include popups that provide magnitude and place.
function createFeatures(earthquakeData){
  function onEachFeature(feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><h4>Magnitude:" + feature.properties.mag + "</h4>");
  }
// Adjust radius of circle according to magnitude
  function style(feature){
      return {
          radius: 1.5 * feature.properties.mag,
          fillColor: chooseColor(feature.properties.mag),
          color: '',
          fillOpacity: 0.75,
          
      };
  }
// Conditionals for earthquake magnitude points
   function chooseColor(mag){
      switch(true){
          case mag <=1 :
              return '#00CC99';
          case mag <=2 :
              return '#00FF99';
          case mag <= 3:
              return '#FFFF99';
          case mag <= 4:
              return '#FFFF33';
          case mag <= 5:
              return '#FF9900';
          default:
              return '#FF6600';
      }
  };
// Add circles to map according to geometry coordinates
let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
   pointToLayer: function (feature, latlng) {
       return L.circleMarker(latlng);
   },
  style: style
});

// Create a GeoJSON layer containing the features
    chooseMap(earthquakes,plates)
};

// choose map function
function chooseMap(earthquakes,plates){

// Define map layers
  let satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/satellite-v9",
      accessToken: APIkey
  });
  let lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/light-v10",
      accessToken: APIkey
  });
  let outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox/outdoors-v11",
      accessToken: APIkey
  });

// Define baseMaps
  let baseMaps = {
      'Satellite':satelliteMap,
      'Light': lightMap,
      'Outdoor':outdoorMap
  };

// Create overlay object
  let overlayMaps = {
      'Earthquakes': earthquakes,
      'Tectonic plates': plates 
  };

// Create a map object
  let myMap = L.map('map', {
      center: [15.5994, -28.6731],
      zoom: 2,
      layers: [satelliteMap, plates, earthquakes]
  });

// Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

// Include legend control to show earthquake intervals
function magcolor(mag) {
  if (mag <= 1) {
      return '#00CC99';
  } else if (mag <= 2) {
      return '#00FF99';
  } else if (mag <= 3) {
      return '#FFFF99';
  } else if (mag <= 4) {
      return '#FFFF33';
  } else if (mag <= 5) {
      return '#FF9900';
  } else {
      return '#FF6600';
  };
}
let legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let intervals = [0,1,2,3,4,5];
// Loop through magnitude intervals and generate a label with the colored square for each interval
  for(let i = 0; i < intervals.length; i++){
    div.innerHTML += '<i style="background:' + magcolor(intervals[i] + 1) + '"></i> ' + 
    + intervals[i] + (intervals[i + 1] ? ' - ' + intervals[i + 1] + '<br>' : ' + ');
  }
return div;
};
legend.addTo(myMap);
}});