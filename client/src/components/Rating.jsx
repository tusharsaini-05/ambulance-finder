import React from "react";

const Rating = ({ rating, rating_count }) => {
  return (
    <>
      <div className="d-block py-2">
        <i className="fas fa-star color-red"></i>
        <span>
          &nbsp;{rating} {rating_count && `(${rating_count})`}
        </span>
      </div>
    </>
  );
};

export default Rating;
