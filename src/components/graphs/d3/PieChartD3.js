import * as d3 from "d3";


const PieChartD3 = function (svg, data, options) {

    const defaultOptions = {
        width: 500,
        height: 250,
        chartX: 50,
        chartY: 250,
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        padding: 0.5,
        barThickness: 20,
        innerRadius: 0,
        outerRadius: 250,
        fillcolor: ["#69b3a2", "#404080", "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"],
        legend: true,
        legendX: 450,
        legendY: 100,
        legendFontSize: "35px",
        legendCircleRadius: 20,
        legendPadding: 40,
        legendSpacing: 40,
        legendLinebreakPadding: 12,
        legendLinebreakStart: -30,
        legendLinebreakEnd: 350,

        tooltips: true,
        tooltipFontSize: "12px",
        tooltipFontWeight: "bold",
        tooltipContent: (d,color) =>`<span style="color:${color};">` + d.data.label + "</span> : " + d.data.value,
        valueLabelInner: false,
        valueLabelInnerFontSize: "20px",
        valueLabelInnerFontWeight: "bold",
        valueLabelInnerFontColor: "black",

        valueLabelOuter: true,
        valueLabelOuterFontSize: "30px",
        valueLabelOuterFontWeight: "bold",
        valueLabelOuterFontColor: "black",
        valueLabelOuterDistance: 20,

        valueLabelContent: (d,color) => Intl.NumberFormat('en', {notation:"compact"}).format(d.data.value),
        valueAsPercent: false,
        valuePercentPrecision: 2,

        showTotal: false,
        totalFormat: (d) => Intl.NumberFormat('en', {notation:"compact"}).format(d),
        totalFontSize: "30px",
        

    }

    options = Object.assign({}, defaultOptions, options);

    const {
        width,
        height,
        chartX,
        chartY,
        margin,
        barThickness,
        fillcolor,
        padding,
        innerRadius,
        outerRadius,
        legendX,
        legendY,
        legendFontSize,
        legendCircleRadius,
        legendPadding,
        legendSpacing,
        legendLinebreakPadding,
        legendLinebreakEnd,
        legendLinebreakStart,

        tooltips,
        tooltipFontSize,
        tooltipFontWeight,
        tooltipContent,


        valueLabelInner,
        valueLabelInnerFontSize,
        valueLabelInnerFontWeight,
        valueLabelInnerFontColor,

        valueLabelOuter,
        valueLabelOuterFontSize,
        valueLabelOuterFontWeight,
        valueLabelOuterFontColor,
        valueLabelOuterDistance,

        valueLabelContent,
        valueAsPercent,
        valuePercentPrecision,

        showTotal,
        totalFormat,
        totalFontSize
        
    } = options;


    if (data.length == 0 || data[0] === undefined || data=={}) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "3rem")
            .style("font-weight", "bold")
            .text("No Data");
        return;
    }

    const total=data.reduce((a,b)=>a+b.value,0);

    let percentData=[];
    if(valueAsPercent)
    {   
        percentData=data.map((d)=>{return {...d,value:(d.value/total*100).toFixed(valuePercentPrecision)}});
        //forEach(d=>d.value=((d.value/total)*100).toFixed(valuePercentPrecision));
    }



    // Set up SVG container
    const chart = svg.append("g").attr("transform", "translate(" + chartX + "," + chartY + ")");

    var color = d3.scaleOrdinal(fillcolor);

    // Set up pie chart layout
    const pie = d3.pie().value(d => d.value);

    // Generate arc path data
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // Create pie slices show values on hover
    const slices = chart.selectAll("path")
        .data(pie(valueAsPercent?percentData:data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => fillcolor[i % fillcolor.length]);

    if (tooltips) {
        slices.on("mouseover", function (event, d) {
            //highlight the current pie slice and reduce opacity of others
            chart.selectAll("path").style("opacity", 0.5);
            d3.select(this).style("opacity", 1);
            const idx=d3.select(this).datum().index;
            // Show tooltip on mouseover
            const tooltip = d3.select("body").append("div")
                .attr("class", "d3-tooltip")
                .style("opacity", 0);

            const tooltipLeft = event.pageX < chartX ? event.pageX - 10 : event.pageX + 10;
            const tooltipTop = event.pageY > chartY ? event.pageY - 10 : event.pageY + 10;
            // Add tooltip content in colored label and value
            tooltip.html(tooltipContent(d,fillcolor[idx % fillcolor.length]))
                //   position tooltip relative to mouse position and center of pie chart
                .style("left", tooltipLeft + "px")
                .style("top", tooltipTop + "px")
                .style("font-size", tooltipFontSize)
                .style("font-weight", tooltipFontWeight)
                .style("position", "absolute")

                .transition()
                .duration(100)
                .style("opacity", 0.9);
        })
            .on("mouseout", function () {
                // Restore all pie slices
                chart.selectAll("path")
                    .style("opacity", 1);
                // Hide tooltip on mouseout
                d3.selectAll(".d3-tooltip")
                    .transition()
                    .duration(100)
                    .style("opacity", 0)
                    .remove();
            });
    }

    if(showTotal)
    {
        svg.append("text")
        .attr("x", chartX )
        .attr("y", chartY)
        .attr("text-anchor", "middle")
        .style("font-size", totalFontSize)
        .style("font-weight", "bold")
        .text(totalFormat(total));
    }

    if(valueLabelInner)
    // Inner labels for pie slices
    {const valueLabelsInner = chart.selectAll("text")
        .data(pie(valueAsPercent?percentData:data))
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .text(d => d.data.value)
        .style("font-size", valueLabelInnerFontSize)
        .style("fill", valueLabelInnerFontColor)
        .style("font-weight", valueLabelInnerFontWeight);
    }

    if(valueLabelOuter)
    {
        // labels outside
        var labelArc = d3.arc().outerRadius(outerRadius+valueLabelOuterDistance).innerRadius(outerRadius+valueLabelOuterDistance);
        chart.selectAll("text")
        .data(pie(valueAsPercent?percentData:data))
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .text(d=>valueLabelContent(d))
        .style("font-size", valueLabelOuterFontSize)
        .style("font-weight", valueLabelOuterFontWeight);


    }

    // Add text labels as legends on right side of chart with color circles next to them
    const legend = svg.append("g")
        .attr("transform", "translate(" + (legendX - margin.right + margin.left) + ", " + (legendY + margin.top - margin.bottom) + ")")
        .selectAll(".legend")
        .data(valueAsPercent?percentData:data)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");


    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", legendCircleRadius)
        .attr("fill", (d, i) => fillcolor[i % fillcolor.length])
        .attr("transform", (d, i) => `translate(0, ${i * legendPadding})`);

    legend.append("text")
        .attr("x", legendCircleRadius + legendSpacing)
        .attr("y", 5)
        .attr("dy", ".2em")
        .text((d, i) => d.label)
        .style("font-size", legendFontSize)
        .attr("transform", (d, i) => `translate(0, ${i * legendPadding})`)

    legend.append("line")
        .attr("x1", legendLinebreakStart) // x-coordinate of the start of the line
        .attr("y1", (d, i) => i * legendPadding + legendCircleRadius + legendLinebreakPadding) // y-coordinate of the start of the line
        .attr("x2", legendLinebreakEnd) // x-coordinate of the end of the line
        .attr("y2", (d, i) => i * legendPadding + legendCircleRadius + legendLinebreakPadding) // y-coordinate of the end of the line
        .style("stroke-width", 2)
        .attr("class","grid-line"); // width of the line

    // append line on top of svg
    // svg.append("line")
    //     .attr("x1", -250) // x-coordinate of the start of the line
    //     .attr("y1", 0) // y-coordinate of the start of the line
    //     .attr("x2", width + 250) // x-coordinate of the end of the line
    //     .attr("y2", 0) // y-coordinate of the end of the line
    //     .style("stroke", "#ccc") // color of the line
    //     .style("stroke-width", 2); // width of the line




}

export default PieChartD3;