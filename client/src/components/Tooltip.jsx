import React, { useState } from "react";

const Tooltip = ({ text, className = null, children }) => {
  const [hover, setHover] = useState(false);

  const handleMouseOver = () => {
    setHover(true);
  };
  const handleMouseOut = () => {
    setHover(false);
  };
  const tooltipStyle = {
    display: hover ? "block" : "none",
    position: "absolute",
  };
  return (
    <>
      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className={className}
      >
        {children}
        <div
          className="text-center bg-dark color-white rounded px-1"
          style={tooltipStyle}
        >
          {text}
        </div>
      </div>
    </>
  );
};

export default Tooltip;
