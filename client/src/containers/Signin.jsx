"use client"

import { useContext, useRef, useState } from "react"
import { GlobalContext } from "../context/GlobalContext"
import { Link } from "react-router-dom"
import PhoneInput from "react-phone-number-input"
import Section from "../components/Section"
import PageTitle from "../components/PageTitle"
import UserApi from "../api/user"
import BookingApi from "../api/booking"
import { setAuthTokens } from "../utils/auth"
import "react-phone-number-input/style.css"

const Signin = () => {
  const global = useContext(GlobalContext)
  const [showPass, setShowPass] = useState(false)
  const [phone, setPhone] = useState()
  const pass = useRef(null)

  const handlePhoneSubmit = (e) => {
    e.preventDefault()
    const number = phone

    if (!number) {
      global.setAlert({ type: "danger", message: "Invalid input" })
      return
    }

    UserApi.isUserExist(number)
      .then((res) => {
        // Client found, proceed with client login
        if (res.data.exist && res.data.type === 0) {
          // For clients, we'll now use a password-based approach instead of Firebase
          setShowPass(true)
        }
        // Driver found, show password
        else if (res.data.exist && res.data.type === 1) {
          setShowPass(true)
        }
        // User not found, show error
        else {
          global.setAlert({ type: "danger", message: res.data.message })
        }
      })
      // Server error
      .catch((err) => {
        global.setAlert({ type: "danger", message: err.response?.data?.message || "Server error" })
      })
  }

  const handlePassSubmit = (e) => {
    e.preventDefault()
    const number = phone
    const password = pass.current.value

    if (!number || password.trim().length === 0) {
      global.setAlert({ type: "danger", message: "Invalid input" })
      return
    }

    UserApi.checkCredentials({ phone: number, password })
      .then((res) => {
        // Login successful
        if (res.data.valid) {
          // Use the auth utility to set tokens
          setAuthTokens(res.data.user._id, res.data.user.type, res.headers.authorization)

          // Check if redirected from booking page
          if (!localStorage.getItem("redirectUrl")) {
            window.location.replace("/dashboard")
          } else {
            BookingApi.bookDriverFromRedirect(localStorage.getItem("redirectUrl"))
              // If booking successful
              .then((res) => {
                global.setAlert({
                  type: "success",
                  message: res.data.message,
                })
                window.location.replace("/booking")
              })
              .catch((err) => {
                global.setAlert({
                  type: "danger",
                  message: err.response?.data?.message || "Booking error",
                })
              })
          }
        } else {
          global.setAlert({ type: "danger", message: res.data.message })
        }
      })
      .catch((err) => {
        global.setAlert({
          type: "danger",
          message: err.response?.data?.message || "Authentication error",
        })
      })
  }

  return (
    <>
      <Section className="bg-light form_2" align="center">
        <div className="col-lg-5 col-md-6 col-sm-10 text-center">
          <PageTitle title="Sign In" />

          <form>
            <div className="input-group mb-15">
              <PhoneInput
                placeholder="Phone"
                value={phone}
                onChange={setPhone}
                defaultCountry="BD"
                international
                countryCallingCodeEditable={false}
                className="input d-flex flex-fill border-gray focus-action-1 color-heading placeholder-main text-center text-md-left PhoneInput"
              />
            </div>
            {(!showPass && (
              <>
                <div className="d-flex flex-wrap justify-content-center align-items-center buttons mt-25">
                  <button onClick={handlePhoneSubmit} className="btn mr-20 mb-20 mb-xl-0 w-210 action-2" type="submit">
                    Continue
                  </button>
                </div>
              </>
            )) || (
              <>
                <div className="input-group mb-15">
                  <input
                    ref={pass}
                    type="password"
                    name="password"
                    placeholder="Password"
                    required="required"
                    className="input flex-fill border-gray focus-action-1 color-heading placeholder-main text-center text-md-left"
                  />
                </div>
                <div className="d-flex flex-wrap justify-content-center align-items-center buttons mt-25">
                  <button onClick={handlePassSubmit} className="btn mr-20 mb-20 mb-xl-0 w-210 action-2" type="submit">
                    Sign In
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-15">
            No account yet?{" "}
            <Link to="/signup" className="color-red">
              Sign Up
            </Link>{" "}
            now!
          </p>
        </div>
      </Section>
    </>
  )
}

export default Signin
