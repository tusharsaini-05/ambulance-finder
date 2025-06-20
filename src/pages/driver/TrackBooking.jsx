// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext"
// import { db } from "../../lib/supabase"
// import socketService from "../../lib/socket"
// import GoogleMap from "../../components/GoogleMap"
// import LoadingSpinner from "../../components/LoadingSpinner"
// import { MapPin, Clock, Car, Navigation, AlertCircle, ArrowLeft, Phone, User } from "lucide-react"

// const DriverTrackBooking = () => {
//   const { bookingId } = useParams()
//   const navigate = useNavigate()
//   const { user } = useAuth()
//   const [booking, setBooking] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [driverLocation, setDriverLocation] = useState(null)
//   const [routeInfo, setRouteInfo] = useState(null)
//   const [locationWatcher, setLocationWatcher] = useState(null)

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         console.log("Fetching booking:", bookingId, "for user:", user?.id)

//         if (!bookingId) {
//           setError("No booking ID provided")
//           return
//         }

//         if (!user?.id) {
//           setError("User not authenticated")
//           return
//         }

//         const bookingData = await db.getBooking(bookingId)
//         console.log("Fetched booking data:", bookingData)

//         // Verify this booking belongs to the current driver
//         if (bookingData.driver_id !== user.id) {
//           console.error("Driver mismatch:", bookingData.driver_id, "vs", user.id)
//           setError("You are not assigned to this booking")
//           return
//         }

//         setBooking(bookingData)
//         setupLocationTracking()
//       } catch (error) {
//         console.error("Error fetching booking:", error)
//         setError(`Failed to load booking details: ${error.message}`)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (bookingId && user) {
//       fetchBooking()
//     }

//     return () => {
//       if (locationWatcher) {
//         navigator.geolocation.clearWatch(locationWatcher)
//       }
//     }
//   }, [bookingId, user])

//   const setupLocationTracking = () => {
//     if (navigator.geolocation) {
//       const watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           }
//           setDriverLocation(location)

//           // Update location in database
//           if (user?.id) {
//             db.updateDriverLocation(user.id, location.lat, location.lng).catch(console.error)

//             // Send location via socket
//             socketService.updateDriverLocation(user.id, location)

//             // If booking is active, send ambulance location update
//             if (booking && ["accepted", "en_route", "arrived"].includes(booking.status)) {
//               socketService.updateAmbulanceLocation(user.id, location, booking.id)
//             }
//           }
//         },
//         (error) => {
//           console.error("Error getting location:", error)
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 30000,
//         },
//       )

//       setLocationWatcher(watchId)
//     }
//   }

//   const handleStatusUpdate = async (newStatus) => {
//     try {
//       console.log("Updating booking status:", booking.id, "to", newStatus)

//       const updates = {}
//       if (newStatus === "en_route") {
//         updates.started_at = new Date().toISOString()
//       } else if (newStatus === "arrived") {
//         updates.arrived_at = new Date().toISOString()
//       } else if (newStatus === "completed") {
//         updates.completed_at = new Date().toISOString()
//       }

//       const updatedBooking = await db.updateBookingStatus(booking.id, newStatus, updates)
//       console.log("Updated booking:", updatedBooking)

//       // Notify via socket
//       socketService.updateBookingStatus(booking.id, newStatus, user.id)

//       // Update local state
//       setBooking((prev) => ({ ...prev, status: newStatus, ...updates }))

//       if (newStatus === "completed") {
//         navigate("/driver/dashboard")
//       }
//     } catch (error) {
//       console.error("Error updating booking status:", error)
//       alert(`Failed to update booking status: ${error.message}`)
//     }
//   }

//   const getStatusColor = (status) => {
//     const colors = {
//       accepted: "bg-blue-100 text-blue-800 border-blue-200",
//       en_route: "bg-purple-100 text-purple-800 border-purple-200",
//       arrived: "bg-green-100 text-green-800 border-green-200",
//       completed: "bg-gray-100 text-gray-800 border-gray-200",
//     }
//     return colors[status] || colors.accepted
//   }

//   const getStatusText = (status) => {
//     const texts = {
//       accepted: "Accepted - Ready to Start",
//       en_route: "En Route to Pickup",
//       arrived: "Arrived at Pickup",
//       completed: "Trip Completed",
//     }
//     return texts[status] || status
//   }

//   const getNextAction = (status) => {
//     switch (status) {
//       case "accepted":
//         return {
//           label: "Start Trip",
//           action: () => handleStatusUpdate("en_route"),
//           color: "bg-purple-600 hover:bg-purple-700",
//           icon: <Navigation className="h-4 w-4" />,
//         }
//       case "en_route":
//         return {
//           label: "Mark Arrived",
//           action: () => handleStatusUpdate("arrived"),
//           color: "bg-green-600 hover:bg-green-700",
//           icon: <MapPin className="h-4 w-4" />,
//         }
//       case "arrived":
//         return {
//           label: "Complete Trip",
//           action: () => handleStatusUpdate("completed"),
//           color: "bg-gray-600 hover:bg-gray-700",
//           icon: <Clock className="h-4 w-4" />,
//         }
//       default:
//         return null
//     }
//   }

