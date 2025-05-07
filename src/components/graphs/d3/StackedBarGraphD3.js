import * as d3 from "d3";

const StackedBarGraphD3 = function (svg, data, options) {
   
    


    const defaultOptions = {
        width: 500,
        height: 250,
        margin: {
            top: 20,
            right: 20,
            bottom: 50,
            left: 40
        },
        padding: 0.5,
        barThickness: 20,
        fillcolors: ["#ff8000", "#00ff00", "#f26677", , "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        yLabel: "Frequency",
        xLabel: "Label",
        xLabelFontSize: "0.8rem",
        yLabelFontSize: "1rem",
        yLabelXOffset: 0,
        yLabelYOffset:  0,
        yLabelMargin: 30,
        tickFontSize : "14px",
        gridlines: true,
        domainAsInteger: true,


        legendEnable: true,
        legendWidth: 90,
        legendHeight: 10,
        legendMargin: 10,
        legendPadding: 10,
        legendTextMargin: 15,
        legendFontSize: "0.7rem",
        legendX: 200,
        legendY: 230,
        legendTextWeight: "bold",
        legendTextFamily: "sans-serif",
        legendTextFill: "currentColor",
        legendCircleRadius: 4,

        ticksCount: 5,
        tickWholeValues: true,

        valueLabelContent: (d) =>Intl.NumberFormat('en', {notation:"compact"}).format(d),
        tickLabelContent: (d) => Intl.NumberFormat('en', {notation:"compact"}).format(d),

        tooltips: true,
        tooltipFontSize: "1rem",
        tooltipFontWeight: "bold",
        tooltipContent: (d,color) =>`<span style="color:${color};cursor:default;">` + d.category + "</span> : " + d.value.toFixed(d),

        maxValuePadding: 0.2,
        xTickAngle: 0,
        xTickOffsetY: 10,
        xTickOffsetX: 0,

        axisLabelLineFormat: (d) => d.split(" "),

    }
    options = Object.assign({}, defaultOptions, options);

    const { width, height, margin, barThickness, fillcolors, padding, yLabel, gridlines, domainAsInteger
        , legendEnable, legendWidth, legendHeight, legendMargin, legendPadding, legendTextMargin, legendFontSize, legendX, legendY, legendTextWeight, legendTextFamily, legendTextFill, legendCircleRadius,
        valueLabelContent,tickLabelContent,maxValuePadding,
        tooltips, tooltipFontSize, tooltipFontWeight, tooltipContent,
        ticksCount,tickWholeValues,xLabelFontSize,yLabelFontSize,yLabelXOffset,yLabelYOffset,tickFontSize,
        xTickAngle,xTickOffsetY,xTickOffsetX,
        axisLabelLineFormat,yLabelMargin
    } = options;
    const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } = margin;

    if (data.length == 0 || data[0] === undefined || data == {}) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "2rem")
            .style("font-weight", "bold")
            .text("No Data");
        return;
    }


    const series = d3.stack()
    .keys(d3.union(data.map(d => d.category))) // distinct series keys, in input order
    .value(([, D], key) => D.get(key).value) // get value for each series key and stack
  (d3.index(data, d => d.label, d => d.category)); 

    // Declare the x (horizontal position) scale.
    const x = d3.scaleBand()
        .domain([...new Set(data.map(d => d.label))] )
        .range([marginLeft+yLabelMargin , width - marginRight])
        .padding(padding);

    // Declare the y (vertical position) scale . sum of all values for each label

    var yMax = d3.max(series, d => d3.max(d, d => d[1]));
    const maxVal= Math.ceil((yMax * (1+maxValuePadding))+0.001);

    const y = d3.scaleLinear()
        .domain([0, maxVal])
        .range([height - marginBottom, marginTop+legendY])
        .nice();
        



    // add y-axis lines

        svg.append("g")
            .attr("transform", `translate(${marginLeft+yLabelMargin},0)`)
            .call(d3.axisLeft(y)
                .tickSize(gridlines?-width +yLabelMargin+ marginLeft + marginRight:0)
                .tickFormat("")
                .tickSizeOuter(0)
                )
            .lower()
            .selectAll("line")  // Select all the tick lines
            .attr("visibility", gridlines ? "visible" : "hidden")
            .attr("class", "grid-line")// Set the stroke width to 0.5;


    





    // Add the x-axis and label.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0)
            .tickSizeInner(0)
            )
            .style("font-size",tickFontSize)
            .selectAll(".tick text")
            .call(function(t){                
                t.each(function(d){ // for each one
                  var self = d3.select(this);
                  var s =  axisLabelLineFormat(d)
                  self.text(''); // clear it out
                  s.forEach(function(e, i){ // for each word
                    self.append('tspan') // add a tspan
                        .attr('x', 0)
                        .attr('dy','1em')
                        .text(e);
                  });
                  
                })
            })
            .attr("y", xTickOffsetY)
            .attr("x", xTickOffsetX)
            .attr("transform", `rotate(${xTickAngle})`);

    // Add the y-axis and label.
    const axisTicksY = d3.axisLeft(y).tickValues(y.ticks(ticksCount));

    if(tickWholeValues){
        axisTicksY.tickValues(y.ticks(ticksCount).filter(tick => Number.isInteger(tick)))
        .tickFormat(tickLabelContent);
    }
    svg.append("g")
        .attr("transform", `translate(${marginLeft+yLabelMargin},0)`)
        .call(axisTicksY)
        .call((g) => g.append("text")
            .attr("x", -marginLeft+yLabelMargin)
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -marginLeft +yLabelXOffset)
            .attr("x", -(height / 2)+yLabelYOffset)
            .text(yLabel)
            .attr("font-size",yLabelFontSize)
            
            )
            .style("font-size",tickFontSize);

    // Add a rect for each bar.

    
    const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(fillcolors)
    .unknown("#ccc");

    // const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")


    svg.append("g")
    .selectAll()
    .data(series)
    .join("g")
      .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d)))
    .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
    //   .call(g => g
    // .join("text")
    //     .attr("x", d => x(d.data[0]) + x.bandwidth() / 2)
    //     .attr("y", d => y(d[1]) + (y(d[0]) - y(d[1])) / 2)
    //     .attr("fill", "black")
    //     .attr("text-anchor", "middle")
    //     .text(d => valueLabelContent(d.data[1].get(d.key).value))
    //     .style("font-size", "12px")
    //     .style("font-weight", "bold"))
    .call(g => {
        if (tooltips) {
            g.on("mouseover", function (event, d) {
                const rect = this.getBoundingClientRect();
                const x = rect.left + window.scrollX + 35;
                const y = rect.top + window.scrollY + 10;
                const html = tooltipContent(d.data[1].get(d.key),color(d.key));
                const tooltip = d3.select("body").append("div")
                .attr("class", "d3-tooltip")
                .style("opacity", 0);
                
                tooltip.html(html)
                
                    .style("left", x + "px")
                    .style("top", y + "px")
                    .style("font-size", tooltipFontSize)
                    .style("font-weight", tooltipFontWeight)
                    .transition()
                    .duration(200)
                    .style("opacity", .9);


            });
            g.on("mouseout", function () {
                d3.selectAll(".d3-tooltip")
                    .transition()
                    .duration(100)
                    .style("opacity", 0)
                    .remove();
            });

        }
    });

        
  
        //sideways legend on top with circle and text

        var legendGroup = svg.append("g")
            .attr("transform", `translate(${(width/2)-yLabelMargin-marginLeft-marginRight+legendX},${marginTop})`);
        var legendElement = legendGroup.selectAll(".legend")
            .data(series)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(" + i * legendWidth + ",0)"; });
        legendElement.append("circle")
            .attr("cx", legendCircleRadius)
            .attr("cy", legendCircleRadius)
            .attr("r", legendCircleRadius)
            .style("fill", (d, i) => color(d.key));
        legendElement.append("text")
            .attr("x", legendCircleRadius + legendTextMargin)
            .attr("y", legendCircleRadius)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", legendFontSize)
            .style("font-weight", legendTextWeight)
            .style("font-family", legendTextFamily)
            .style("fill", legendTextFill)
            .text((d) => d.key);

 

    




};




export default StackedBarGraphD3;