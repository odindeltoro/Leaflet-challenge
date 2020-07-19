// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Data markers should reflect the magnitude of the earthquake in their size and color (higher == larger | darker).
// Include popups that provide context for map data.

// Create a map object
let myMap = L.map('map', {
    center: [15.5994, -28.6731],
    zoom: 3
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: APIkey
}).addTo(myMap);

// Get data set from USGS
// Store API query variables past 30 days All Earthquakes
let baseURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
// Grab the data with d3
d3.json(baseURL,function(data){
// Set the data earthquakes properties to a variable
    let earthquakes = data.features;
// Loop through data anc check for earthquake magnitude property and set markers color according to intervals (0-1,1-2,2-3,3-4,4-5,5+)
    for (let i = 0; i < earthquakes.length; i++) {
// Conditionals for earthquake magnitude points
    let color = '';
    if (earthquakes[i].properties.mag <= 1) {
      color = '#00CC99';
    }
    else if (earthquakes[i].properties.mag <= 2) {
      color = '#00FF99';
    }
    else if (earthquakes[i].properties.mag <= 3) {
        color = '#FFFF99';
    }
    else if (earthquakes[i].properties.mag <= 4) {
        color = '#FFFF33';
      }
    else if (earthquakes[i].properties.mag <= 5) {
        color = '#FF9900';
      }
    else {
      color = '#FF6600';
    }
// Add circles to map according to geometry coordinates
  L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
    fillOpacity: 0.75,
    color: '',
    fillColor: color,
// Adjust radius of circle according to magnitude
    radius: earthquakes[i].properties.mag * 10000
// Include popups that provide magnitude and place.
  }).bindPopup("<h1>" + earthquakes[i].properties.place + "</h1> <hr> <h2>Magnitude: " + earthquakes[i].properties.mag + "</h2>").addTo(myMap);
}
// Include legend control to show earthquake intervals
function magcolor(mag) {
  if (mag <= 1) {
      return "#00CC99";
  } else if (mag <= 2) {
      return "#00FF99";
  } else if (mag <= 3) {
      return "#FFFF99";
  } else if (mag <= 4) {
      return "#FFFF33";
  } else if (mag <= 5) {
      return "#FF9900";
  } else {
      return "#FF6600";
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
});

