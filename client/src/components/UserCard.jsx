import React from "react";
import Button from "../components/Button";
import Rating from "../components/Rating";

const UserCard = ({
  title,
  _id,
  first_name,
  last_name,
  profile_photo,
  rating,
  rating_count,
  phone,
}) => {
  return (
    <>
      <div className="block radius10 p-3 usercard">
        <div className="row">
          <div className="col-lg-9 col-md-9 col-sm-9 justify-content-start">
            <h5 className="pb-1">{title}</h5>
            <div className="mt-10 mb-1 f-20 title">
              {first_name + " " + last_name || phone}
            </div>

            <div>
              <div className="d-flex align-items-center">
                {(rating && (
                  <Rating rating={rating} rating_count={rating_count} />
                )) ||
                  "No reviews"}

                <i className="fas fa-phone-square-alt f-18 pl-15"></i>
                <span>&nbsp;{phone}</span>
              </div>
              <a href={`tel:${phone}`}>
                <Button className="sm action-1 px-5 mt-2" text="Call" />
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-3 justify-content-end">
            <img
              src={`/photos/profile/${profile_photo}`}
              alt=""
              className="img-fluid rounded-circle mt-3 mt-sm-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
