import React from "react";
import { Link } from "react-router-dom";

const SubHeadingTitle = ({
  subheading,
  heading,
  size,
  to,
  className = null,
}) => {
  return (
    <>
      <div className={`col-lg-6 col-md-6 col-sm-6 text-center ${className}`}>
        <div className="f-14 color-heading semibold text-uppercase sp-20">
          {subheading}
        </div>
        <Link to={to}>
          <span className={`color-red fw-bold ${size}`}>{heading}</span>
        </Link>
      </div>
    </>
  );
};

export default SubHeadingTitle;
