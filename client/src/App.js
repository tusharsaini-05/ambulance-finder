"use client"

import { useContext } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { GlobalContext } from "./context/GlobalContext"
import Cookies from "js-cookie"

// import NotFound from './containers/NotFound'
import Alert from "./components/Alert"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Page from "./containers/Page"
import Home from "./containers/Home"
import Signin from "./containers/Signin"
import Signup from "./containers/Signup"
import Search from "./containers/Search"
import PublicProfile from "./containers/PublicProfile"
import BookingRecent from "./containers/BookingRecent"
import Dashboard from "./containers/Dashboard"
// client
import BookingSingleClient from "./containers/Client/BookingSingle"
import ProfileClient from "./containers/Client/Profile"
import ProfileEditClient from "./containers/Client/ProfileEdit"
// driver
import BookingSingleDriver from "./containers/Driver/BookingSingle"
import VehicleMy from "./containers/Driver/VehicleMy"
import VehicleAdd from "./containers/Driver/VehicleAdd"
import VehicleModify from "./containers/Driver/VehicleModify"
import ProfileDriver from "./containers/Driver/Profile"
import ProfileEditDriver from "./containers/Driver/ProfileEdit"
// admin
import ApproveDriver from "./containers/Admin/ApproveDriver"
import AdminSignin from "./containers/Admin/Signin"

const App = () => {
  const global = useContext(GlobalContext)
  const type = Cookies.get("type")
  const siteName = "Ambulance Finder"
  return (
    <>
      <Router>
        <Header />
        {/* show alert */}
        {global.alert.message && <Alert alert={global.alert} event={global.setAlert} />}
        {/* public routes */}
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Page title={`${siteName} | Home`}>
                <Home {...props} />
              </Page>
            )}
          />
          <Route
            exact
            path="/search"
            render={(props) => (
              <Page title={`${siteName} | Search`}>
                <Search {...props} />
              </Page>
            )}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => (
              <Page title={`${siteName} | Profile`}>
                <PublicProfile {...props} />
              </Page>
            )}
          />
        </Switch>
        {/* non logged in routes */}
        {!type && (
          <Switch>
            <Route
              exact
              path="/admin/signin"
              render={(props) => (
                <Page title={`${siteName} | Signin`}>
                  <AdminSignin {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/signin"
              render={(props) => (
                <Page title={`${siteName} | Signin`}>
                  <Signin {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/signup"
              render={(props) => (
                <Page title={`${siteName} | Signup`}>
                  <Signup {...props} />
                </Page>
              )}
            />
          </Switch>
        )}
        {/* client routes */}
        {type && type === 0 && (
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={(props) => (
                <Page title={`${siteName} | Dashboard`}>
                  <Dashboard {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/booking"
              render={(props) => (
                <Page title={`${siteName} | Recent Booking`}>
                  <BookingRecent {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/booking/:id"
              render={(props) => (
                <Page title={`${siteName} | Booking`}>
                  <BookingSingleClient {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/profile/edit"
              render={(props) => (
                <Page title={`${siteName} | Edit Profile`}>
                  <ProfileEditClient {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/profile"
              render={(props) => (
                <Page title={`${siteName} | Profile`}>
                  <ProfileClient {...props} />
                </Page>
              )}
            />
          </Switch>
        )}
        {/* driver routes */}
        {type && type === 1 && (
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={(props) => (
                <Page title={`${siteName} | Dashboard`}>
                  <Dashboard {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/booking"
              render={(props) => (
                <Page title={`${siteName} | Recent Booking`}>
                  <BookingRecent {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/booking/:id"
              render={(props) => (
                <Page title={`${siteName} | Booking`}>
                  <BookingSingleDriver {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/vehicle/modify/:vehicleId"
              render={(props) => (
                <Page title={`${siteName} | Modify Vehicle`}>
                  <VehicleModify {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/vehicle/add"
              render={(props) => (
                <Page title={`${siteName} | Add Vehicle`}>
                  <VehicleAdd {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/vehicle"
              render={(props) => (
                <Page title={`${siteName} | My Vehicle`}>
                  <VehicleMy {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/profile"
              render={(props) => (
                <Page title={`${siteName} | Profile`}>
                  <ProfileDriver {...props} />
                </Page>
              )}
            />
            <Route
              exact
              path="/profile/edit"
              render={(props) => (
                <Page title={`${siteName} | Edit Profile`}>
                  <ProfileEditDriver {...props} />
                </Page>
              )}
            />
          </Switch>
        )}
        {/* admin routes */}
        {type && type === 2 && (
          <Switch>
            <Route
              exact
              path="/approve/driver"
              render={(props) => (
                <Page title={`${siteName} | Approve Driver`}>
                  <ApproveDriver {...props} />
                </Page>
              )}
            />
          </Switch>
        )}

        <Footer />
      </Router>
    </>
  )
}

export default App
