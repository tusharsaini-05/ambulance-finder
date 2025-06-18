import React from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import SocialLink from "./SocialLink";

const Footer = () => {
  const type = Cookies.get("type");
  return (
    <>
      <footer className="py-3 bg-dark text-center footer_1">
        <div className="container-fluid px-xl-0">
          <div className="row d-flex bg-dark lh-40 links">
            <div className="col-lg-4 col-md-4 col-sm-6 text-sm-right">
              <Link
                to="/"
                className="link color-white f-18 mx-15"
                activeClassName="action-2"
              >
                Home
              </Link>
              {!type && (
                <>
                  <Link
                    to="/signup"
                    className="link color-white f-18 mx-15"
                    activeClassName="action-2"
                  >
                    Signup
                  </Link>
                  <Link
                    to="/admin/signin"
                    className="link color-white f-18 mx-15"
                    activeClassName="action-2"
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 order-2 order-md-1 pb-2 text-center color-heading">
              &copy; 2021 All rights reserved.
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 order-1 order-md-2 text-sm-left">
              <SocialLink
                link="https://facebook.com"
                color="white"
                icon="facebook"
              />
              <SocialLink
                link="https://twitter.com"
                color="white"
                icon="twitter"
              />
              <SocialLink
                link="https://instagram.com"
                color="white"
                icon="instagram"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
