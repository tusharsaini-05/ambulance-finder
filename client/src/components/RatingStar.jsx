import React from "react";

const RatingStar = ({ stars, rating, setRating }) => {
  const numbers = Array.from(Array(stars).keys());

  const handleRatingClick = (n) => {
    setRating(n);
  };
  return (
    <>
      {numbers.map((number) => {
        return (
          (number <= rating && (
            <>
              <i
                className="fas fa-star f-26 border-gray color-red"
                onClick={() => handleRatingClick(number)}
              ></i>
            </>
          )) || (
            <>
              <i
                className="fas fa-star f-26 border-gray color-offwhite"
                onClick={() => handleRatingClick(number)}
              ></i>
            </>
          )
        );
      })}
    </>
  );
};

export default RatingStar;
