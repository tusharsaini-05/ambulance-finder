import React from "react";

const SocialLink = ({ link, color, icon }) => {
  return (
    <>
      <a href={link} className={`mx-15 link color-${color}`}>
        <i className={`fab fa-${icon}`}></i>
      </a>
    </>
  );
};

export default SocialLink;