//   if (loading) {
//     return <LoadingSpinner text="Loading booking details..." />
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="space-y-2">
//             <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
//             <p className="text-sm text-gray-500">User ID: {user?.id}</p>
//           </div>
//           <button
//             onClick={() => navigate("/driver/dashboard")}
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     )
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
//           <button
//             onClick={() => navigate("/driver/dashboard")}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const nextAction = getNextAction(booking.status)

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate("/driver/dashboard")}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <ArrowLeft className="h-5 w-5 text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">Trip Navigation</h1>
//               <p className="text-sm text-gray-600">
//                 Booking #{booking.id.slice(-8)} • {booking.patient_name}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Map */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <div className="h-96 lg:h-[500px]">
//                 <GoogleMap
//                   pickupLocation={
//                     booking.pickup_locations
//                       ? {
//                           lat: booking.pickup_locations.latitude,
//                           lng: booking.pickup_locations.longitude,
//                         }
//                       : null
//                   }
//                   dropoffLocation={
//                     booking.hospital_locations
//                       ? {
//                           lat: booking.hospital_locations.latitude,
//                           lng: booking.hospital_locations.longitude,
//                         }
//                       : null
//                   }
//                   ambulanceLocation={driverLocation}
//                   showRoute={true}
//                   trackingMode={true}
//                   showUserLocation={false}
//                   className="w-full h-full"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Trip Details */}
//           <div className="space-y-4">
//             {/* Status Card */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Trip Status</h2>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
//                   {getStatusText(booking.status)}
//                 </span>
//               </div>

//               {nextAction && (
//                 <button
//                   onClick={nextAction.action}
//                   className={`w-full ${nextAction.color} text-white py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2`}
//                 >
//                   {nextAction.icon}
//                   <span>{nextAction.label}</span>
//                 </button>
//               )}
//             </div>

//             {/* Patient Info */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3">
//                   <User className="h-5 w-5 text-gray-400" />
//                   <div>
//                     <p className="font-medium text-gray-900">{booking.patient_name}</p>
//                     <p className="text-sm text-gray-600">Patient</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Phone className="h-5 w-5 text-gray-400" />
//                   <div>
//                     <p className="font-medium text-gray-900">{booking.patient_phone}</p>
//                     <p className="text-sm text-gray-600">Contact Number</p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Emergency Level</p>
//                   <span
//                     className={`inline-block px-2 py-1 rounded text-xs font-medium ${
//                       booking.emergency_level === "critical"
//                         ? "bg-red-100 text-red-800"
//                         : booking.emergency_level === "high"
//                           ? "bg-orange-100 text-orange-800"
//                           : booking.emergency_level === "medium"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-green-100 text-green-800"
//                     }`}
//                   >
//                     {booking.emergency_level?.charAt(0).toUpperCase() + booking.emergency_level?.slice(1)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Trip Route */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-3">Trip Route</h3>
//               <div className="space-y-3">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Pickup Location</p>
//                     <p className="text-sm text-gray-600">{booking.pickup_locations?.name || booking.pickup_address}</p>
//                   </div>
//                 </div>
//                 <div className="ml-1.5 border-l-2 border-gray-200 h-4"></div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">Hospital Destination</p>
//                     <p className="text-sm text-gray-600">
//                       {booking.hospital_locations?.name || booking.dropoff_address}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Current Location */}
//             {driverLocation && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Location</h3>
//                 <div className="flex items-center space-x-2">
//                   <Car className="h-5 w-5 text-blue-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">
//                       {driverLocation.lat.toFixed(6)}, {driverLocation.lng.toFixed(6)}
//                     </p>
//                     <p className="text-xs text-gray-500">Live tracking active</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DriverTrackBooking
import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../lib/supabase"
import socketService from "../../lib/socket"
import GoogleMap from "../../components/GoogleMap"
import LoadingSpinner from "../../components/LoadingSpinner"
import { MapPin, Clock, Car, Navigation, AlertCircle, ArrowLeft, Phone, User } from "lucide-react"

