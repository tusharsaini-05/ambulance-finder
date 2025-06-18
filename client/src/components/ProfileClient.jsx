import React from "react";
import Rating from "../components/Rating";

const ProfileClient = ({ user, children }) => {
  return (
    <>
      <div className="col-lg-3 col-md-3 col-md-3 profile text-center">
        <img
          src={`/photos/profile/default.jpg`}
          className="img-fluid border rounded border"
        />
        <div className="pl-5 mt-2">
          <h3>{user.first_name || user.phone}</h3>
          {(user.rating && (
            <Rating rating={user.rating} rating_count={user.rating_count} />
          )) || <Rating rating="No reviews" />}
        </div>
        {children}
      </div>
      <div className="col-lg-9 col-md-9 col-sm-9 mt-3 mt-sm-0">
        <div className="block radius10 p-3">
          <div className="item">
            ID: <b>{user._id}</b>
          </div>
          {user.first_name && (
            <div className="item">
              Name: <b>{user.first_name + " " + user.last_name}</b>
            </div>
          )}
          <div className="item">
            Phone: <b>{user.phone}</b>
          </div>
          {user.city && (
            <div className="item">
              City: <b>{user.city}</b>
            </div>
          )}
          {user.country && (
            <div className="item">
              Country: <b>{user.country}</b>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileClient;
