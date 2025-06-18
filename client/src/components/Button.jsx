import React from "react";
import { Link } from "react-router-dom";

const ButtonSm = ({ className, link, text, event, btnParams, target }) => {
  return (
    <>
      {(!link && (
        <button
          className={`btn ${className} border-gray color-main medium f-16`}
          target={target || null}
          onClick={event || null}
        >
          {text}
        </button>
      )) ||
        (btnParams && (
          <Link
            to={link}
            className={`btn ${className} border-gray color-main medium f-16`}
            target={target || null}
            onClick={(e) => event(btnParams, e) || null}
          >
            {text}
          </Link>
        )) || (
          <Link
            to={link}
            className={`btn ${className} border-gray color-main medium f-16`}
            target={target || null}
            onClick={event || null}
          >
            {text}
          </Link>
        )}
    </>
  );
};

export default ButtonSm;
