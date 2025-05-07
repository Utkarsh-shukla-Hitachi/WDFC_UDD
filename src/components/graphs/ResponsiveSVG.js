
import React from 'react';

function ResponsiveSVG({
    children,
    divClassName,
    svgClassName,
    divStyle,
    svgStyle,
    height,
    width,
    top,
    left,
    fill,
    svgRef,
  }) {
  
    const aspect = width / height;
  
    const adjustedHeight = Math.ceil(width / aspect);
    const adjustedWidth = Math.ceil(height * aspect);
  
    return (
      <div
        className={divClassName}  
        style={{
          ...divStyle,
        }}
        
      >
        <svg
          fill={fill}
          style={{
            width: '100%',
            height: '100%',
            ...svgStyle,
          }}
          className={svgClassName}
          viewBox={`${left} ${top} ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          ref={svgRef}
        >
          {children}
        </svg>
      </div>
    );
  }

  export default ResponsiveSVG;