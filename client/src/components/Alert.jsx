import React from "react";

const Alert = ({ alert, event }) => {
  return (
    <>
      <div
        className={`alert custom-alert alert-${alert.type} alert-dismissible fade show text-center mt-30`}
        role="alert"
      >
        {alert.message}
        <button
          type="button"
          className="btn-close"
          onClick={() => event({ message: null })}
        ></button>
      </div>
    </>
  );
};

export default Alert;
