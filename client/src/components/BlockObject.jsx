import React from "react";

const BlockObject = ({ heading, rows }) => {
  return (
    <>
      <div className="block radius10 p-3">
        {heading && <h5 className="pb-3">{heading}</h5>}
        {Object.keys(rows).map((key) => {
          return (
            <>
              <div className="item">
                {key}: <b>{rows[key]}</b>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default BlockObject;
