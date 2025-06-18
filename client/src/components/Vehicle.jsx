import React from "react";

const Vehicle = ({
  name,
  type,
  cost,
  seat,
  vehicle_photo,
  features: { wheelchair, oxygen, stretcher },
  style = null,
  children,
}) => {
  let parentDiv = null;
  let spacing = null;

  if (style == "compact") {
    parentDiv = "col-xl-4 col-lg-4 col-md-6 col-sm-12";
    spacing = "mb-15 px-15";
  } else {
    parentDiv = "col-xl-6 col-lg-6 col-md-6 col-sm-12";
    spacing = "mb-30 px-30";
  }
  return (
    <>
      <div className={parentDiv}>
        <div
          className={`mx-auto ${spacing} pt-15 pb-15 radius20 color-heading product big`}
        >
          <div className="d-flex flex-column justify-content-between">
            <div className="d-flex">
              <div className="f-14 semibold text-uppercase sp-20 brand me-auto">
                {(type == 1 && "NON AC") ||
                  (type == 2 && "AC") ||
                  (type == 3 && "FREEZER") ||
                  (type == 4 && "ICU")}
              </div>
              <span className="mr-15 semibold text-uppercase sp-20 action-2 f-18">
                ${cost}/km
              </span>
            </div>
            <div className="f-22 semibold color-main title">{name}</div>
            <ul className="m-0 pl-10">
              <li
                className={`float-left mr-15 ${
                  !wheelchair && "text-decoration-line-through"
                }`}
              >
                Wheel Chair
              </li>
              <li
                className={`float-left mr-15 ${
                  !oxygen && "text-decoration-line-through"
                }`}
              >
                Oxygen
              </li>
              <li
                className={`float-left mr-15 ${
                  !stretcher && "text-decoration-line-through"
                }`}
              >
                Stretcher
              </li>
              <li className="float-left mr-15">
                Seat: <span>{seat}</span>
              </li>
            </ul>
            {children}

            <div className="d-block">
              <img
                src={`/photos/vehicle/${vehicle_photo}`}
                alt=""
                className="radius10 mt-25 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vehicle;
