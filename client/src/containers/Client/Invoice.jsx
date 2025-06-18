import React from "react";
import { useParams } from "react-router-dom";
import Section from "../../components/Section";
import Block from "../../components/Block";
import Logo from "../../components/Logo";
import Button from "../../components/Button";

const Invoice = () => {
  const { bookId } = useParams();

  const handleDownload = () => {
    global.setAlert({
      type: "success",
      message: "Downloading invoice",
    });
  };
  const rowsBooking = [
    { label: "Vehicle Name", value: "Rocket Ambulance" },
    { label: "Booking Date", value: "12-01-2021" },
    { label: "Booking Time", value: "5:30 PM" },
    { label: "Pickup", value: "Uttara" },
    { label: "Destination", value: "Kuril" },
    { label: "Fare/KM", value: "$8" },
    { label: "Distance", value: "9.9KM" },
  ];
  const rowsPayment = [
    { label: "Payment ID", value: "1324654" },
    { label: "Payment Status", value: "Paid" },
    { label: "Payment Date", value: "12-01-2021" },
    { label: "Payment Time", value: "5:30 PM" },
    { label: "Payment Method", value: "Cash" },
  ];
  return (
    <>
      <Section className="bg-light" align="center">
        <div className="row">
          <Logo name="Ambulance Finder" color="red" />
          <h5 className="py-3">Booking #{bookId}</h5>
          <div className="col-lg-6">
            <Block heading="Booking Details" rows={rowsBooking} />
          </div>
          <div className="col-lg-6">
            <Block heading="Payment Details:" rows={rowsPayment} />
            <Button
              className={`mt-3 float-end action-2`}
              link="# "
              text="Download"
              event={handleDownload}
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default Invoice;