const DriverTrackBooking = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ambulanceLocation, setAmbulanceLocation] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [locationWatcher, setLocationWatcher] = useState(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching booking:", bookingId, "for user:", user?.id)

        if (!bookingId) {
          setError("No booking ID provided")
          return
        }

        if (!user?.id) {
          setError("User not authenticated")
          return
        }

        const bookingData = await db.getBooking(bookingId)
        console.log("Fetched booking data:", bookingData)

        // Verify this booking belongs to the current driver
        if (bookingData.driver_id !== user.id) {
          console.error("Driver mismatch:", bookingData.driver_id, "vs", user.id)
          setError("You are not assigned to this booking")
          return
        }

        setBooking(bookingData)
        setupLocationTracking()
      } catch (error) {
        console.error("Error fetching booking:", error)
        setError(`Failed to load booking details: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (bookingId && user) {
      fetchBooking()
    }

    return () => {
      if (locationWatcher) {
        navigator.geolocation.clearWatch(locationWatcher)
      }
    }
  }, [bookingId, user])

  const setupLocationTracking = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setAmbulanceLocation(location)

          // Update location in ambulances table
          if (user?.id) {
            db.updateAmbulanceLocation(user.id, location.lat, location.lng).catch(console.error)

            // Send location via socket
            socketService.updateDriverLocation(user.id, location)

            // If booking is active, send ambulance location update
            if (booking && ["accepted", "en_route", "arrived"].includes(booking.status)) {
              socketService.updateAmbulanceLocation(user.id, location, booking.id)
            }
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        },
      )

      setLocationWatcher(watchId)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      console.log("Updating booking status:", booking.id, "to", newStatus)

      const updates = {}
      if (newStatus === "en_route") {
        updates.started_at = new Date().toISOString()
      } else if (newStatus === "arrived") {
        updates.arrived_at = new Date().toISOString()
      } else if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString()
      }

      const updatedBooking = await db.updateBookingStatus(booking.id, newStatus, updates)
      console.log("Updated booking:", updatedBooking)

      // Notify via socket
      socketService.updateBookingStatus(booking.id, newStatus, user.id)

      // Update local state
      setBooking((prev) => ({ ...prev, status: newStatus, ...updates }))

      if (newStatus === "completed") {
        navigate("/driver/dashboard")
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
      alert(`Failed to update booking status: ${error.message}`)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      accepted: "bg-blue-100 text-blue-800 border-blue-200",
      en_route: "bg-purple-100 text-purple-800 border-purple-200",
      arrived: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return colors[status] || colors.accepted
  }

  const getStatusText = (status) => {
    const texts = {
      accepted: "Accepted - Ready to Start",
      en_route: "En Route to Pickup",
      arrived: "Arrived at Pickup",
      completed: "Trip Completed",
    }
    return texts[status] || status
  }

  const getNextAction = (status) => {
    switch (status) {
      case "accepted":
        return {
          label: "Start Trip",
          action: () => handleStatusUpdate("en_route"),
          color: "bg-purple-600 hover:bg-purple-700",
          icon: <Navigation className="h-4 w-4" />,
        }
      case "en_route":
        return {
          label: "Mark Arrived",
          action: () => handleStatusUpdate("arrived"),
          color: "bg-green-600 hover:bg-green-700",
          icon: <MapPin className="h-4 w-4" />,
        }
      case "arrived":
        return {
          label: "Complete Trip",
          action: () => handleStatusUpdate("completed"),
          color: "bg-gray-600 hover:bg-gray-700",
          icon: <Clock className="h-4 w-4" />,
        }
      default:
        return null
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading booking details..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
            <p className="text-sm text-gray-500">User ID: {user?.id}</p>
          </div>
          <button
            onClick={() => navigate("/driver/dashboard")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <button
            onClick={() => navigate("/driver/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const nextAction = getNextAction(booking.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/driver/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Trip Navigation</h1>
              <p className="text-sm text-gray-600">
                Booking #{booking.id.slice(-8)} • {booking.patient_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-96 lg:h-[500px]">
                <GoogleMap
                  pickupLocation={
                    booking.pickup_locations
                      ? {
                          lat: booking.pickup_locations.latitude,
                          lng: booking.pickup_locations.longitude,
                        }
                      : null
                  }
                  dropoffLocation={
                    booking.hospital_locations
                      ? {
                          lat: booking.hospital_locations.latitude,
                          lng: booking.hospital_locations.longitude,
                        }
                      : null
                  }
                  ambulanceLocation={ambulanceLocation}
                  showRoute={true}
                  trackingMode={true}
                  showUserLocation={false}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Trip Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              {nextAction && (
                <button
                  onClick={nextAction.action}
                  className={`w-full ${nextAction.color} text-white py-3 px-4 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors`}
                >
                  {nextAction.icon}
                  <span>{nextAction.label}</span>
                </button>
              )}
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.patient_name}</p>
                    <p className="text-sm text-gray-600">Patient</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.patient_phone}</p>
                    <p className="text-sm text-gray-600">Contact Number</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Level</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      booking.emergency_level === "critical"
                        ? "bg-red-100 text-red-800"
                        : booking.emergency_level === "high"
                          ? "bg-orange-100 text-orange-800"
                          : booking.emergency_level === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {booking.emergency_level?.charAt(0).toUpperCase() + booking.emergency_level?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Route */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trip Route</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                    <p className="text-sm text-gray-600">{booking.pickup_locations?.name || booking.pickup_address}</p>
                  </div>
                </div>
                <div className="ml-1.5 border-l-2 border-gray-200 h-4"></div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hospital Destination</p>
                    <p className="text-sm text-gray-600">
                      {booking.hospital_locations?.name || booking.dropoff_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Ambulance Location */}
            {ambulanceLocation && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ambulance Location</h3>
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {ambulanceLocation.lat.toFixed(6)}, {ambulanceLocation.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500">Live tracking active</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ambulance Info */}
            {booking.ambulances && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ambulance Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      <strong>Vehicle:</strong> {booking.ambulances.vehicle_number}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      <strong>Type:</strong> {booking.ambulances.vehicle_type}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverTrackBooking