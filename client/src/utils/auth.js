import Cookies from "js-cookie"

/**
 * Set authentication tokens in cookies
 * @param {string} userId - User ID
 * @param {number} userType - User type (0 for client, 1 for driver)
 * @param {string} token - Authentication token
 */
export const setAuthTokens = (userId, userType, token) => {
  Cookies.set("userId", userId, { expires: 1 })
  Cookies.set("type", userType, { expires: 1 })
  Cookies.set("token", token, { expires: 1 })
}

/**
 * Get current user ID from cookies
 * @returns {string|null} User ID or null if not logged in
 */
export const getUserId = () => {
  return Cookies.get("userId") || null
}

/**
 * Get user type from cookies
 * @returns {number|null} User type (0 for client, 1 for driver) or null if not logged in
 */
export const getUserType = () => {
  const type = Cookies.get("type")
  return type ? Number.parseInt(type) : null
}

/**
 * Get authentication token from cookies
 * @returns {string|null} Authentication token or null if not logged in
 */
export const getAuthToken = () => {
  return Cookies.get("token") || null
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  return !!getUserId() && !!getAuthToken()
}

/**
 * Check if user is a client
 * @returns {boolean} True if user is a client
 */
export const isClient = () => {
  return isLoggedIn() && getUserType() === 0
}

/**
 * Check if user is a driver
 * @returns {boolean} True if user is a driver
 */
export const isDriver = () => {
  return isLoggedIn() && getUserType() === 1
}

/**
 * Logout user by removing cookies
 */
export const logout = () => {
  Cookies.remove("userId")
  Cookies.remove("type")
  Cookies.remove("token")
  window.location.replace("/signin")
}
