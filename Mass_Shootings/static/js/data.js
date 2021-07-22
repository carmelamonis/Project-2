
$("button").click(function() {
  window.open("http://127.0.0.1:5000/api/mass_shootings");
});

// Get a reference to the table body
var tbody = d3.select("tbody");

// Function to get data from the CSV file, reduce data and execute table load
function init() {
  
  d3.json("/api/mass_shootings").then((massData, err) => {
    if (err) throw err;
    console.log(massData);  
    
    var newData = [];
    massData.forEach(obj => { 
      newData.push({"case": obj.case, "city": obj.city, "state": obj.state, "date": obj.date, "summary": obj.summary, 
                    "fatalities": obj.fatalities, "injured": obj.injured, "total_victims": obj.total_victims, 
                    "location": obj.location, "age_of_shooter": obj.age_of_shooter, "mental_health_issues": obj.prior_signs_mental_health_issues,
                    "obtained_legally": obj.weapons_obtained_legally, "race": obj.race, "gender": obj.gender, "type": obj.type});  
    });
    console.log(newData);

    newData.forEach(shooting => {
      var row = tbody.append("tr");
      Object.entries(shooting).forEach(([key, value]) => row.append("td").text(value));
    });
  });
}   
// Load table
init();