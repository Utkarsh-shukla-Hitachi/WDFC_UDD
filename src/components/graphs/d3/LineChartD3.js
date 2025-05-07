import * as d3 from "d3";

const LineChartD3 = function (svg, data, options) {
    const defaultOptions = {
        width: 500,
        height: 250,
        margin: {
            top: 10,
            right: 0,
            bottom: 20,
            left: 5
        },
        padding: 0.5,
        gridlines: true,
        lineThickness: 2,
        lineColors: ["#69b3a2", "#404080", "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        xLabel: "",
        yLabel: "",
        xLabelFontSize: "1.2rem",
        yLabelFontSize: "1.3rem",
        yLabelXOffset: 0,
        yLabelYOffset:  0,

        valuePoints: true,
        valuePointColors: ["#69b3a2", "#404080", "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        valuePointRadius: 5,
        valuePointHoverColor: "black",

        gridLineX: true,
        gridLineY: true,
        gridLineColor: "#eee",
        gridLineStrokeWidth: 1,

        tooltips: true,
        tooltipFontSize: "1rem",
        tooltipFontWeight: "bold",
        tooltipContent: (item,d, color) => `<span style="color:${color};">` + item + "</span> : " + d,

        maxValuePadding: 2,
        tickWholeValues:false,

        legendEnable: true,
        legendWidth: 200,
        legendHeight: 10,
        legendMargin: 10,
        legendPadding: 10,
        legendTextMargin: 10,
        legendFontSize: "1rem",
        legendX: 670,
        legendY: 10,
        legendTextWeight: "normal",
        legendTextFamily: "sans-serif",
        legendTextFill: "black",
        legendCircleRadius: 4,
        legendSpacing: "0.2em",
        tickLabelContent: (d) => Intl.NumberFormat('en', {notation:"compact"}).format(d),
        yLabelMargin : 20,
        tickFontSize : "1rem",
        ticksCount: 5,

    };

    options = Object.assign({}, defaultOptions, options);

    const {
        width,
        height,
        margin,
        padding,
        gridlines,
        lineThickness,
        lineColors,
        xLabel,
        yLabel,
        xLabelFontSize,
        yLabelFontSize,
        yLabelXOffset,
        yLabelYOffset,

        valuePoints,
        valuePointColors,
        valuePointRadius,
        valuePointHoverColor,

        gridLineX,
        gridLineY,
        gridLineColor,
        gridLineStrokeWidth,

        tooltips,
        tooltipFontSize,
        tooltipFontWeight,
        tooltipContent,

        maxValuePadding,
        tickWholeValues,
        legendSpacing,
        legendEnable, legendWidth, legendHeight, legendMargin, legendPadding, legendTextMargin, legendFontSize, legendX, legendY, legendTextWeight, legendTextFamily, legendTextFill, legendCircleRadius   ,     

        tickLabelContent,yLabelMargin,tickFontSize,ticksCount
    } = options;

    if (data.length == 0 || data === undefined || data == {}) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "2rem")
            .style("font-weight", "bold")
            .text("No Data");
        return;
    }




    //data.labels is list of labels
    //data.values is list of different items with values list
    const maxValue = d3.max(data.values, d => d3.max(d.values))* (1 + maxValuePadding)+0.001 ;


    //line chart
    const x = d3
        .scaleBand()
        .domain(data.labels)
        .range([margin.left+yLabelMargin, width - margin.right])
        .padding(padding);

    const y = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.bottom, margin.top])
        .nice();


    const xAxis = g =>
        g
            .attr("transform", `translate(0,${height - margin.bottom + margin.top - 10})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .style("font-size",xLabelFontSize)

            .call(g => g.select(".domain").remove())
            .append("text")
            .attr("x", width )
            .attr("y", margin.bottom - margin.top + 10)
            .attr("fill", "currentColor")
            .attr("font-size", xLabelFontSize)
            .text(xLabel);

    const axisTicks=d3.axisLeft(y).tickValues(y.ticks(ticksCount));
    
    if(tickWholeValues){
        axisTicks.tickValues(y.ticks().filter(tick => Number.isInteger(tick)))
        .tickFormat(tickLabelContent);
    }

    const yAxis = g =>

        g
            .attr("transform", `translate(${margin.left+yLabelMargin},0)`)
            .call(axisTicks)
            .style("font-size",tickFontSize)
            .call(g => g.select(".domain").remove())
            .append("text")
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .attr("font-size", yLabelFontSize)
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + yLabelXOffset)
            .attr("x", -(height / 2)+yLabelYOffset)
            .text(yLabel);

            

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);


    // create axis lines
    if (gridlines) {
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom + margin.top - 10})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSize(-height + margin.bottom + margin.top - 10).tickFormat(() => "").tickSizeOuter(0))
            .lower()
            .selectAll("line")  // Select all the tick lines
            .attr("stroke-width", gridLineStrokeWidth)
            .attr("class", "grid-line");


        svg.append("g")
            .attr("transform", `translate(${margin.left+yLabelMargin},0)`)
            .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right+yLabelMargin).tickFormat(() => "").tickSizeOuter(0))
            .lower()
            .selectAll("line")  // Select all the tick lines
            .attr("stroke-width", gridLineStrokeWidth)
            .attr("class", "grid-line");
    } 

    
    const onItemSelect = (item,currItem) => {
        return;
        console.log(item,currItem);
        //check if clicked item is not hidden and other items are hidden
        //if yes then unhide all items
        if(item==currItem)
        {
            d3.selectAll(".chartline").classed("d3-chartline-hidden",false);
            return -1;
        }
        
        

        d3.selectAll(".chartline").classed("d3-chartline-hidden",true);

        d3.selectAll(`.line-${item}`).classed("d3-chartline-hidden",false);

        return item;
    }





    data.values.forEach((item, i) => {

        //place  line
        svg
            .append("path")
            .datum(item.values)
            .attr("fill", "none")
            .attr("stroke", lineColors[i % lineColors.length])
            .attr("stroke-width", lineThickness)
            .attr(
                "d",
                d3
                    .line()
                    .x((d, i) => x(data.labels[i]) + x.bandwidth() / 2)
                    .y(d => y(d))
            )
            .attr("class",`chartline line-${i}`)
        //place points
        if (valuePoints) {
            const points = svg
                .append("g")
                .selectAll("circle")
                .data(item.values)
                .join("circle")
                .attr("cx", (d, i) => x(data.labels[i]) + x.bandwidth() / 2)
                .attr("cy", d => y(d))
                .attr("r", valuePointRadius)
                .attr("fill", valuePointColors[i % valuePointColors.length])
                .attr("class",`chartline line-${i}`);


            if (tooltips) {
                points.on("mouseover", function (event, d) {
                    d3.select(this).attr("fill", valuePointHoverColor);
                    const tooltip = d3.select("body").append("div")
                        .attr("class", "d3-tooltip")
                        .style("opacity", 0);

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);

                    tooltip.html(tooltipContent(item.itemName, d, valuePointColors[i % valuePointColors.length]))
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px")
                        .style("font-size", tooltipFontSize)
                        .style("font-weight", tooltipFontWeight);

                }
                )
                    .on("mouseout", function (d) {

                        d3.select(this).attr("fill", valuePointColors[i % valuePointColors.length]);
                        d3.selectAll(".d3-tooltip").remove();

                    });
            }

        }
    });
    const index = d3.local();
    const selectedItem = d3.local();
    //add legend
    const colors = d3.scaleOrdinal(lineColors);
    if(legendEnable){
        const legend = svg.append("g")
            .attr("font-family", legendTextFamily)
            .attr("font-size", legendFontSize)
            .attr("text-anchor", "end")
            .attr("class","d3-legend-bg")
            .selectAll("g")
            //.call(selectedItem.set(this,-1))
            .data(data.values.map(d => d.itemName))
            .join("g")
            .attr("transform", (d, i) => `translate(${legendX},${legendY + i * (legendHeight + legendMargin)})`)
            .attr("class",`chartline line-${data.values.map(d => d.itemName)}`)
            .each(function(d, i) {
                index.set(this, i);           
              })
            .on("click", function(e, i,d) {
                
                //selectedItem.set(this,onItemSelect(index.get(this),selectedItem.get(this)));
            });
            

        //add legend g box with circle and text
        legend.append("rect")
            .attr("x", -legendPadding)
            .attr("y", -legendPadding)
            .attr("width", legendWidth)
            .attr("height", legendHeight + legendPadding);


        legend.append("circle")
            .attr("cx", legendCircleRadius)
            .attr("cy", legendCircleRadius)
            .attr("r", legendCircleRadius)
            .attr("fill", colors);

        legend.append("text")
            .attr("x", legendCircleRadius + legendTextMargin)
            .attr("y", legendCircleRadius)
            .attr("dy", "0.32em")
            .attr("dx", legendSpacing)
            .text(d => d)
            .attr("fill", legendTextFill)
            .style("font-weight", legendTextWeight)
            .style("font-family", legendTextFamily)
            .style("font-size", legendFontSize)
            .style("text-anchor", "start");
    }

};

export default LineChartD3;