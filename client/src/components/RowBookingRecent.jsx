import React from "react";
import { useHistory } from "react-router-dom";
import BookingStatus from "./BookingStatus";

const RowBookingRecent = ({
  _id,
  driver: { first_name } = null,
  client: { phone } = null,
  createdAt,
  status,
}) => {
  const history = useHistory();

  const handleClick = (bookingId) => {
    history.push(`/booking/${bookingId}`);
  };
  return (
    <tr className="text-center clickable" onClick={() => handleClick(_id)}>
      {first_name && <td>{first_name}</td>}
      {phone && <td>{phone}</td>}
      <td>{createdAt && createdAt.slice(0, 19).split("T")[0]}</td>
      <td className="d-none d-sm-table-cell">
        {createdAt && createdAt.slice(0, 19).split("T")[1]}
      </td>
      <td>
        <BookingStatus status={status} />
      </td>
    </tr>
  );
};

export default RowBookingRecent;
