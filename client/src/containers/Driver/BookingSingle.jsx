import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import Button from "../../components/Button";
import Block from "../../components/Block";
import UserCard from "../../components/UserCard";
import BookingStatus from "../../components/BookingStatus";
import Modal from "../../components/Modal";
import RatingStar from "../../components/RatingStar";
import Tooltip from "../../components/Tooltip";
import BookingApi from "../../api/booking";
import ReviewApi from "../../api/review";
import UserApi from "../../api/user";

const BookingSingle = () => {
  const { id } = useParams();
  const global = useContext(GlobalContext);

  const [booking, setBooking] = useState();
  const [validAccept, setValidAccept] = useState(false);

  // status section
  const [status, setStatus] = useState();
  const handleStatus = (newStatus) => {
    BookingApi.updateStatus(id, newStatus)
      .then(() => {
        setStatus(newStatus);
        // set driver availability if booking accepted or completed
        if (newStatus == 2) {
          const data = { last_booking: booking._id, available: false };
          UserApi.updateFields(data).catch((err) => {
            global.setAlert({
              type: "danger",
              message: err.response.data.message,
            });
          });
        } else if (newStatus == 5) {
          const data = { available: true };
          UserApi.updateFields(data).catch((err) => {
            global.setAlert({
              type: "danger",
              message: err.response.data.message,
            });
          });
        }
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };

  // modal section
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  // modal body data
  const [rating, setRating] = useState(4);
  const review_details = useRef(null);

  const submitModal = () => {
    const reviewData = {
      receiver: booking.client._id,
      rating: rating + 1,
      details: review_details.current.value,
    };
    // sumbit review
    ReviewApi.createReview(reviewData)
      .then((res) => {
        // set status
        const newStatus = 6;
        BookingApi.updateStatus(id, newStatus)
          .then(() => {
            setStatus(newStatus);
          })
          .catch((err) => {
            global.setAlert({
              type: "danger",
              message: err.response.data.message,
            });
          });
        //update receiver profile rating and rating_count
        const profileRating = {
          receiver: booking.client._id,
          oldRating: booking.client.rating,
          oldRatingCount: booking.client.rating_count,
          newRating: rating + 1,
        };
        UserApi.updateProfileRating(profileRating)
          .then(() => {
            global.setAlert({ type: "success", message: res.data.message });
          })
          .catch((err) => {
            global.setAlert({
              type: "danger",
              message: err.response.data.message,
            });
          });
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
    closeModal();
  };
  const getLastBookingStatus = () => {
    UserApi.getUserLastBooking()
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          //check if last booking active
          if (
            res.data.last_booking.status >= 2 &&
            res.data.last_booking.status <= 4
          ) {
            setValidAccept(false);
          } else {
            setValidAccept(true);
          }
        }
        // if no last booking found
        else {
          setValidAccept(true);
        }
      })
      .catch((err) => {
        // console.log('2res.data.user.status')
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };
  useEffect(() => {
    BookingApi.findBookingVehicleByBookingId(id)
      .then((res) => {
        setBooking(res.data);
        setStatus(res.data.status);

        //when single booking status pending, get last booking status and check if user already accepted another booking
        if (res.data.status == 0) {
          getLastBookingStatus();
        }
      })
      .catch((err) => {
        global.setAlert({ type: "danger", message: err.response.data.message });
      });
  }, []);

  let rowsBooking;
  if (booking) {
    rowsBooking = [
      { label: "Vehicle Name", value: booking.driver.vehicles[0].name },
      {
        label: "Booking Time",
        value: booking.createdAt.slice(0, 19).replace("T", " | "),
      },
      { label: "Pickup", value: booking.pickup },
      { label: "Destination", value: booking.destination },
      { label: "Fare/KM", value: `$ ${booking.driver.vehicles[0].cost}` },
    ];
  }

  return (
    <>
      <Section className="bg-light" align="center">
        <div className="col-lg-12">
          {/* modal section */}
          {showModal && (
            <>
              <Modal title="Submit Review" closeEvent={closeModal}>
                {/* modal body */}
                <form>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">
                      Rating:
                    </label>
                    <span className="rating">
                      <RatingStar
                        stars={5}
                        rating={rating}
                        setRating={setRating}
                      />
                    </span>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message-text" className="col-form-label">
                      Details:
                    </label>
                    <textarea
                      ref={review_details}
                      className="input w-full radius10 border-gray focus-action-1 color-heading placeholder-main text-left"
                    ></textarea>
                  </div>
                  <Button
                    className={`sm action-1`}
                    link="# "
                    text="Submit"
                    event={submitModal}
                  />
                </form>
              </Modal>
            </>
          )}
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <h2>Booking</h2>
              <small>#{id}</small>
              <h5 className="pt-2">
                Status: <BookingStatus status={status} />
              </h5>
            </div>
          </div>
          <div className="row justify-content-center pt-4">
            <div className="col-lg-6">
              {status == 0 && (
                <>
                  <div className="row pb-4">
                    <div className="col-lg-12 d-flex">
                      {(validAccept === true && (
                        <Button
                          className={`sm mr-5 action-1`}
                          link="# "
                          text="Accept"
                          event={handleStatus}
                          btnParams={2}
                        />
                      )) || (
                        <Tooltip text="Already have active booking">
                          <Button
                            className={`sm mr-5 action-1 disabled`}
                            text="Accept"
                          />
                        </Tooltip>
                      )}
                      <Button
                        className={`sm mr-5 action-2`}
                        link="# "
                        text="Reject"
                        event={handleStatus}
                        btnParams={1}
                      />
                    </div>
                  </div>
                </>
              )}
              {status >= 2 && status <= 4 && (
                <>
                  <div className="row pb-4">
                    <div className="col-lg-12 d-flex">
                      <Button
                        className={`sm mr-5 primary ${
                          status >= 3 && "disabled"
                        }`}
                        link="# "
                        text="Mark as Arrived"
                        event={handleStatus}
                        btnParams={3}
                      />
                      <Button
                        className={`sm mr-5 action-1 ${
                          status >= 4 && "disabled"
                        }`}
                        link="# "
                        text="Mark as Started"
                        event={handleStatus}
                        btnParams={4}
                      />
                      <Button
                        className={`sm mr-5 action-2 ${
                          status >= 5 && "disabled"
                        }`}
                        link="# "
                        text="Mark as Completed"
                        event={handleStatus}
                        btnParams={5}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* review modal */}
              {status == 5 && (
                <>
                  <div className="row pb-4">
                    <div className="col-lg-12 d-flex">
                      <Button
                        className={`sm action-2 ${status >= 6 && "disabled"}`}
                        link="# "
                        text="Submit Review"
                        event={openModal}
                      />
                    </div>
                  </div>
                </>
              )}
              {booking && <UserCard title="Client" {...booking.client} />}
            </div>
            <div className="col-lg-6 mt-3 mt-lg-0">
              {rowsBooking && (
                <Block heading="Booking Details" rows={rowsBooking} />
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default BookingSingle;
