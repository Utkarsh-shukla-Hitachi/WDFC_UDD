import * as d3 from "d3";

const MultiBarGraphD3 = function(svg, data, options) {
    const defaultOptions = {
        width: 500,
        height: 250,
        margin: {
            top: 30,
            right: 20,
            bottom: 30,
            left: 40
        },
        paddingCategories: 0.5,
        paddingLabels: 0.5,
        barThickness: 20,
        fillcolors: ["#69b3a2", "#404080", "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        yLabel: "",
        xLabel: "",
        xLabelFontSize: "1rem",
        yLabelFontSize: "1rem",
        yLabelXOffset: 0,
        yLabelYOffset:  0,
        tickFontSize: "1rem",

        gridlines: true,

        maxValuePadding:0.2,
        tickWholeValues:true,
        valueLabelContent: (d) => d.value.toFixed(),
        valueLabelOffsetY: -2,
        valueLabelOffsetX: 0,
        valueLabel: true,
        valueLabelFontSize: "1rem",
        ticksCount:5,

        xTickAngle: 0,
        xTickOffsetY: 7,
        yLabelOffset:-30,
        legendSpacing: 190,
        legendPositionOffsetX: 0,
        legendPositionOffsetY: 10,
        legendFontSize: "1rem",
        axisLabelLineFormat: (d) => d.split(" "),
        yLabelMargin : 30,
        tickLabelContent: (d) => Intl.NumberFormat('en', {notation:"compact"}).format(d),
        legendRectSize : 18
    }

    options = Object.assign({}, defaultOptions, options);

    const { width, height, margin, barThickness, fillcolors, paddingCategories,paddingLabels, yLabel ,gridlines
        ,maxValuePadding,tickWholeValues,
        valueLabelContent, valueLabel, valueLabelOffsetY, valueLabelOffsetX,valueLabelFontSize,
        tickFontSize,ticksCount,xTickAngle,xLabelFontSize,yLabelFontSize,yLabelXOffset,yLabelYOffset,
        xTickOffsetY, xTickOffsetX,yLabelOffset,legendSpacing,legendPositionOffsetX,legendPositionOffsetY,legendFontSize
        ,axisLabelLineFormat, yLabelMargin,tickLabelContent,legendRectSize
    } = options;

    const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } = margin;

    if (data.length == 0 || data[0] === undefined || data == {} ) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "2rem")
            .style("font-weight", "bold")
            .text("No Data");
        return;
    }
    //Multi Bar Graph
    // Declare the x (horizontal position) scale.
    const fx = d3.scaleBand()
      .domain(new Set(data.map(d => d.label)))
      .rangeRound([marginLeft+yLabelMargin, width - marginRight])
      .paddingInner(paddingCategories)
        .paddingOuter(paddingCategories);

    const categories=new Set(data.map(d => d.category));
    
    const x = d3.scaleBand()
      .domain(categories)
      .rangeRound([0, fx.bandwidth()])
        .paddingInner(paddingLabels);



    const color = d3.scaleOrdinal()
      .domain(categories)
        .range(fillcolors)
        .unknown("#ccc");


        const maxVal= Math.ceil((d3.max(data, d => d.value,0)  * (1+maxValuePadding))+0.001)

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()

    .domain([0, maxVal])
    .rangeRound([height - marginBottom, marginTop+legendPositionOffsetY])
    .nice();
        
    // Add the bars.
   
    svg.append("g")
    .selectAll()
    .data(d3.group(data, d => d.label))
    .join("g")
      .attr("transform", ([state]) => `translate(${fx(state)},0)`)
    .selectAll()
    .data(([, d]) => d)
    .call((g)=>
    g.join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => color(d.category))
    )
    .call((g) => g
        .join("text")
        .text((d) => valueLabelContent(d))
        .attr("x", (d) => x(d.category)+(x.bandwidth()/2) + valueLabelOffsetX)
        .attr("y", (d) => y(d.value) + valueLabelOffsetY)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("class", "value-label")
        .attr("visibility", valueLabel ? "visible" : "hidden")
        .style("font-size", valueLabelFontSize)
        );




    // Add the x-axis and label.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(fx)
            .tickSizeOuter(0)
            .tickSizeInner(0)
            )
            .style("font-size",tickFontSize)
            .selectAll(".tick text").call(function(t){                
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

            //Y Axis
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
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")

            .attr("y", -margin.left + yLabelXOffset)
            .attr("x", -(height / 2)+yLabelYOffset)
            .text(yLabel)
            .attr("font-size",yLabelFontSize)
            
            )
            .style("font-size",tickFontSize);
            




        
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
    .attr("class", "grid-line");

        
//add legend  at top

const legend = svg.append("g")
.attr("transform", `translate(${(width/2)-yLabelMargin-marginLeft-marginRight+legendPositionOffsetX}, ${marginTop})`)
.selectAll("g")
.data(categories)
.join("g")
.attr("transform", (d, i) => `translate(${i * legendSpacing},0)`);
legend.append("rect")
.attr("width", legendRectSize)
.attr("height", legendRectSize)
.attr("fill", color);
legend.append("text")
.attr("x", 24)
.attr("y", 9.5)
.attr("dy", "0.35em")
.text(d => d)
.style("font-size", legendFontSize);



    

    

    
};

            


export default MultiBarGraphD3;