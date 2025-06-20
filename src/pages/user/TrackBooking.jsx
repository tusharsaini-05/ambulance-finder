// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useBooking } from '../../contexts/BookingContext';
// import GoogleMap from '../../components/GoogleMap';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const TrackBooking = () => {
//   const { id } = useParams();
//   const { getBooking, subscribeToBookingUpdates } = useBooking();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [driverLocation, setDriverLocation] = useState(null);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const bookingData = await getBooking(id);
//         setBooking(bookingData);
//       } catch (error) {
//         console.error('Error fetching booking:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooking();

//     // Subscribe to real-time updates
//     const unsubscribe = subscribeToBookingUpdates(id, (updatedBooking) => {
//       setBooking(updatedBooking);
//       if (updatedBooking.driver_location) {
//         setDriverLocation(updatedBooking.driver_location);
//       }
//     });

//     return () => unsubscribe();
//   }, [id, getBooking, subscribeToBookingUpdates]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'text-yellow-600 bg-yellow-100';
//       case 'accepted': return 'text-blue-600 bg-blue-100';
//       case 'en_route': return 'text-purple-600 bg-purple-100';
//       case 'arrived': return 'text-green-600 bg-green-100';
//       case 'completed': return 'text-gray-600 bg-gray-100';
//       case 'cancelled': return 'text-red-600 bg-red-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'pending': return 'Finding Driver...';
//       case 'accepted': return 'Driver Assigned';
//       case 'en_route': return 'Driver En Route';
//       case 'arrived': return 'Driver Arrived';
//       case 'completed': return 'Trip Completed';
//       case 'cancelled': return 'Trip Cancelled';
//       default: return status;
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900">Booking Not Found</h2>
//           <p className="text-gray-600 mt-2">The booking you're looking for doesn't exist.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Booking Details */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
//                   {getStatusText(booking.status)}
//                 </span>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Patient</h3>
//                   <p className="text-gray-900">{booking.patient_name}</p>
//                   <p className="text-gray-600">{booking.patient_phone}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Emergency Level</h3>
//                   <p className="text-gray-900 capitalize">{booking.emergency_level}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Pickup Location</h3>
//                   <p className="text-gray-900">{booking.pickup_address}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Dropoff Location</h3>
//                   <p className="text-gray-900">{booking.dropoff_address}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Booking Time</h3>
//                   <p className="text-gray-900">
//                     {new Date(booking.created_at).toLocaleString()}
//                   </p>
//                 </div>

//                 {booking.driver && (
//                   <div className="border-t pt-4">
//                     <h3 className="text-sm font-medium text-gray-500">Driver Information</h3>
//                     <p className="text-gray-900">{booking.driver.full_name}</p>
//                     <p className="text-gray-600">{booking.driver.vehicle_number}</p>
//                     <p className="text-gray-600">{booking.driver.vehicle_type}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Status Timeline */}
//             <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Status Timeline</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center">
//                   <div className={`w-3 h-3 rounded-full mr-3 ${booking.created_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                   <span className="text-sm text-gray-600">Booking Created</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={`w-3 h-3 rounded-full mr-3 ${booking.accepted_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                   <span className="text-sm text-gray-600">Driver Assigned</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={`w-3 h-3 rounded-full mr-3 ${booking.started_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                   <span className="text-sm text-gray-600">Driver En Route</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={`w-3 h-3 rounded-full mr-3 ${booking.arrived_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                   <span className="text-sm text-gray-600">Driver Arrived</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className={`w-3 h-3 rounded-full mr-3 ${booking.completed_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                   <span className="text-sm text-gray-600">Trip Completed</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Map */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//               <div className="px-6 py-4 bg-red-600 text-white">
//                 <h2 className="text-xl font-bold">Live Tracking</h2>
//                 <p className="text-red-100">Real-time ambulance location</p>
//               </div>
//               <div className="h-96 lg:h-[600px]">
//                 <GoogleMap
//                   pickupLocation={booking.pickup_location}
//                   dropoffLocation={booking.dropoff_location}
//                   driverLocation={driverLocation}
//                   showRoute={true}
//                   trackingMode={true}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrackBooking;

