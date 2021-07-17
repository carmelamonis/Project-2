var myMap = L.map("map-id", {
  center: [30.7, -93.95],
  zoom: 5
}); 


var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
  }).addTo(myMap);


d3.json('/api/mass_shootings').then(function(data) {
var markers = L.markerClusterGroup();

//Loop through data
for (var i=0; i < data.length; i++) {
  //console.log(data[i].case);
  var lat = +data[i].latitude;
  var lon = +data[i].longitude;
  var location = [lat, lon];  
  
  markers.addLayer(L.marker([lat, lon])
  .bindPopup("<h5>Case: " + data[i].case + "</h5> <hr>"
   + "<dd><b>Location:</b> " + data[i].city + ", " + data[i].state + "</dd>"
   + "<dd><b>Fatalities: </b>" + data[i].fatalities + "</dd>"
   + "<dd><b>Injured: </b>" + data[i].injured + "</dd>"
   + "<dd><b>Race of Shooter: </b>" + data[i].race + "</dd>"
   + "<dd><b>Age of Shooter: </b>" + data[i].age_of_shooter + "</dd>"
   + "<dd><b>Summary: </b>" + data[i].summary + "</dd>"));
}

myMap.addLayer(markers);
});

