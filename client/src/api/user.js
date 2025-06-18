import axios from "axios"
import { getAuthToken } from "../utils/auth"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Configure axios to include auth token in all requests
const configureAuthHeader = () => {
  const token = getAuthToken()
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
}

const UserApi = {
  // Check if user exists by phone number
  isUserExist: (phone) => {
    return axios.get(`${API_URL}/user/isUserExist?phone=${phone}`)
  },

  // Create a new client user
  createClient: (userData) => {
    return axios.post(`${API_URL}/user/client`, userData)
  },

  // Create a new driver user
  createDriver: (userData) => {
    return axios.post(`${API_URL}/user/driver`, userData)
  },

  // Check user credentials (for login)
  checkCredentials: (credentials) => {
    return axios.post(`${API_URL}/user/login`, credentials)
  },

  // Login with phone (for clients)
  loginWithPhone: (phone) => {
    return axios.post(`${API_URL}/user/loginWithPhone`, { phone })
  },

  // Get user profile
  getProfile: (userId) => {
    return axios.get(`${API_URL}/user/${userId}`, configureAuthHeader())
  },

  // Update user profile
  updateProfile: (userId, userData) => {
    return axios.put(`${API_URL}/user/${userId}`, userData, configureAuthHeader())
  },

  // Get user reviews
  getReviews: (userId) => {
    return axios.get(`${API_URL}/review/user/${userId}`)
  },

  // Get driver status
  getDriverStatus: (driverId) => {
    return axios.get(`${API_URL}/user/driver/status/${driverId}`, configureAuthHeader())
  },

  // Update driver status
  updateDriverStatus: (driverId, status) => {
    return axios.put(`${API_URL}/user/driver/status/${driverId}`, { status }, configureAuthHeader())
  },

  // Get all drivers pending approval (admin only)
  getPendingDrivers: () => {
    return axios.get(`${API_URL}/user/driver/pending`, configureAuthHeader())
  },

  // Approve driver (admin only)
  approveDriver: (driverId) => {
    return axios.put(`${API_URL}/user/driver/approve/${driverId}`, {}, configureAuthHeader())
  },
}

export default UserApi
