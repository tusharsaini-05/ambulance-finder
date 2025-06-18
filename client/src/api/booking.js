import axios from "axios";
import Cookies from "js-cookie";

const api_uri = `/api/booking`;
const userType = parseInt(Cookies.get("type"));

const getToken = () => {
  const token = Cookies.get("token");
  if (token === null) return;
  return token;
};

const BookingApi = {
  bookDriver(bookingData) {
    if (userType !== 1) {
      return axios.post(`${api_uri}/bookDriver`, bookingData, {
        headers: { authorization: getToken() },
      });
    }
  },
  bookDriverFromRedirect(redirectUrl) {
    const pickup = redirectUrl.split("?p=").pop().split("&d=")[0];
    const destination = redirectUrl.split("&d=").pop().split("&driver=")[0];
    const driver = redirectUrl.split("&driver=").pop();
    const bookingData = {
      pickup,
      destination,
      driver,
    };
    return axios.post(`${api_uri}/bookDriver`, bookingData, {
      headers: { authorization: getToken() },
    });
  },
  findBookingsByUserId(userType) {
    return axios.get(`${api_uri}/findBookingsByUserId`, {
      headers: { authorization: getToken() },
      params: { userType },
    });
  },
  findBookingVehicleByBookingId(bookingId) {
    return axios.get(`${api_uri}/findBookingVehicleByBookingId`, {
      headers: { authorization: getToken() },
      params: { bookingId },
    });
  },
  updateStatus(bookingId, newStatus) {
    return axios.get(`${api_uri}/updateStatus`, {
      headers: { authorization: getToken() },
      params: { bookingId, newStatus },
    });
  },
};
export default BookingApi;
