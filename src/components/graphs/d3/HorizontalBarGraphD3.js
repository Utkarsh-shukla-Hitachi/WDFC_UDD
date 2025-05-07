import * as d3 from "d3";

const horizontalBarChat = function (svg,data,options) {
  if (data.length==0 || data[0] === undefined) 
    data=[];
    
    
    const defaultOptions = {
      width: 500,
      height: 250,
      margin : { top: 0, right: 0, bottom: 30, left: 60},

      padding:0.5,
      barThickness: 20,
      fillcolor:"#69b3a2",

      maxValuePadding:1,
      tickWholeValues:false,
  }
  options = Object.assign({},defaultOptions, options);
  const { width:w, height:h, margin, barThickness,fillcolor,padding ,
    maxValuePadding,tickWholeValues
  } = options;
  const width = w - margin.left - margin.right,
  
  height = h - margin.top - margin.bottom;
  if (data.length == 0 || data[0] === undefined || data=={}) {
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .text("No Data");
    return;
}

  
  
      svg.append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  
   
    // Add X axis
  
    const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value + 5)])
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end");
  
   
    
    // Y axis
  
    const y = d3
        .scaleBand()
        .range([0, height])
        .domain(data.map((d) => d.label))
        .padding(0.1);
    
        const axisTicksY = d3.axisLeft(y);
    if(tickWholeValues){
      axisTicksY.tickValues(y.ticks().filter(tick => Number.isInteger(tick)))
      .tickFormat(d3.format("d"));
    }
    
      svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(axisTicksY);


      //Bars
    svg
   .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll("Rect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.label))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", fillcolor);
  

  
  };
  

export default horizontalBarChat;
  