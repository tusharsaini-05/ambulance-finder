import React from "react";

const Review = ({
  _id,
  user_id,
  receiver,
  rating,
  details,
  createdAt,
  user_id: { first_name, profile_photo },
}) => {
  const recieverPhoto = profile_photo || "default.jpg";
  const name = first_name || "Anonymous";
  return (
    <>
      <div className="py-2 border-top">
        <div className="row">
          <div className="col-md-2 col-sm-2 text-lg-center">
            <img
              className="col-md-6 rounded-circle w-70"
              src={`/photos/profile/${recieverPhoto}`}
            />
            <span className="d-block mt-2">
              <small className="fst-italic">{createdAt.slice(0, 10)}</small>
            </span>
          </div>
          <div className="col-md-10 col-sm-8 align-self-center title">
            <span className="d-block">
              <span className="fw-bold">{name}</span>
              <i className="fas fa-star color-red pl-5"></i>
              &nbsp;{rating}&nbsp;
            </span>
            <span className="d-block">
              <p>{details}</p>
            </span>
          </div>

          <b></b>
        </div>
      </div>
    </>
  );
};

export default Review;
