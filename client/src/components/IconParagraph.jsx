import React from "react";

const IconParagraph = ({ logo, title, paragraph }) => {
  return (
    <>
      <div className="col-md-4">
        <i className={`fas fa-${logo} f-60 color-main`}></i>
        <div className="mt-20 mb-25 f-22 title">{title}</div>
        <div className="color-heading text-adaptive">{paragraph}</div>
      </div>
    </>
  );
};

export default IconParagraph;
