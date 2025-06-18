import React from "react";

const Testimonial = ({ details, propic, name, city }) => {
  return (
    <>
      <div className="col-xl-7 col-lg-8 col-sm-10">
        <div className="pt-10 f-22 text-adaptive">{details}</div>
        <div className="mt-20 d-flex align-items-center author_info">
          <img src={`${propic}`} alt="" className="w-60 h-60 radius_full" />
          <div className="ml-15 color-heading f-14 semibold text-uppercase sp-20">
            {name}, {city}
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;
