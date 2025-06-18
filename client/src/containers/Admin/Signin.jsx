import React, { useContext, useRef } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Cookies from "js-cookie";
import Section from "../../components/Section";
import PageTitle from "../../components/PageTitle";
import UserApi from "../../api/user";

const Signin = () => {
  const global = useContext(GlobalContext);

  const phone = useRef(null);
  const pass = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      return;
    }
    const number = phone.current.value;
    const password = pass.current.value;
    UserApi.checkCredentials({ phone: number, password })
      .then((res) => {
        //admin login
        if (res.data.valid) {
          Cookies.set("userId", res.data.user._id, { expires: 1 });
          Cookies.set("type", res.data.user.type, { expires: 1 });
          Cookies.set("token", res.headers.authorization, { expires: 1 });
          window.location.replace("/approve/driver");
        } else {
          global.setAlert({ type: "danger", message: res.data.message });
        }
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };

  return (
    <>
      <Section className="bg-light form_2" align="center">
        <div className="col-lg-5 col-md-6 col-sm-10 text-center">
          <PageTitle title="Sign In" />

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-15">
              <input
                ref={phone}
                type="text"
                name="phone"
                placeholder="Username"
                required="required"
                className="input flex-fill border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
              />
            </div>
            <div className="input-group mb-15">
              <input
                ref={pass}
                type="password"
                name="password"
                placeholder="Password"
                required="required"
                className="input flex-fill border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
              />
            </div>
            <div className="d-flex flex-wrap justify-content-center align-items-center buttons mt-25">
              <button
                className="btn mr-20 mb-20 mb-xl-0 w-210 action-2"
                type="submit"
              >
                Signin
              </button>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
};

export default Signin;
