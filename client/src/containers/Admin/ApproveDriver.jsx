import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Section from "../../components/Section";
import RowApproveDriver from "../../components/RowApproveDriver";
import PageTitle from "../../components/PageTitle";
import UserApi from "../../api/user";

const ApproveDriver = () => {
  const global = useContext(GlobalContext);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    UserApi.getDriver()
      .then((res) => {
        setDrivers(res.data);
      })
      .catch((err) =>
        global.setAlert({ type: "danger", message: err.response.data.message }),
      );
  }, []);

  return (
    <>
      <Section className="bg-light vehicle-add" align="center">
        <PageTitle title="Approve Driver" />

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr className="text-center">
                <th>Name</th>
                <th className="d-none d-sm-table-cell">Driving License</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => {
                return <RowApproveDriver key={driver.id} {...driver} />;
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default ApproveDriver;
