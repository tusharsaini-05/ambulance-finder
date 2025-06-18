import React, { useRef, useState } from "react";
import Section from "../../components/Section";
import Button from "../../components/Button";
import Select from "../../components/Select";
import PageTitle from "../../components/PageTitle";

const Checkout = () => {
  const [type, setType] = useState(0);

  const amount = useRef(0);

  const handleChange = (e) => {
    setType(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (type == 0) {
      const paymentData = {
        amount: amount.current.innerText,
      };
    }
  };

  const selectOptions = [
    { value: 1, label: "Cash" },
    // { value: 0, label: 'Credit Card' },
  ];
  return (
    <>
      <Section className="bg-light pricing_table_1" align="center">
        <PageTitle title="Checkout" />

        <div className="col-lg-6 align-self-center">
          <div className="pl-15 radius10 block">
            <div className="d-flex pt-15">
              <span className="align-self-center me-auto">Payment: </span>
              <Select
                className="pl-4"
                event={handleChange}
                selectedValue={type}
                options={selectOptions}
              />
            </div>
            <div className="item f-18">
              <b>Rocket Ambulance</b>
            </div>
            <div className="item">
              Route: <b>Uttara - Kuril</b>
            </div>
            <div className="item">
              Cost: <b>9.9</b> km X $<b>8</b>
            </div>
            <div className="item">
              <div className="f-22 title">Total</div>
              <div className="d-flex f-58 relative price">
                <span className="absolute ml-15 f-16">$</span>
                <b ref={amount} className="ml-15 me-auto">
                  79.2
                </b>
                <Button
                  className="action-2 mr-10"
                  link="# "
                  text="Confirm"
                  type="submit"
                  event={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Checkout;
