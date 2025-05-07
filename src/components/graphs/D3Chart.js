import React from 'react';
import { useD3 } from '../../hooks/useD3';
import BarGraphD3 from './d3/BarGraphD3';
import HorizontalBarGraphD3 from './d3/HorizontalBarGraphD3';
import PieChartD3 from './d3/PieChartD3';
import ResponsiveSVG from './ResponsiveSVG';
import LineChartD3 from './d3/LineChartD3';
import StackedBarGraphD3 from './d3/StackedBarGraphD3';
import MultiBarGraphD3 from './d3/MultiBarGraphD3';
import HorizontalMultiBarGraphD3 from './d3/HorizontalMultiBarGraphD3';
const D3Chart = ({type,data,options}) => {

  const ref = useD3(
    (svg) => {
      if(!data) return;
      svg.selectAll("*").remove();
      switch(type){
        case "bar-vertical":
          BarGraphD3(svg,data,options);
          break;
          case "bar-multi-vertical":
          MultiBarGraphD3(svg,data,options);
          break;
        case "bar-horizontal":
          HorizontalBarGraphD3(svg,data,options);
          break;
        case "pie":
          PieChartD3(svg,data,options);
          break;
        case "line":
          LineChartD3(svg,data,options);
          break;
        case "stacked-bar-vertical":
          StackedBarGraphD3(svg,data,options);
          break;
        case "bar-multi-horizontal":
          HorizontalMultiBarGraphD3(svg,data,options);
          break;

        default:
          break;
      }
      
    },
    [data,options]
  );



  return (
    <ResponsiveSVG
      svgRef={ref}
      height={options.height}
      width={options.width}
      top={0}
      left={0}
      divClassName="d3-wrapper"
      svgClassName="d3-svg"
      
    >
      
    </ResponsiveSVG>
  );
};

export default D3Chart;
