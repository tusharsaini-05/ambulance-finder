import React from "react";
import Section from "../components/Section";

const NotFound = () => {
  return (
    <>
      <Section className="bg-light d-flex align-items-center" align="center">
        <div className="col-lg-12">
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-block text-center">
              <h1>Oops!</h1>
              <h2 className="pt-3">Page not found</h2>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default NotFound;
