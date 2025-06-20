import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { db, subscriptions } from '../../lib/supabase'
import GoogleMap from '../../components/GoogleMap'
import LoadingSpinner from '../../components/LoadingSpinner'
import { MapPin, Clock, Car, Phone, Navigation, AlertCircle } from 'lucide-react'

const TrackBooking = () => {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ambulanceLocation, setAmbulanceLocation] = useState(null)
  const [eta, setEta] = useState(null)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await db.getBooking(bookingId)
        setBooking(bookingData)
        
        // Set initial ambulance location if available
        if (bookingData.ambulances?.current_lat && bookingData.ambulances?.current_lng) {
          setAmbulanceLocation({
            lat: bookingData.ambulances.current_lat,
            lng: bookingData.ambulances.current_lng
          })
        }
      } catch (error) {
        console.error('Error fetching booking:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  // Subscribe to real-time booking updates
  useEffect(() => {
    if (!booking) return

    const bookingSubscription = subscriptions.subscribeToBooking(
      booking.id,
      (payload) => {
        if (payload.eventType === 'UPDATE') {
          setBooking(prev => ({ ...prev, ...payload.new }))
        }
      }
    )

    return () => {
      bookingSubscription.unsubscribe()
    }
  }, [booking?.id])

  // Subscribe to ambulance location updates
  useEffect(() => {
    if (!booking?.ambulance_id) return

    const ambulanceSubscription = subscriptions.subscribeToAmbulanceLocation(
      booking.ambulance_id,
      (payload) => {
        if (payload.eventType === 'UPDATE' && payload.new.current_lat && payload.new.current_lng) {
          setAmbulanceLocation({
            lat: payload.new.current_lat,
            lng: payload.new.current_lng
          })
        }
      }
    )

    return () => {
      ambulanceSubscription.unsubscribe()
    }
  }, [booking?.ambulance_id])

  // Simulate ambulance movement for demo purposes
  useEffect(() => {
    if (!booking?.pickup_locations || !ambulanceLocation || booking.status === 'completed') return

    const interval = setInterval(() => {
      setAmbulanceLocation(prev => {
        if (!prev) return null

        const targetLat = booking.pickup_locations.latitude
        const targetLng = booking.pickup_locations.longitude
        
        // Move ambulance slightly towards pickup location
        const deltaLat = (targetLat - prev.lat) * 0.01
        const deltaLng = (targetLng - prev.lng) * 0.01
        
        const newLocation = {
          lat: prev.lat + deltaLat,
          lng: prev.lng + deltaLng
        }

        // Update ambulance location in database
        if (booking.ambulance_id) {
          db.updateAmbulanceLocation(booking.ambulance_id, newLocation.lat, newLocation.lng)
            .catch(console.error)
        }

        return newLocation
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [booking, ambulanceLocation])

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      en_route: 'bg-purple-100 text-purple-800 border-purple-200',
      arrived: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || colors.pending
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Finding Ambulance...',
      accepted: 'Ambulance Assigned',
      en_route: 'Ambulance En Route',
      arrived: 'Ambulance Arrived',
      completed: 'Trip Completed',
      cancelled: 'Trip Cancelled'
    }
    return texts[status] || status
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5" />
      case 'accepted':
        return <Car className="h-5 w-5" />
      case 'en_route':
        return <Navigation className="h-5 w-5" />
      case 'arrived':
        return <MapPin className="h-5 w-5" />
      case 'completed':
        return <Clock className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading booking details..." />
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600">The booking you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Ambulance</h1>
          <p className="text-gray-600 mt-2">
            Booking #{booking.id.slice(-8)} • {booking.patient_name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(booking.status)}
                    <span>{getStatusText(booking.status)}</span>
                  </div>
                </span>
              </div>

              {booking.route_duration && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Estimated time: {booking.route_duration}</span>
                </div>
              )}

              {booking.route_distance && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Navigation className="h-4 w-4" />
                  <span>Distance: {booking.route_distance}</span>
                </div>
              )}
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">{booking.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{booking.patient_phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Emergency Level</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    booking.emergency_level === 'critical' 
                      ? 'bg-red-100 text-red-800'
                      : booking.emergency_level === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : booking.emergency_level === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {booking.emergency_level.charAt(0).toUpperCase() + booking.emergency_level.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Locations</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">
                      {booking.pickup_locations?.name || booking.pickup_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hospital</p>
                    <p className="text-sm text-gray-600">
                      {booking.hospital_locations?.name || booking.dropoff_address}
                    </p>
                    {booking.hospital_locations?.address && (
                      <p className="text-xs text-gray-500">{booking.hospital_locations.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ambulance Information */}
            {booking.ambulances && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ambulance Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{booking.ambulances.vehicle_number}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle Type</p>
                    <p className="text-gray-900 capitalize">
                      {booking.ambulances.vehicle_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.created_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Booking Created</span>
                  {booking.created_at && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(booking.created_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.accepted_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Ambulance Assigned</span>
                  {booking.accepted_at && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(booking.accepted_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.started_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">En Route</span>
                  {booking.started_at && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(booking.started_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.arrived_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Arrived at Pickup</span>
                  {booking.arrived_at && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(booking.arrived_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.completed_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Trip Completed</span>
                  {booking.completed_at && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(booking.completed_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-emergency-600 text-white">
                <h2 className="text-xl font-bold">Live Tracking</h2>
                <p className="text-emergency-100">Real-time ambulance location</p>
              </div>
              <div className="h-96 lg:h-[600px]">
                <GoogleMap
                  pickupLocation={booking.pickup_locations ? {
                    lat: booking.pickup_locations.latitude,
                    lng: booking.pickup_locations.longitude
                  } : null}
                  dropoffLocation={booking.hospital_locations ? {
                    lat: booking.hospital_locations.latitude,
                    lng: booking.hospital_locations.longitude
                  } : null}
                  ambulanceLocation={ambulanceLocation}
                  showRoute={true}
                  trackingMode={true}
                  showUserLocation={false}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackBooking