
$("button").click(function() {
    window.open("http://127.0.0.1:5000/api/mass_shootings");
});

// Get a reference to the table body
var tbody = d3.select("tbody");

//-----------------------------------------------------------------//
// Function to load initial table
function init() {
    // MAIN - Get data from the CSV file and execute  
    d3.json("/api/mass_shootings").then((massData, err) => {
        if (err) throw err;
        console.log(massData);

        massData.forEach(shooting => {
            var row = tbody.append("tr");
            Object.entries(shooting).forEach(([key, value]) => row.append("td").text(value));
        });
        
    });
}   
//-----------------------------------------------------------------//
// Load inital table
init();