import React from "react";
import Rating from "../components/Rating";

const ProfileDriver = ({ user, children }) => {
  return (
    <>
      <div className="col-lg-3 col-md-3 col-sm-3 profile text-center">
        <img
          src={`/photos/profile/${user.profile_photo}`}
          className="img-fluid rounded border"
        />
        <div className="pl-5 mt-2">
          <h3>{user.first_name}</h3>
          {(user.rating && (
            <Rating rating={user.rating} rating_count={user.rating_count} />
          )) || <Rating rating="No reviews" />}
        </div>
        {children}
      </div>
      <div className="col-lg-9 col-md-9 col-sm-9 ">
        <div className="block radius10 p-3">
          <div className="item">
            ID: <b>{user._id}</b>
          </div>
          <div className="item">
            Name: <b>{user.first_name + " " + user.last_name}</b>
          </div>
          <div className="item">
            Phone: <b>{user.phone}</b>
          </div>
          <div className="item">
            Date of Birth:{" "}
            <b>
              {user.date_of_birth && user.date_of_birth.toString().slice(0, 10)}
            </b>
          </div>
          <div className="item">
            City: <b>{user.city}</b>
          </div>
          <div className="item">
            Country: <b>{user.country}</b>
          </div>
          <div className="item">
            Driving License: <b>{user.driving_license}</b>
          </div>
          <div className="item">
            Status: <b>{(user.approved && "Approved") || "Not approved"}</b>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDriver;
