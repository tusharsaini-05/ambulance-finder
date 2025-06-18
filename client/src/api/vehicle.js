import axios from "axios";
import Cookies from "js-cookie";

const api_uri = `/api/vehicle`;

const getToken = () => {
  const token = Cookies.get("token");
  if (token === null) return "";
  return token;
};

const VehicleApi = {
  createVehicle(vehicleData) {
    return axios.post(`${api_uri}/create`, vehicleData, {
      headers: {
        authorization: getToken(),
        "content-type": "multipart/form-data",
      },
    });
  },
  updateVehicle(vehicleData) {
    return axios.patch(`${api_uri}/updateVehicle`, vehicleData, {
      headers: {
        authorization: getToken(),
        "content-type": "multipart/form-data",
      },
    });
  },
  updateVehicleWithImg(vehicleData) {
    return axios.patch(`${api_uri}/updateVehicleWithImg`, vehicleData, {
      headers: {
        authorization: getToken(),
        "content-type": "multipart/form-data",
      },
    });
  },
  getVehiclesByUserId(userId) {
    return axios.post(`${api_uri}/getVehiclesByUserId`, userId, {
      headers: { authorization: getToken() },
    });
  },
  getVehicleById(vehicleId) {
    return axios.post(`${api_uri}/getVehicleById`, vehicleId, {
      headers: { authorization: getToken() },
    });
  },
};
export default VehicleApi;
