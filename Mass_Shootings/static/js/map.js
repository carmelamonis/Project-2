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
  var west = ["Colorado", "Wyoming", "Montana", "Idaho", "Washington", "Oregon","Utah", "Nevada", "California", "Alaska", "Hawaii"]
  var southwest = ["Texas", "Oklahoma", "New Mexico", "Arizona"]
  var midwest = ["Ohio", "Indiana", "Michigan", "Illinois", "Missouri", "Wisconsin", "Minnesota","Iowa", "Kansas", "Nebraska", "South Dakota", "North Dakota"]
  var southeast = ["West Virginia", "Virginia", "Kentucky", "Tennessee", "North Carolina","South Carolina", "Georgia", "Alabama", "Mississippi", "Arkansas","Louisiana", "Florida"] 
  var northeast = ["Maine", "Massachusetts", "Rhode Island", "Connecticut", "New Hampshire", "Maryland","Vermont", "New York", "Pennsylvania", "New Jersey", "Delaware", "D.C."]
  
  var region_features = region_data.features

  var west_layer = L.layerGroup()
  var southwest_layer = L.layerGroup()
  var midwest_layer = L.layerGroup()
  var southeast_layer = L.layerGroup()
  var northeast_layer = L.layerGroup()
  // console.log(region_data)
  // L.geoJSON(region_data).addTo(myMap)
  // console.log(region_data)

  for(i=0;i<region_features.length;i++){
  var state_name = region_features[i]["properties"]["NAME"]

  if(west.includes(state_name) === true){
    console.log("we")
    L.geoJSON(region_features[i],{color:"purple"}).addTo(west_layer)
  }
  else if(southwest.includes(state_name) === true){
    console.log("sw")
    L.geoJSON(region_features[i],{color:"yellow"}).addTo(southwest_layer)
  }
  else if(midwest.includes(state_name) === true){
    console.log("mw")
    L.geoJSON(region_features[i],{color:"pink"}).addTo(midwest_layer)
  }
  else if(southeast.includes(state_name) === true){
    console.log("se")
    L.geoJSON(region_features[i],{color:"white"}).addTo(southeast_layer)
  }
  else if(northeast.includes(state_name) === true) {
    console.log("ne")
    L.geoJSON(region_features[i],{color:"blue"}).addTo(northeast_layer)

  }}
  west_layer.addTo(myMap)
  northeast_layer.addTo(myMap)
  southeast_layer.addTo(myMap)
  midwest_layer.addTo(myMap)
  southwest_layer.addTo(myMap)
  

  // L.geoJSON(region_features[0]).addTo(myMap).bindPopup(state_name)

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

}
// L.polygon(region_features[0]["geometry"]["coordinates"][0],{color:"blue"}).addTo(myMap)
// console.log(region_features)

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