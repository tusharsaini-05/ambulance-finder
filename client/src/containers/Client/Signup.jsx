"use client"

import { useContext, useState } from "react"
import { GlobalContext } from "../../context/GlobalContext"
import { Link } from "react-router-dom"
import PhoneInput from "react-phone-number-input"
import Section from "../../components/Section"
import PageTitle from "../../components/PageTitle"
import UserApi from "../../api/user"
import { setAuthTokens } from "../../utils/auth"
import "react-phone-number-input/style.css"

const Signup = () => {
  const global = useContext(GlobalContext)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!phone) {
      global.setAlert({ type: "danger", message: "Please enter a valid phone number" })
      return
    }

    if (!password || password.length < 6) {
      global.setAlert({ type: "danger", message: "Password must be at least 6 characters" })
      return
    }

    if (password !== confirmPassword) {
      global.setAlert({ type: "danger", message: "Passwords do not match" })
      return
    }

    setLoading(true)

    try {
      // Check if user already exists
      const userExistsResponse = await UserApi.isUserExist(phone)

      if (userExistsResponse && userExistsResponse.data && userExistsResponse.data.exist) {
        global.setAlert({
          type: "danger",
          message: "User already exists. Please sign in instead.",
        })
        setLoading(false)
        return
      }

      // Create user directly in your backend
      const createUserResponse = await UserApi.createClient({
        phone: phone,
        password: password,
      })

      if (createUserResponse && createUserResponse.data) {
        // Set authentication cookies
        setAuthTokens(
          createUserResponse.data.user._id,
          createUserResponse.data.user.type,
          createUserResponse.headers.authorization,
        )

        global.setAlert({
          type: "success",
          message: "Account created successfully!",
        })

        // Redirect to home page
        setTimeout(() => {
          window.location.replace("/")
        }, 1500)
      }
    } catch (error) {
      console.error("Error creating account:", error)
      global.setAlert({
        type: "danger",
        message: error.message || "Failed to create account. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Section className="bg-light form_2" align="center">
        <div className="col-lg-5 col-md-6 col-sm-10 text-center">
          <PageTitle title="Sign Up as Client" />

          <form onSubmit={handleSignup}>
            <div className="input-group mb-15">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="BD"
                value={phone}
                onChange={(phone) => setPhone(phone)}
                className="input d-flex flex-fill border-gray focus-action-1 color-heading placeholder-main text-center text-md-left PhoneInput"
                disabled={loading}
              />
            </div>
            <div className="input-group mb-15">
              <input
                type="password"
                className="input d-flex flex-fill border-gray focus-action-1 color-heading placeholder-main text-center"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="input-group mb-15">
              <input
                type="password"
                className="input d-flex flex-fill border-gray focus-action-1 color-heading placeholder-main text-center"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="d-flex flex-wrap justify-content-center align-items-center buttons mt-25">
              <button className="btn mr-20 mb-20 mb-xl-0 w-210 action-2" type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <span className="d-block mt-15">
            <p className="text-center">
              Already have account?{" "}
              <Link to="/signin" className="color-red">
                Sign In
              </Link>{" "}
              now!
            </p>
          </span>
        </div>
      </Section>
    </>
  )
}

export default Signup
