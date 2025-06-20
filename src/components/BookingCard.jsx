import React from 'react'
import { Clock, MapPin, User, Phone, Car } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const BookingCard = ({ booking, onAction, actionLabel, actionVariant = 'primary' }) => {
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
      pending: 'Pending',
      accepted: 'Accepted',
      en_route: 'En Route',
      arrived: 'Arrived',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return texts[status] || status
  }

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{booking.id.slice(-8)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
      </div>

      <div className="space-y-3">
        {/* Pickup Location */}
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Pickup</p>
            <p className="text-sm text-gray-600">{booking.pickup_address}</p>
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Destination</p>
            <p className="text-sm text-gray-600">{booking.dropoff_address}</p>
          </div>
        </div>

        {/* Patient Info */}
        {booking.patient_name && (
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Patient</p>
              <p className="text-sm text-gray-600">{booking.patient_name}</p>
            </div>
          </div>
        )}

        {/* Driver Info (for user view) */}
        {booking.drivers && (
          <div className="flex items-center space-x-3">
            <Car className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Driver</p>
              <p className="text-sm text-gray-600">
                {booking.drivers.users.full_name} - {booking.drivers.vehicle_number}
              </p>
            </div>
          </div>
        )}

        {/* User Info (for driver view) */}
        {booking.users && (
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Patient Contact</p>
              <p className="text-sm text-gray-600">{booking.users.full_name}</p>
              {booking.users.phone && (
                <div className="flex items-center space-x-1 mt-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{booking.users.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Level */}
        {booking.emergency_level && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">Emergency Level:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              booking.emergency_level === 'critical' 
                ? 'bg-red-100 text-red-800'
                : booking.emergency_level === 'urgent'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {booking.emergency_level.charAt(0).toUpperCase() + booking.emergency_level.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      {onAction && actionLabel && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => onAction(booking)}
            className={`w-full btn btn-${actionVariant} btn-md`}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default BookingCard