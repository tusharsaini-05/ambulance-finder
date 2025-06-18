import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Section from "../components/Section";
import Vehicle from "../components/Vehicle";
import Select from "../components/Select";
import PageTitle from "../components/PageTitle";
import Button from "../components/Button";
import { capitalize } from "../util";
import UserApi from "../api/user";
import BookingApi from "../api/booking";

const Search = () => {
  const global = useContext(GlobalContext);
  const history = useHistory();
  const userType = Cookies.get("type");

  const pickup = capitalize(new URLSearchParams(useLocation().search).get("p"));
  const destination = capitalize(
    new URLSearchParams(useLocation().search).get("d"),
  );

  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [vehicleType, setVehicleType] = useState("0");

  const handleChange = (e) => {
    setVehicleType(e.target.value);
  };

  const handleSubmit = (driverId, e) => {
    e.preventDefault();

    if (userType) {
      const bookingData = { pickup, destination, driver: driverId };
      BookingApi.bookDriver(bookingData)
        .then((res) => {
          global.setAlert({
            type: "success",
            message: res.data.message,
          });

          const data = { last_booking: res.data.booking._id };
          UserApi.updateFields(data).catch((err) => {
            global.setAlert({
              type: "danger",
              message: err.response.data.message,
            });
          });
          history.push("/booking");
        })
        .catch((err) => {
          global.setAlert({
            type: "danger",
            message: err.response.data.message,
          });
        });
    } else {
      const redirectUrl = `/signup?p=${pickup}&d=${destination}&driver=${driverId}`;
      Cookies.set("redirectUrl", redirectUrl, { expires: 1 });
      history.push(redirectUrl);
    }
  };

  const selectOptions = [
    { value: 0, label: "ALL" },
    { value: 1, label: "NON AC" },
    { value: 2, label: "AC" },
    { value: 3, label: "FREEZER" },
    { value: 4, label: "ICU" },
  ];

  useEffect(() => {
    UserApi.findVehiclesByDriver({ pickup, destination }).then((res) => {
      setDrivers(res.data.vehicles);
      setFilteredDrivers(res.data.vehicles);
    });
  }, []);

  useEffect(() => {
    setFilteredDrivers(
      drivers.filter((driver) => {
        return driver.vehicles[0].type == vehicleType;
      }),
    );
    if (vehicleType == "0") {
      return setFilteredDrivers(drivers);
    }
  }, [vehicleType]);

  return (
    <>
      <Section className="bg-light ecommerce_2" align="center">
        <div className="d-flex">
          <PageTitle title="Search Result" />

          <Select
            className="pl-4 ms-auto"
            event={handleChange}
            selectedValue={vehicleType}
            options={selectOptions}
          />
        </div>
        {filteredDrivers.map((driver) => {
          return (
            <Vehicle
              style="compact"
              key={driver.vehicles[0]._id}
              {...driver.vehicles[0]}
            >
              <div className="d-flex align-items-center">
                <Link to={`/user/${driver._id}`}>
                  Driver: <span className="underline">{driver.first_name}</span>
                </Link>
                <div className="ml-15 me-auto">
                  <i className="fas fa-star color-red"></i>&nbsp;
                  <span>{driver.rating || "No reviews"}</span>{" "}
                  {driver.rating_count && <span>({driver.rating_count})</span>}
                </div>

                {parseInt(userType) !== 1 && (
                  <Button
                    className="action-2 float-end sm"
                    text="Book"
                    link="# "
                    event={handleSubmit}
                    btnParams={driver.vehicles[0].user_id}
                  />
                )}
              </div>
            </Vehicle>
          );
        })}
      </Section>
    </>
  );
};

export default Search;
