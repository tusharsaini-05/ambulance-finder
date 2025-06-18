import React from "react";

const Select = ({ className, event, selectedValue, options }) => {
  return (
    <>
      <select
        className={`${className} mr-15 input border-gray focus-action-1 color-heading placeholder-main`}
        aria-label="Default select example"
        value={selectedValue}
        onChange={(e) => event(e)}
      >
        {options.map((o, index) => {
          return (
            <option key={index} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default Select;
