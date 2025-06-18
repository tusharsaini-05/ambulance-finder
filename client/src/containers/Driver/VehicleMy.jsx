import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Cookies from "js-cookie";
import Section from "../../components/Section";
import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import PageTitle from "../../components/PageTitle";
import Vehicle from "../../components/Vehicle";
import VehicleApi from "../../api/vehicle";
import UserApi from "../../api/user";

const VehicleMy = () => {
  const id = Cookies.get("userId");
  const global = useContext(GlobalContext);

  const [vehicles, setVehicles] = useState([]);
  const [driverStatus, setDriverStatus] = useState();

  const getVehicles = (id) => {
    VehicleApi.getVehiclesByUserId(id)
      .then((res) => {
        setVehicles(res.data);
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };
  const getDriverStatus = (id) => {
    UserApi.getDriverStatus(id)
      .then((res) => {
        setDriverStatus(res.data);
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };
  useEffect(() => {
    getVehicles(id);
    getDriverStatus(id);
  }, []);

  const tooltipText = !driverStatus
    ? "Account not approved"
    : "Only one vehicle allowed";
  return (
    <>
      <Section className="bg-light vehicle-add ecommerce_2" align="center">
        <div className="d-flex">
          <PageTitle title="My Vehicle" />
          {(vehicles.length == 0 && driverStatus && (
            <Button
              link={`/vehicle/add`}
              className="action-1 ms-auto"
              text="Add Vehicle"
            />
          )) || (
            <Tooltip text={tooltipText} className="ms-auto">
              <Button
                link="# "
                className="action-1 disabled"
                text="Add Vehicle"
              />
            </Tooltip>
          )}
        </div>

        {(vehicles.length > 0 &&
          vehicles.map((vehicle) => {
            return (
              <Vehicle btnText="Modify" key={vehicle._id} {...vehicle}>
                <div className="d-flex justify-content-end">
                  <Button
                    link={`/vehicle/modify/${vehicle._id}`}
                    className="action-2"
                    text="Modify"
                  />
                </div>
              </Vehicle>
            );
          })) || <div className="h5 text-center">No vehicle found!</div>}
      </Section>
    </>
  );
};

export default VehicleMy;
