// import React from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { useAuth } from './contexts/AuthContext'
// import Layout from './components/Layout'
// import LoadingSpinner from './components/LoadingSpinner'

// // Auth pages
// import Login from './pages/auth/Login'
// import Register from './pages/auth/Register'

// // User pages
// import UserDashboard from './pages/user/Dashboard'
// import BookAmbulance from './pages/user/BookAmbulance'
// import TrackBooking from './pages/user/TrackBooking'
// import BookingHistory from './pages/user/BookingHistory'

// // Driver pages
// import DriverDashboard from './pages/driver/Dashboard'
// import DriverBookings from './pages/driver/Bookings'
// import DriverProfile from './pages/driver/Profile'

// // Public pages
// import Home from './pages/Home'
// import About from './pages/About'

// function App() {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return <LoadingSpinner />
//   }

//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
          
//           {/* Auth routes */}
//           <Route 
//             path="/login" 
//             element={!user ? <Login /> : <Navigate to="/dashboard" />} 
//           />
//           <Route 
//             path="/register" 
//             element={!user ? <Register /> : <Navigate to="/dashboard" />} 
//           />
          
//           {/* Protected routes */}
//           <Route 
//             path="/dashboard" 
//             element={
//               user ? (
//                 user.user_metadata?.role === 'driver' ? 
//                 <DriverDashboard /> : 
//                 <UserDashboard />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             } 
//           />
          
//           {/* User routes */}
//           <Route 
//             path="/book" 
//             element={user && user.user_metadata?.role !== 'driver' ? <BookAmbulance /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/track/:bookingId" 
//             element={user ? <TrackBooking /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/history" 
//             element={user ? <BookingHistory /> : <Navigate to="/login" />} 
//           />
          
//           {/* Driver routes */}
//           <Route 
//             path="/driver/bookings" 
//             element={user && user.user_metadata?.role === 'driver' ? <DriverBookings /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/driver/profile" 
//             element={user && user.user_metadata?.role === 'driver' ? <DriverProfile /> : <Navigate to="/login" />} 
//           />
          
//           {/* Catch all */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Layout>
//     </Router>
//   )
// }

// export default App

"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import LoadingSpinner from "./components/LoadingSpinner"

// Auth pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// User pages
import UserDashboard from "./pages/user/Dashboard"
import BookAmbulance from "./pages/user/BookAmbulance"
import TrackBooking from "./pages/user/TrackBooking"
import BookingHistory from "./pages/user/BookingHistory"

// Driver pages
import DriverDashboard from "./pages/driver/Dashboard"
import DriverBookings from "./pages/driver/Bookings"
import DriverProfile from "./pages/driver/Profile"
import DriverTrackBooking from "./pages/driver/TrackBooking"

// Public pages
import Home from "./pages/Home"
import About from "./pages/About"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Auth routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              user ? (
                user.user_metadata?.role === "driver" ? (
                  <DriverDashboard />
                ) : (
                  <UserDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* User routes */}
          <Route
            path="/book"
            element={user && user.user_metadata?.role !== "driver" ? <BookAmbulance /> : <Navigate to="/login" />}
          />
          <Route path="/track/:bookingId" element={user ? <TrackBooking /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <BookingHistory /> : <Navigate to="/login" />} />

          {/* Driver routes */}
          <Route
            path="/driver/bookings"
            element={user && user.user_metadata?.role === "driver" ? <DriverBookings /> : <Navigate to="/login" />}
          />
          <Route
            path="/driver/profile"
            element={user && user.user_metadata?.role === "driver" ? <DriverProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/driver/track/:bookingId"
            element={user && user.user_metadata?.role === "driver" ? <DriverTrackBooking /> : <Navigate to="/login" />}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
