import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import Cookies from "js-cookie";
import Section from "../components/Section";
import RowBookingRecent from "../components/RowBookingRecent";
import PageTitle from "../components/PageTitle";
import BookingApi from "../api/booking";

const BookingRecent = () => {
  const global = useContext(GlobalContext);
  const [bookingRecents, setBookingRecents] = useState([]);
  const userType = Cookies.get("type");

  useEffect(() => {
    BookingApi.findBookingsByUserId(userType)
      .then((res) => {
        setBookingRecents(res.data);
      })
      .catch((err) =>
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        }),
      );
  }, []);

  return (
    <>
      <Section className="bg-light" align="center">
        <PageTitle title="Recent Bookings" />

        {(bookingRecents.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr className="text-center">
                  {(userType == 0 && <th>Driver</th>) || <th>Client</th>}
                  <th>Date</th>
                  <th className="d-none d-sm-table-cell">Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingRecents.map((bookingRecent) => {
                  return (
                    <RowBookingRecent
                      key={bookingRecent._id}
                      {...bookingRecent}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )) || <h5 className="text-center"> No bookings found</h5>}
      </Section>
    </>
  );
};

export default BookingRecent;
