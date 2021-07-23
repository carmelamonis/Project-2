var myMap = L.map("map-id", {
  center: [30.7, -93.95],
  zoom: 5
}); 

function a(){
  myMap.eachLayer(function (layer) {
    myMap.removeLayer(layer);
  });
  
  //Load tile layer/base map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    }).addTo(myMap);
  
  //create cluster group and subgroups
  var mcg = L.markerClusterGroup(),
    g1 = L.featureGroup.subGroup(mcg),
    g2 = L.featureGroup.subGroup(mcg),
    g3 = L.featureGroup.subGroup(mcg),
    g4 = L.featureGroup.subGroup(mcg),
    g5 = L.featureGroup.subGroup(mcg),
    g6 = L.featureGroup.subGroup(mcg),
    g7 = L.featureGroup.subGroup(mcg)
  
  mcg.addTo(myMap);
  
  //Create overlays from subgroups
  var overlays = {
    "Workplace": g1,
    "School": g2,
    "Military": g3,
    "Religious": g4,
    "Airport": g5,
    "Other": g6,
    "Unknown" : g7
  };
  
  //Add control to map
  L.control.layers(null, overlays).addTo(myMap);
  
  d3.json('/api/mass_shootings').then(function(data) {
  
      //Loop through data
      for (var i=0; i < data.length; i++) {
        
        var location = data[i].location;
        //console.log(location);
        var lat = +data[i].latitude;
        var lon = +data[i].longitude;
  
        var newMarker = L.marker([lat, lon]);
  
          if (data[i].location == "Workplace") {
            newMarker.addTo(g1);
          }
    
          else if (data[i].location == "School") {
            newMarker.addTo(g2);
          }
    
          else if (data[i].location == "Military") {
            newMarker.addTo(g3);
          }
    
          else if (data[i].location == "Religious") {
            newMarker.addTo(g4);
          }
    
          else if (data[i].location == "Airport") {
            newMarker.addTo(g5);
          }
    
          else if (data[i].location == "Other") {
            newMarker.addTo(g6);
          }
    
          else if (data[i].location == "Unknown") {
            newMarker.addTo(g7);
          }
          
          //Add the facts in the popup
          newMarker.bindPopup("<h5>Case: " + data[i].case + "</h5> <hr>"
           + "<p><b>Location:</b> " + data[i].city + ", " + data[i].state //+ "</dd>"
           + "<br><b>Date: </b>" + data[i].date //+ "</dd>"
           + "<br><b>Fatalities: </b>" + data[i].fatalities //+ "</dd>"
           + "<br><b>Injured: </b>" + data[i].injured// + "</dd>"
           + "<br><b>Race of Shooter: </b>" + data[i].race// + "</dd>"
           + "<br><b>Age of Shooter: </b>" + data[i].age_of_shooter// + "</dd>"
           + "<br><b>Summary: </b>" + data[i].summary// + "</dd>"
           );
  
          } //end of for loop
      } //end of then
    ); //end of json
  
    g1.addTo(myMap);
    g2.addTo(myMap);
    g3.addTo(myMap);
    g4.addTo(myMap);
    g5.addTo(myMap);
    g6.addTo(myMap);
    g7.addTo(myMap);
  
}; //end of function

a()

function b(){
  myMap.eachLayer(function (layer) {
    myMap.removeLayer(layer);
});
d3.json('/api/mass_shootings').then(function(data) {
// console.log(data)
var circles = L.layerGroup()
for(i=0;i<data.length;i++){
  console.log(data[i])
  var victims = data[i]["total_victims"]
  var injuries = data[i]["injured"]
  var fatalities = data[i]["fatalities"]
  // console.log(data[i])
  var location = data[i]["location"]
  var latitude = data[i]["latitude"]
  var longitude = data[i]["longitude"]
  console.log(victims,injuries,fatalities,location,latitude,longitude)
  L.circleMarker([latitude,longitude],{radius:Math.sqrt(victims*10),opacity:0.5,color:"red"}).addTo(circles).bindPopup(
    `<h3>Victims:${victims},Injuries${injuries}</h3>`
  )
  L.circleMarker([latitude,longitude],{radius:Math.sqrt(fatalities*10),opacity:0.25,color:"orange"}).addTo(circles).bindPopup(
    `<h3>Victims:${victims},Injuries${injuries}</h3>`
  )
}
  circles.addTo(myMap)
})
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
  }).addTo(myMap);
}