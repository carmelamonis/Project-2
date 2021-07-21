var myMap = L.map("map-id", {
  center: [30.7, -93.95],
  zoom: 5
}); 

function a(){
  d3.json('/api/mass_shootings').then(function(data) {
    var markers = L.markerClusterGroup();
    myMap.eachLayer(function (layer) {
      myMap.removeLayer(layer);
  });
  
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
  }).addTo(myMap);

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
}

a()

function b(){
  myMap.eachLayer(function (layer) {
    myMap.removeLayer(layer);
});
d3.json('/api/mass_shootings').then(function(data) {
  d3.json('/static/js/gz_2010_us_040_00_5m.json').then(function(region_data){
  var region_features = region_data.features
  // console.log(region_features[0]["geometry"])
  // L.polygon(region_features[0]["geometry"]["coordinates"][0],{color:"blue"}).addTo(myMap)
    // console.log(data)
var circles = L.layerGroup()
for(i=0;i<data.length;i++){
  // console.log(data[i])
  var victims = data[i]["total_victims"]
  var injuries = data[i]["injured"]
  var fatalities = data[i]["fatalities"]
  // console.log(data[i])
  var location = data[i]["location"]
  var latitude = data[i]["latitude"]
  var longitude = data[i]["longitude"]
  // console.log(victims,injuries,fatalities,location,latitude,longitude)
  L.circleMarker([latitude,longitude],{radius:Math.sqrt(victims*10),opacity:0.5,color:"red"}).addTo(circles).bindPopup(
    `<h3>Victims:${victims},Injuries${injuries}</h3>`
  )
  L.circleMarker([latitude,longitude],{radius:Math.sqrt(fatalities*10),opacity:0.25,color:"orange"}).addTo(circles).bindPopup(
    `<h3>Victims:${victims},Injuries${injuries}</h3>`
  )
  L.polygon(region_features[0]["geometry"]["coordinates"][0],{color:"blue"}).addTo(myMap)

}
  circles.addTo(myMap)
})
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
  }).addTo(myMap);
})
}