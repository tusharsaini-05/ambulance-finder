import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Cookies from "js-cookie";
import Section from "../../components/Section";
import Button from "../../components/Button";
import PageTitle from "../../components/PageTitle";
import VehicleApi from "../../api/vehicle";

const VehicleAdd = () => {
  const id = Cookies.get("userId");
  const history = useHistory();
  const global = useContext(GlobalContext);

  const name = useRef(null);
  const cost = useRef(0);
  const seat = useRef(0);
  const numberPlate = useRef(null);
  const type = useRef(null);
  const vehiclePhoto = useRef(null);
  const [wheelchair, setWheelchair] = useState(false);
  const [oxygen, setOxygen] = useState(false);
  const [stretcher, setStretcher] = useState(false);

  const handleSelectedChange = (e) => {
    if (e.target.name == "wheelchair") {
      setWheelchair(!wheelchair);
    } else if (e.target.name == "oxygen") {
      setOxygen(!oxygen);
    } else if (e.target.name == "stretcher") {
      setStretcher(!stretcher);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      return;
    }
    if (!(type.current.value < 4)) {
      global.setAlert({
        type: "danger",
        message: "Invalid vehicle type",
      });
      return;
    }

    const features = {
      wheelchair,
      oxygen,
      stretcher,
    };
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("name", name.current.value);
    formData.append("type", parseInt(type.current.value) + 1);
    formData.append("cost", cost.current.value);
    formData.append("seat", seat.current.value);
    formData.append("number_plate", numberPlate.current.value);
    formData.append("features", JSON.stringify(features));
    formData.append("vehicle_photo", vehiclePhoto.current.files[0]);

    VehicleApi.createVehicle(formData)
      .then((res) => {
        global.setAlert({ type: "success", message: res.data.message });
        window.location.replace("/dashboard");
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response.data.message,
        });
      });
  };
  const getVehicles = (id) => {
    VehicleApi.getVehiclesByUserId(id)
      .then((res) => {
        // if already added a vehicle redirect
        if (res.data.length > 0) {
          history.push("/vehicle");
        }
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
  }, []);
  return (
    <>
      <Section className="bg-light vehicle-add" align="center">
        <PageTitle title="Add Vehicle" />

        <form onSubmit={handleSubmit}>
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-6">
                <input
                  ref={name}
                  name="name"
                  placeholder="Name"
                  required="required"
                  type="text"
                  className="input mb-15 w-full border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
                />
                <input
                  ref={cost}
                  name="cost"
                  placeholder="Fare/KM"
                  required="required"
                  type="number"
                  className="input mb-15 w-full border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
                />

                <input
                  ref={seat}
                  name="seat"
                  placeholder="Seat"
                  required="required"
                  type="number"
                  className="input mb-15 w-full border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
                />
                <input
                  ref={numberPlate}
                  name="numberPlate"
                  placeholder="Number Plate"
                  required="required"
                  type="text"
                  className="input mb-15 w-full border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
                />
              </div>

              <div className="col-lg-6">
                <select
                  ref={type}
                  className="input w-full border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
                  aria-label="Default select example"
                  id="type"
                  defaultValue="default"
                  required
                >
                  <option value="default" disabled>
                    Type
                  </option>
                  <option value={0}>Non AC</option>
                  <option value={1}>AC</option>
                  <option value={2}>Freezer</option>
                  <option value={3}>ICU</option>
                </select>

                <div className="input-group mt-15">
                  <span className="f-18 bold">Vehicle Photo:</span>
                  <input
                    ref={vehiclePhoto}
                    type="file"
                    className="input form-control"
                    id="inputGroupFile02"
                    required
                  />
                </div>

                <div className="d-inline-flex w-full mt-20">
                  <span className="f-18 bold">Features:</span>
                  <div>
                    <div className="form-check">
                      <input
                        onClick={(e) => handleSelectedChange(e)}
                        type="checkbox"
                        name="wheelchair"
                        id="wheelchair"
                        className="input form-check-input d-none border-transparent-white focus-action-1"
                      />
                      <label htmlFor="wheelchair">Wheelchair</label>
                    </div>

                    <div className="form-check">
                      <input
                        onClick={(e) => handleSelectedChange(e)}
                        type="checkbox"
                        name="oxygen"
                        id="oxygen"
                        className="input d-none border-transparent-white focus-action-1"
                      />
                      <label htmlFor="oxygen">Oxygen</label>
                    </div>

                    <div className="form-check">
                      <input
                        onClick={(e) => handleSelectedChange(e)}
                        type="checkbox"
                        name="stretcher"
                        id="stretcher"
                        className="input d-none border-transparent-white focus-action-1"
                      />
                      <label htmlFor="stretcher">Stretcher</label>
                    </div>
                  </div>
                </div>

                <Button
                  className="float-end mt-15 mr-15 btn border-gray action-2"
                  text="Confirm"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </form>
      </Section>
    </>
  );
};

export default VehicleAdd;
