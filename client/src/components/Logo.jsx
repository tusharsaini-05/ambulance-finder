import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ name, color = "white" }) => {
  return (
    <>
      <div className={`logo color-${color}`}>
        <Link to="/">{name}</Link>
      </div>
    </>
  );
};

export default Logo;
