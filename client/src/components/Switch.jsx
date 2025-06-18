import React from "react";

const Switch = ({ label, isChecked, event, className }) => {
  return (
    <>
      <div className={`form-check form-switch form-switch-${className}`}>
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          defaultChecked={isChecked}
          onClick={event}
        />
        <label className="form-check-label h6" htmlFor="flexSwitchCheckDefault">
          {label}
        </label>
      </div>
    </>
  );
};

export default Switch;
