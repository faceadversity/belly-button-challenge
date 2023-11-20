// Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {

    console.log(data);
});

// initialize the dashboard app
function init() {
    // using d3 library for the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      let names = data.names;
      // including samples for the dropdown menu here
      names.forEach((id) => {
        console.log(id);
        dropdownMenu.append("option").text(id).property("value", id);
      });
  
      // variable set for the first sample
      let sample1 = names[0];
  
      console.log(sample1);
  
      // build initial plots for the first sample
      buildMetadata(sample1);
      buildBarChart(sample1);
      buildBubbleChart(sample1);
    });
  }
  // populate option list of ids
  function buildMetadata(sample) {
    // d3 library retrieves the data
    d3.json(url).then((data) => {
      let metadata = data.metadata;
      // filter results from the sample
      let value = metadata.filter((result) => result.id == sample);
      console.log(value);
      // get first result from the array
      let valueData = value[0];
      // clear HTML page using JS
      d3.select("#sample-metadata").html(""); // format: document.body.innerHTML = "" [src: stackoverflow q/a]
      // object.entries class to add in key values [format: Object.assign(obj, {key: "value"})] [src: stackoverflow q/a]
      Object.entries(valueData).forEach(([key, value]) => {
        console.log(key, value);
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
    });
  }
  // building the bar chart 
  function buildBarChart(sample) {
    // d3 library retrieves the data then we obtain sample data and filter accordingly
    d3.json(url).then((data) => {
      let sampleInfo = data.samples;
      let value = sampleInfo.filter((result) => result.id == sample);
      // obtain first result from the array
      let valueData = value[0];
      // sample_values=>values for barchart; otu_ids=>labels; otu_labels=>hovertext
      let sample_values = valueData.sample_values;
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
        
      console.log(sample_values, otu_ids, otu_labels);
  
      // slice data in reverse order from the top 10 samples in the [0,10] range [OTU1167(...)OTU1977]
      let yticks = otu_ids.slice(0,10).map((id) => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      // trace details for bar chart
      let trace = {
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h",
      };
      // layout set and title included
      let layout = {
        title: "Top 10 OTUs Present",
      };
      // plotly function plots the bar chart
      Plotly.newPlot("bar", [trace], layout);
    });
  }
  // building the bubble chart
  function buildBubbleChart(sample) {
    // use d3 library to retrieve the data, obtain samples, filter and obtain first result in the array
    d3.json(url).then((data) => {    
      let sampleInfo = data.samples; 
      let value = sampleInfo.filter((result) => result.id == sample);    
      let valueData = value[0];  
      // sample_values=>values for barchart; otu_ids=>labels; otu_labels=>hovertext
      let sample_values = valueData.sample_values;
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
            
      console.log(sample_values, otu_ids, otu_labels);
  
      //trace details for bubble chart
      let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          // choosing earth format; closest I can come up with to match instructional material
          colorscale: "Earth"
        }
      };    
      // layout set and title included
      let layout = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
      };
  
      // plotly function plots the bubble chart
      Plotly.newPlot("bubble", [trace1], layout);
    });
  };
  // update dashboard when sample is changed
  function optionChanged(value) {
    // new value gets logged
    console.log(value);
  
    // call all functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
  };
  
  //initialize
  init();