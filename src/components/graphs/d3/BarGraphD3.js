import * as d3 from "d3";

const BarGraphD3 = function(svg, data, options) {
    const defaultOptions = {
        width: 500,
        height: 250,
        margin: {
            top: 30,
            right: 20,
            bottom: 30,
            left: 40
        },
        padding: 0.5,
        barThickness: 20,
        fillcolor: "#69b3a2",
        yLabel: "Frequency",
        xLabel: "Label",
        xLabelFontSize: "1rem",
        yLabelFontSize: "1rem",
        yLabelXOffset: -25,
        yLabelYOffset:  35,

        yLabelMargin: 30,

        


        tickFontSize: "0.8rem",

        gridlines: true,

        maxValuePadding:0.2,
        tickWholeValues:true,
        valueLabelContent: (d) => d.value.toFixed(2),
        tickLabelContent: (d) => d,
        valueLabelOffsetY: -4,
        valueLabelOffsetX: 0,
        valueLabel: true,
        valueLabelFontSize: "0.8rem",
        ticksCount:5,
        tickFactor : 1,
        xTickAngle: 0,
        xTickOffsetY: 10,
        xTickOffsetX: 0,

        axisLabelLineFormat: (d) => d.split(" "),

    }

    options = Object.assign({}, defaultOptions, options);

    const { width, height, margin, barThickness, fillcolor, padding, yLabel ,gridlines
        ,maxValuePadding,tickWholeValues,
        valueLabelContent, valueLabel, valueLabelOffsetY, valueLabelOffsetX,valueLabelFontSize,
        tickFontSize, yLabelFontSize,ticksCount,xTickAngle,
        xTickOffsetY, xTickOffsetX,
        yLabelXOffset, yLabelYOffset,
        axisLabelLineFormat,xLabelFontSize,yLabelMargin,tickLabelContent,tickFactor
     } = options;

    const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } = margin;
    

    //------------------NO DATA------------------
    if (data.length == 0 || data[0] === undefined || data=={}) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "2rem")
            .style("font-weight", "bold")
            .text("No Data");
        return;
    }



    //------------------AXIS------------------
    // Declare the x (horizontal position) scale.
    const x = d3.scaleBand()
        .domain(data.map((d) => d.label) )
        .range([marginLeft+yLabelMargin, width - marginRight])
        .padding(padding);


    const maxVal= Math.ceil((d3.max(data, d => d.value,0) * (1+maxValuePadding))+0.001);
    
    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([0,maxVal])
        .range([height - marginBottom, marginTop])
        .nice();
        
    
// add y-axis grid lines
svg.append("g")
    .attr("transform", `translate(${marginLeft+yLabelMargin},0)`)
    .call(d3.axisLeft(y)
    
        .tickSize(gridlines ? -width+yLabelMargin + marginLeft + marginRight : 0)
        .tickFormat(() => "")
        .tickSizeOuter(0)
        .ticks(5)
    )
    .lower()
    .selectAll("line")
    .style("stroke", "#eee")
    .attr("visibility", gridlines ? "visible" : "hidden")
    .attr("class", "grid-line")
    ;

    

    

    // Add the x-axis and label.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0)
            .tickSizeInner(0)
            )
            .style("font-size",xLabelFontSize)
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
                        .text(e)
                        .attr("font-size",tickFontSize);
                  });
                  
                })
            })
            .attr("y", xTickOffsetY)
            .attr("x", xTickOffsetX)
            .attr("transform", `rotate(${xTickAngle})`);
            



    // Add the y-axis and label.

    const axisTicksY = d3.axisLeft(y).tickValues(y.ticks(ticksCount));

    if(tickWholeValues){
        axisTicksY.tickValues(y.ticks(ticksCount).filter(tick => Number.isInteger(tick) && tick % tickFactor === 0))
        .tickFormat(tickLabelContent);;
    }




    svg.append("g")
        .attr("transform", `translate(${marginLeft+yLabelMargin},0)`)
        .call(axisTicksY)
        .call((g) => g.append("text")
            .attr("x", -marginLeft)
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



    // Add a rect for each bar with value label on top
    svg.append("g")
        .attr("fill", fillcolor)
        .selectAll()
        .data(data)
        .call((g) => g
        .join("rect")
        .attr("x", (d) => x(d.label))
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .attr("class", "bar")
        )
        .call((g) => g
        .join("text")
        .text((d) => valueLabelContent(d))
        .attr("x", (d) => x(d.label)+(x.bandwidth()/2) + valueLabelOffsetX)
        .attr("y", (d) => y(d.value) + valueLabelOffsetY)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("class", "value-label")
        .attr("visibility", valueLabel ? "visible" : "hidden")
        .style("font-size", valueLabelFontSize)
        );

    
};

            


export default BarGraphD3;