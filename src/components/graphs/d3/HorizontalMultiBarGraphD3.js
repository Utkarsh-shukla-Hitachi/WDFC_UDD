import * as d3 from "d3";

const HorizontalMultiBarGraphD3 = function(svg, data, options) {
    const defaultOptions = {
        width: 500,
        height: 250,
        margin: {
            top: 0,
            right: 0,
            bottom: 20,
            left: 0
        },
        paddingCategories: 0.5,
        paddingLabels: 0.5,
        barThickness: 20,
        fillcolors: ["#69b3a2", "#404080", "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        yLabel: "Frequency",
        xLabel: "Label",
        labelFontSize: "15px",
        tickFontSize: "16px",

        gridlines: true,

        maxValuePadding:0.2,
        tickWholeValues:true,
        valueLabelContent: (d) => d.value.toFixed(),
        valueLabelOffsetY: 5,
        valueLabelOffsetX: 10,
        valueLabel: true,
        valueLabelFontSize: "16px",
        ticksCount:5,

        xTickAngle: 0,
        xTickOffsetY: 0,
        xTickOffsetX: -6,

        yLabelOffset:40,
        legendSpacing: 190,
        legendPositionOffsetX: 140,
        legendPositionOffsetY: 30,
        legendFontSize: "18px",
    }

    options = Object.assign({}, defaultOptions, options);

    const { width, height, margin, barThickness, fillcolors, paddingCategories,paddingLabels, yLabel ,gridlines
        ,maxValuePadding,tickWholeValues,
        valueLabelContent, valueLabel, valueLabelOffsetY, valueLabelOffsetX,valueLabelFontSize,
        tickFontSize, labelFontSize,ticksCount,xTickAngle,
        xTickOffsetY, xTickOffsetX,yLabelOffset,legendSpacing,legendPositionOffsetX,legendPositionOffsetY,legendFontSize
     } = options;

    const { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft } = margin;

    if (data.length == 0 || data[0] === undefined || data == {} ) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "30px")
            .style("font-weight", "bold")
            .text("No Data");
        return;
    }
    //data = [
    //     {label:"A",category: "X", value: 10 },
    //     {label:"A",category: "Y", value:20 },
        //     {label:"B",category: "X", value:20 },
    //     {label:"B",category: "Y", value:20 },

    // ]
    //Multi Bar Graph Horizontal
    const fy = d3.scaleBand()
      .domain(new Set(data.map(d => d.label)))
      .rangeRound([ height - marginBottom, marginTop])
      .paddingInner(paddingCategories)
        .paddingOuter(paddingCategories);

    const categories=new Set(data.map(d => d.category));
    
    const y = d3.scaleBand()
      .domain(categories)
      .rangeRound([0, fy.bandwidth()])
        .paddingInner(paddingLabels);



    const color = d3.scaleOrdinal()
      .domain(categories)
        .range(fillcolors)
        .unknown("#ccc");

    const maxValue = d3.max(data, d => d.value) * (1 + maxValuePadding)+0.1;

    const x = d3.scaleLinear()
    .domain([0, maxValue]).nice()
    .rangeRound([marginLeft,width - marginRight ]);
        
    // Add the bars.
   
    svg.append("g")
    .selectAll()
    .data(d3.group(data, d => d.label))
    .join("g")
      .attr("transform", ([category]) => `translate(0,${fy(category)})`)
    .selectAll()
    .data(([, d]) => d)
    .call((g)=>
    g.join("rect")
      .attr("x", d => x(0))
      .attr("y", d => y(d.category))
      .attr("width",d=>  x(d.value)-0.5)
      .attr("height", d => y.bandwidth())
      .attr("fill", d => color(d.category))
    )
    .call((g) => g
        .join("text")
        .text((d) => valueLabelContent(d))
        .attr("x", (d) => x(d.value) +valueLabelOffsetX)
        .attr("y", (d) => y(d.category) +(y.bandwidth()/2) + valueLabelOffsetY)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("class", "value-label")
        .attr("visibility", valueLabel ? "visible" : "hidden")
        .style("font-size", valueLabelFontSize)
        );




    // Add the x-axis and label.
    svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(fy).tickSizeOuter(0))
            .style("font-size",tickFontSize)
            .selectAll(".tick text")
            .attr("y", xTickOffsetY)
            .attr("x", xTickOffsetX)
            .attr("transform", `rotate(${xTickAngle})`)
            

            //Y Axis
    const axisTicksX = d3.axisBottom(x).tickValues(x.ticks(ticksCount));
    if(tickWholeValues){
        axisTicksX.tickValues(x.ticks(ticksCount).filter(tick => Number.isInteger(tick)))
        .tickFormat(d3.format("d"));
    }

    svg.append("g")
        .attr("transform", `translate(${marginLeft-marginRight},${height-marginBottom})`)
        .call(axisTicksX)
        
        .call((g) => g.append("text")
            .attr("x", marginLeft)
            .attr("y", -marginBottom+yLabelOffset)
            .attr("fill", "currentColor")
            )
            .style("font-size",tickFontSize)
            //add axis label
            .call((g) => g.append("text")
            .attr("x", width+5)
            .attr("y", yLabelOffset)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .text(yLabel+" →")
            .style("font-size", labelFontSize)
            
            )




    //add y gridlines

   
        svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${marginLeft-marginRight},${height-marginBottom})`)
        .call(d3.axisBottom(x)
            .tickSize(-height + marginTop + marginBottom)
            .tickFormat(() => "")
        .tickSizeOuter(0)
        .ticks(5)
        )
        .lower()
        .style("font-size",tickFontSize)
        .selectAll("line")  // Select all the tick lines
        .style("stroke", "#eee"); // Set the stroke color to grey




//add legend  at bottom

const legend = svg.append("g")
.attr("transform", `translate(${(width/2)-legendPositionOffsetX}, ${height - marginBottom+legendPositionOffsetY})`)
.selectAll("g")
.data(categories)
.join("g")
.attr("transform", (d, i) => `translate(${i * legendSpacing},0)`);
legend.append("rect")
.attr("width", 19)
.attr("height", 19)
.attr("fill", color);
legend.append("text")
.attr("x", 24)
.attr("y", 9.5)
.attr("dy", "0.35em")
.text(d => d)
.style("font-size", legendFontSize);



    

    

    
};

            


export default HorizontalMultiBarGraphD3;