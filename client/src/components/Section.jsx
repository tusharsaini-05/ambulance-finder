import React from "react";

const Section = ({ className, align, children }) => {
  return (
    <>
      <section className={`pt-50 pb-50 ${className}`}>
        <div className="container px-xl-0">
          <div className={`row justify-content-${align}`}>{children}</div>
        </div>
      </section>
    </>
  );
};

export default Section;
