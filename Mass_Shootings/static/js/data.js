// Get a reference to the table body
var tbody = d3.select("tbody");

//-----------------------------------------------------------------//
// Function to load initial table
function init() {
    // MAIN - Get data from the CSV file and execute  
    d3.csv("./../static/data/MJMassData.csv").then((massData, err) => {
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