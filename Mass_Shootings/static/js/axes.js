d3.csv("./../static/data/MJMassData.csv").then((massData, err) => {
    if (err) throw err;
    
    console.log(massData);

    var states = massData.map(d => d.city_st.split(", ")[1]); 
    console.log(states);

    var westTest = ["California", "Hawaii"];
    var west = [];
    for (var i=0; i<states.length; i++) {
        if (westTest.includes(states[i]))
        west.push(states[i]);
    }
    console.log(west);
    
});
        // // Get this Sample data - for BAR and BUBBLE
        // var thisSample = data.samples.filter(sample => sample.id == name);
        // thisSample = thisSample[0];
        // console.log(thisSample);
        
        // var ids = thisSample.otu_ids;
        // otuIds = ids.map(i => 'OTU ' + i +'  ');
        // var values = thisSample.sample_values;
        // var labels = thisSample.otu_labels;

        // // Get this Metadata - for GAUGE
        // var thisMeta = data.metadata.filter(meta => meta.id == name);
        // var value = thisMeta[0].wfreq;
        // console.log(`Wfreq: ${value}`);

        // // Build BAR
        // var data = [{
        //     x: (values.slice(0, 10)).reverse(),
        //     y: (otuIds.slice(0, 10)).reverse(),
        //     text: (labels.slice(0, 10)).reverse(),
        //     type: 'bar',
        //     orientation: 'h'
        // }];
        // var layout = {
        //     title: `<br><b><span style="font-family:Montserrat">Top 10 Bacteria Cultures</b>`,
        //     font: { size: 13 }
        // };
        // Plotly.newPlot('bar', data, layout);

        // // Build BUBBLE
        // var data = [{
        //     x: ids,
        //     y: values,
        //     text: labels,
        //     mode: 'markers',
        //     marker: {
        //         size: values,
        //         color: ids,
        //         colorscale: "Earth"
                
        //     }
        // }];
        // var layout = {
        //     title: `<br><b><span style="font-family:Montserrat">Bacteria Cultures Per Sample</b>`,
        //     font: { size: 13 },
        //     xaxis: { title: "OTU ID" },
        // };
        // Plotly.newPlot('bubble', data, layout); 

