function a() {  
d3.json("/api/mass_shootings").then((massData, err) => {
        if (err) throw err;
        console.log(massData);
    
        $('acontent').empty();
        d3.select('acontent')
            .append('p')
            .text("This is A test")
    });
} 

function b() {
        $('bcontent').empty();
        d3.select('bcontent')
            .append('p')
            .text("This is B test")
} 