"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { db, subscriptions } from "../../lib/supabase"
import socketService from "../../lib/socket"
import GoogleMap from "../../components/GoogleMap"
import LoadingSpinner from "../../components/LoadingSpinner"
import { MapPin, Clock, Car, Navigation, AlertCircle, ArrowLeft, Wifi, WifiOff, Phone, User } from "lucide-react"

const TrackBooking = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [eta, setEta] = useState(null)
  const [distance, setDistance] = useState(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [lastLocationUpdate, setLastLocationUpdate] = useState(null)

  // Use refs to track if we've set up listeners
  const listenersSetupRef = useRef(false)

  // Fetch booking data
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true)
        setError(null)

        const bookingData = await db.getBooking(bookingId)
        setBooking(bookingData)

        // Initialize driver location if available
        if (bookingData.drivers && bookingData.drivers.current_lat && bookingData.drivers.current_lng) {
          const initialLocation = {
            lat: bookingData.drivers.current_lat,
            lng: bookingData.drivers.current_lng,
          }
          setDriverLocation(initialLocation)

          // Calculate initial ETA if pickup location is available
          if (bookingData.pickup_locations) {
            calculateETA(initialLocation, {
              lat: bookingData.pickup_locations.latitude,
              lng: bookingData.pickup_locations.longitude,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        setError("Failed to load booking details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchBooking()
    } else {
      setError("Invalid booking ID")
      setLoading(false)
    }
  }, [bookingId])

  // Setup Socket.IO connection and listeners
  useEffect(() => {
    if (!booking || !user || listenersSetupRef.current) return

    const setupSocket = async () => {
      try {
        // Connect to Socket.IO server
        socketService.connect()

        // Connect as user
        socketService.connectAsUser(user.id)

        // Track this booking
        socketService.trackBooking(booking.id, user.id)

        // Set up event listeners
        const handleLocationUpdate = (data) => {
          console.log("Received driver location update:", data)
          if (data.bookingId === booking.id || data.driverId === booking.driver_id) {
            setDriverLocation(data.location)
            setLastLocationUpdate(new Date(data.timestamp))

            // Calculate ETA if pickup location is available
            if (booking.pickup_locations) {
              calculateETA(data.location, {
                lat: booking.pickup_locations.latitude,
                lng: booking.pickup_locations.longitude,
              })
            }
          }
        }

        const handleBookingStatusUpdate = (data) => {
          console.log("Received booking status update:", data)
          if (data.bookingId === booking.id) {
            setBooking((prev) => ({ ...prev, status: data.status }))
          }
        }

        const handleETAUpdate = (data) => {
          console.log("Received ETA update:", data)
          if (data.bookingId === booking.id) {
            setEta(data.eta)
            setDistance(data.distance)
          }
        }

        const handleEmergencyAlert = (data) => {
          console.log("Received emergency alert:", data)
          if (data.bookingId === booking.id) {
            alert(`Emergency Alert: ${data.message}`)
          }
        }

        // Set up listeners
        socketService.onAmbulanceLocationUpdate(handleLocationUpdate)
        socketService.onDriverLocationUpdate(handleLocationUpdate)
        socketService.onBookingStatusUpdate(handleBookingStatusUpdate)
        socketService.onETAUpdate(handleETAUpdate)
        socketService.onEmergencyAlert(handleEmergencyAlert)

        // Monitor connection status
        const socket = socketService.getSocket()
        if (socket) {
          socket.on("connect", () => setIsSocketConnected(true))
          socket.on("disconnect", () => setIsSocketConnected(false))
          setIsSocketConnected(socket.connected)
        }

        listenersSetupRef.current = true

        // Cleanup function
        return () => {
          socketService.untrackBooking(booking.id)
          socketService.offAmbulanceLocationUpdate(handleLocationUpdate)
          socketService.offDriverLocationUpdate(handleLocationUpdate)
          socketService.offBookingStatusUpdate(handleBookingStatusUpdate)
          socketService.offETAUpdate(handleETAUpdate)
          socketService.offEmergencyAlert(handleEmergencyAlert)

          if (socket) {
            socket.off("connect")
            socket.off("disconnect")
          }

          listenersSetupRef.current = false
        }
      } catch (error) {
        console.error("Error setting up socket connection:", error)
      }
    }

    setupSocket()
  }, [booking?.id, user?.id])

  // Subscribe to driver location updates via Supabase
  useEffect(() => {
    if (!booking?.driver_id) return

    const subscription = subscriptions.subscribeToDriverLocation(booking.driver_id, (payload) => {
      if (payload.eventType === "UPDATE" && payload.new.current_lat && payload.new.current_lng) {
        const newLocation = {
          lat: payload.new.current_lat,
          lng: payload.new.current_lng,
        }
        setDriverLocation(newLocation)
        setLastLocationUpdate(new Date())

        // Calculate ETA
        if (booking.pickup_locations) {
          calculateETA(newLocation, {
            lat: booking.pickup_locations.latitude,
            lng: booking.pickup_locations.longitude,
          })
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [booking?.driver_id, booking?.pickup_locations])

  // Calculate ETA and distance
  const calculateETA = (from, to) => {
    if (!from || !to) return

    // Calculate distance using Haversine formula
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((to.lat - from.lat) * Math.PI) / 180
    const dLng = ((to.lng - from.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.lat * Math.PI) / 180) *
        Math.cos((to.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceKm = R * c

    setDistance(distanceKm.toFixed(1))

    // Estimate ETA (assuming average speed of 40 km/h in city)
    const etaMinutes = Math.ceil((distanceKm / 40) * 60)
    setEta(etaMinutes)

    // Send ETA update via socket
    if (booking?.driver_id) {
      socketService.updateETA(booking.driver_id, booking.id, etaMinutes, `${distanceKm.toFixed(1)} km`)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-blue-100 text-blue-800 border-blue-200",
      en_route: "bg-purple-100 text-purple-800 border-purple-200",
      arrived: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status] || colors.pending
  }

  const getStatusText = (status) => {
    const texts = {
      pending: "Finding Driver...",
      accepted: "Driver Assigned",
      en_route: "Driver En Route",
      arrived: "Driver Arrived",
      completed: "Trip Completed",
      cancelled: "Trip Cancelled",
    }
    return texts[status] || status
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5" />
      case "accepted":
        return <Car className="h-5 w-5" />
      case "en_route":
        return <Navigation className="h-5 w-5" />
      case "arrived":
        return <MapPin className="h-5 w-5" />
      case "completed":
        return <Clock className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading tracking information..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary btn-md">
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
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary btn-md">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Track Your Ambulance</h1>
                <p className="text-sm text-gray-600">
                  Booking #{booking.id.slice(-8)} • {booking.patient_name}
                </p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isSocketConnected ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Live</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-400">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-1">
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
                  ambulanceLocation={driverLocation}
                  showRoute={booking.status !== "pending"}
                  trackingMode={true}
                  showUserLocation={false}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-4">
            {/* ETA Card - Uber-like */}
            {eta && booking.status === "en_route" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emergency-600 mb-1">{eta} min</div>
                  <p className="text-sm text-gray-600">Estimated arrival</p>
                  {distance && <p className="text-xs text-gray-500 mt-1">{distance} km away</p>}
                  {lastLocationUpdate && (
                    <p className="text-xs text-gray-400 mt-1">Updated {lastLocationUpdate.toLocaleTimeString()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(booking.status)}
                    <span>{getStatusText(booking.status)}</span>
                  </div>
                </span>
              </div>

              {booking.status === "arrived" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-green-800 text-sm font-medium">
                    🚑 Your driver has arrived at the pickup location!
                  </p>
                </div>
              )}

              {isSocketConnected && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">📡 Real-time tracking active</p>
                </div>
              )}
            </div>

            {/* Driver Info */}
            {booking.drivers && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Driver Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.drivers.users?.full_name}</p>
                      <p className="text-sm text-gray-600">Driver</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.drivers.users?.phone}</p>
                      <p className="text-sm text-gray-600">Contact Number</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.drivers.vehicle_number}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {booking.drivers.vehicle_type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Locations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trip Details</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">{booking.pickup_locations?.name || booking.pickup_address}</p>
                  </div>
                </div>
                <div className="ml-1.5 border-l-2 border-gray-200 h-4"></div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hospital</p>
                    <p className="text-sm text-gray-600">
                      {booking.hospital_locations?.name || booking.dropoff_address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{booking.patient_name}</p>
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
                    {booking.emergency_level.charAt(0).toUpperCase() + booking.emergency_level.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackBooking
