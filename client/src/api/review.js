import axios from "axios";
import Cookies from "js-cookie";

const api_uri = `/api/review`;

const getToken = () => {
  const token = Cookies.get("token");
  if (token === null) return "";
  return token;
};

const ReiviewApi = {
  getReviewsByUserId(id) {
    return axios.post(`${api_uri}/getReviewsByUserId`, id, {
      headers: { authorization: getToken() },
    });
  },
  createReview(reviewData) {
    return axios.post(`${api_uri}/createReview`, reviewData, {
      headers: { authorization: getToken() },
    });
  },
  getReviewsByReceiver(receiverId) {
    return axios.get(`${api_uri}/getReviewsByReceiver`, {
      headers: { authorization: getToken() },
      params: { receiverId },
    });
  },
};
export default ReiviewApi;
