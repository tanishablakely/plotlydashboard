// Create function for sample
function charts(sample) {
  
  // Read samples.json 
  d3.json("samples.json").then((data) => {
    
    // Import the "sample" array 
    var samples = data.samples;
    
    // Filter and sort the id array
    var id_Array = samples.filter(sampleObj => sampleObj.id == sample);
    
    // First array
    var first_array = id_Array[0];

    // otu_ids for the bar chart.
    var otu_ids = first_array.otu_ids;
    
    // Bar chart hovertext 
    var otu_labels = first_array.otu_labels;
    
    // Bar chart values 
    var sample_values = first_array.sample_values;

    // H-bar chart
    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
    var h_bar = [
      {
        // y for the bar chart
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var h_bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", h_bar, h_bar_layout);

    // Create bubble chart for sample
    var bub = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    var bub_layout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    Plotly.newPlot("bubble", bub, bub_layout);
  });
}

// Create funciton for Demographic 
function demoInfo(sample) {

  // Filter the 'metadata' 
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter and sort the id 
    var meta_Array = metadata.filter(sampleObj => sampleObj.id == sample);

    // First array
    var first_meta_Array = meta_Array[0];

    // Reference for index.html
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    // Add key and value pair to append to demo 
    Object.entries(first_meta_Array).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Creating function for dropdown menu
function init() {

  // Reference dropdown element for index.html
  var dropdown = d3.select("#selDataset");

  // Filter 'names' array to populate dropdown menu
  d3.json("samples.json").then((data) => {
    var names = data.names;

    // Create dropdown menu
    names.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // First array
    var start_sample = names[0];

    // Chart and Demo function 
    charts(start_sample);
    demoInfo(start_sample);
  });
}

// Creating a function "optionChanged" 
function optionChanged(new_sample) {
  // Fetch new data each time a new sample is selected
  charts(new_sample);
  demoInfo(new_sample);
}

// Initialize dashboard
init();