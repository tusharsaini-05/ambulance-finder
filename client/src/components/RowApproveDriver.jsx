import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import UserApi from "../api/user";
import Button from "./Button";

const RowApproveDriver = ({
  _id,
  first_name,
  last_name,
  driving_license,
  approved,
  license_photo,
}) => {
  const global = useContext(GlobalContext);
  const [status, setStatus] = useState(approved);

  const handleChange = (data, e) => {
    e.preventDefault();
    const approved = data.approved == 1 ? true : false;
    const id = data.id;

    UserApi.setAccountStatus({ id, approved })
      .then((res) => {
        setStatus(res.data.user.approved);
      })
      .catch((err) => {
        global.setAlert({ type: "danger", message: err.response.data.message });
      });
  };
  const handleClickLicense = () => {
    window.open(`/photos/license/${license_photo}`, "_blank");
  };
  const handleClickProfile = () => {
    window.open(`/user/${_id}`, "_blank");
  };
  return (
    <>
      <tr className="text-center">
        <td className="clickable" onClick={handleClickProfile}>
          {first_name + " " + last_name}
        </td>
        <td
          className="clickable d-none d-sm-table-cell"
          onClick={handleClickProfile}
        >
          {driving_license}
        </td>
        <td className="clickable" onClick={handleClickProfile}>
          {(status === true && "Approved") || "Blocked"}
        </td>
        <td>
          <button
            className="btn border-gray color-main sm"
            onClick={handleClickLicense}
          >
            License
          </button>
          <Button
            className={`sm action-1`}
            color="action-1"
            link="# "
            text="Approve"
            event={handleChange}
            btnParams={{ id: _id, approved: 1 }}
          />
          <Button
            className={`sm action-2`}
            link="# "
            text="Block"
            event={handleChange}
            btnParams={{ id: _id, approved: 0 }}
          />
        </td>
      </tr>
    </>
  );
};

export default RowApproveDriver;
