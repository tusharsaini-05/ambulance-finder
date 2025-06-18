import React from "react";
import { NavLink } from "react-router-dom";

const NavMobile = ({ navs }) => {
  return (
    <>
      <div className="mt-4">
        {navs.map((nav, index) => (
          <li class="nav-item pt-2">
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
          </li>
        ))}
      </div>
    </>
  );
};

export default NavMobile;
