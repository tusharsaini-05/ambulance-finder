import React from "react";

const BookingStatus = ({ status }) => {
  return (
    <>
      {(status == 0 && "Pending") ||
        (status == 1 && "Rejected") ||
        (status == 2 && "Accepted") ||
        (status == 3 && "Arrived") ||
        (status == 4 && "Started") ||
        (status == 5 && "Completed") ||
        (status == 6 && "Driver Feedback Submitted") ||
        (status == 7 && "Client Feedback Submitted")}
    </>
  );
};

export default BookingStatus;
