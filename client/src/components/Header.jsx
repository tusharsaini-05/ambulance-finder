import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";
import NavMobile from "./../components/NavMobile";

const Header = () => {
  const type = Cookies.get("type");

  const handleSignout = () => {
    Cookies.remove("userId");
    Cookies.remove("type");
    Cookies.remove("token");
    Cookies.remove("redirectUrl");
    window.location.replace("/");
  };

  const generalNavs = [
    { link: "/signin", btnText: "Signin" },
    { link: "/signup", btnText: "Signup" },
  ];
  const clientNavs = [
    { link: "/dashboard", btnText: "Dashboard" },
    { link: "/booking", btnText: "Bookings" },
    { link: "/profile", btnText: "Profile" },
    { link: "/#", btnText: "Signout", event: handleSignout },
  ];
  const driverNavs = [
    { link: "/dashboard", btnText: "Dashboard" },
    { link: "/booking", btnText: "Bookings" },
    { link: "/vehicle", btnText: "Vehicles" },
    { link: "/profile", btnText: "Profile" },
    { link: "/#", btnText: "Signout", event: handleSignout },
  ];
  const adminNavs = [
    { link: "/approve/driver", btnText: "Drivers" },
    { link: "/#", btnText: "Signout", event: handleSignout },
  ];
  const currentNavs = !type
    ? generalNavs
    : type == 0
      ? clientNavs
      : type == 1
        ? driverNavs
        : adminNavs;

  const [displayWidth, setDisplayWidth] = useState();
  const [showMobileNav, setShowMobileNav] = useState(false);

  const handleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };
  useEffect(() => {
    setDisplayWidth(window.innerWidth);
  }, []);

  const isMobile = displayWidth < 576;

  return (
    <>
      {/* Header */}
      <header className="bg-dark header_2">
        <nav className="header_menu_2 transparent pt-15 pb-15">
          <div className="container px-xl-0">
            <div className="row justify-content-between align-items-baseline">
              {(isMobile && (
                <>
                  <div className="col-sm-12">
                    <Logo name="Ambulance Finder" />
                    <i
                      onClick={handleMobileNav}
                      class="fa fa-bars color-white f-30 position-absolute top-0 end-0 mr-15 mb-5 lh-1"
                    ></i>
                  </div>
                  {showMobileNav && <NavMobile navs={currentNavs} />}
                </>
              )) || (
                <>
                  <div className="col-md-5">
                    <Logo name="Ambulance Finder" />
                  </div>
                  <div className="col-md-6 nav-inner d-flex justify-content-end align-items-center">
                    {currentNavs.map((nav, index) => (
                      <NavLink
                        exact
                        to={nav.link}
                        key={index}
                        className="link color-white f-18 mx-15"
                        activeClassName="active"
                        onClick={nav.event || null}
                      >
                        {nav.btnText}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
