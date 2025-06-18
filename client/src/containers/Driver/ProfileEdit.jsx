import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Cookies from "js-cookie";
import Section from "../../components/Section";
import PageTitle from "../../components/PageTitle";
import RowProfileEdit from "../../components/RowProfileEdit";
import Button from "../../components/Button";
import UserApi from "../../api/user";

const ProfileEdit = () => {
  const id = Cookies.get("userId");
  const history = useHistory();
  const global = useContext(GlobalContext);
  const [user, setUser] = useState({});

  const userId = useRef(null);
  const password = useRef(null);
  const fname = useRef(null);
  const lname = useRef(null);
  const phone = useRef(null);
  const city = useRef(null);
  const country = useRef(null);
  const profile_photo = useRef(null);

  const handleChangePhoto = () => {
    profile_photo.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      return;
    }
    if (password.current.value.trim().length < 6) {
      global.setAlert({
        type: "danger",
        message: "Password must be min 6 characters long",
      });
      return;
    }
    const formData = new FormData();
    formData.append("password", password.current.value);
    formData.append("first_name", fname.current.value);
    formData.append("last_name", lname.current.value);
    formData.append("city", city.current.value);
    formData.append("country", country.current.value);

    if (typeof profile_photo.current.files[0] !== "undefined") {
      formData.append("profile_photo", profile_photo.current.files[0]);
      UserApi.updateProfileWithImg(formData)
        .then((res) => {
          global.setAlert({ type: "success", message: res.data.message });
          history.push("/profile");
        })
        .catch((err) =>
          global.setAlert({
            type: "danger",
            message: err.response.data.message,
          }),
        );
    } else {
      formData.append("profile_photo", user.profile_photo);
      UserApi.updateProfile(formData)
        .then((res) => {
          global.setAlert({ type: "success", message: res.data.message });
          history.push("/profile");
        })
        .catch((err) =>
          global.setAlert({
            type: "danger",
            message: err.response.data.message,
          }),
        );
    }
  };
  const getProfileData = () => {
    UserApi.findUserByToken(id)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        global.setAlert(err.response.data.message);
      });
  };
  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <>
      <Section className="bg-light d-flex align-items-center" align="center">
        <PageTitle title="Edit Profile" />

        <div className="col-lg-3 col-md-3 col-sm-3 profile text-center">
          <img
            src={`/photos/profile/${user.profile_photo}`}
            className="img-fluid border rounded"
          />
          <input
            ref={profile_photo}
            style={{ display: "none" }}
            className="mt-15 form-control input"
            type="file"
            name="profile_photo"
          />
          <Button
            className="btn mt-15 border-gray action-1"
            link="# "
            text="Change Photo"
            type="button"
            event={handleChangePhoto}
          />
        </div>
        <div className="col-lg-9 col-md-9 col-sm-9 mt-3 mt-sm-0">
          <form onSubmit={handleSubmit}>
            <div className="block radius10 p-3">
              <table className="table table-borderless">
                <tbody>
                  <RowProfileEdit
                    label="user Id"
                    value={user._id}
                    ref={userId}
                    disabled={true}
                  />
                  <RowProfileEdit
                    label="phone"
                    value={user.phone}
                    ref={phone}
                    disabled={true}
                  />
                  <RowProfileEdit
                    label="date of birth"
                    value={
                      user.date_of_birth &&
                      user.date_of_birth.toString().slice(0, 10)
                    }
                    disabled={true}
                  />
                  <RowProfileEdit
                    label="password"
                    value={user.password}
                    ref={password}
                  />
                  <RowProfileEdit
                    label="first name"
                    value={user.first_name}
                    ref={fname}
                  />
                  <RowProfileEdit
                    label="last name"
                    value={user.last_name}
                    ref={lname}
                  />
                  <RowProfileEdit label="city" value={user.city} ref={city} />
                  <RowProfileEdit
                    label="country"
                    value={user.country}
                    ref={country}
                  />
                </tbody>
              </table>
              <Button
                type="submit"
                className="btn float-end mt-30 border-gray action-2"
                text="Update"
              />
            </div>
          </form>
        </div>
      </Section>
    </>
  );
};

export default ProfileEdit;
