import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import GoogleMap from '../../components/GoogleMap';
import LoadingSpinner from '../../components/LoadingSpinner';

const TrackBooking = () => {
  const { id } = useParams();
  const { getBooking, subscribeToBookingUpdates } = useBooking();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingData = await getBooking(id);
        setBooking(bookingData);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToBookingUpdates(id, (updatedBooking) => {
      setBooking(updatedBooking);
      if (updatedBooking.driver_location) {
        setDriverLocation(updatedBooking.driver_location);
      }
    });

    return () => unsubscribe();
  }, [id, getBooking, subscribeToBookingUpdates]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'en_route': return 'text-purple-600 bg-purple-100';
      case 'arrived': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Finding Driver...';
      case 'accepted': return 'Driver Assigned';
      case 'en_route': return 'Driver En Route';
      case 'arrived': return 'Driver Arrived';
      case 'completed': return 'Trip Completed';
      case 'cancelled': return 'Trip Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Not Found</h2>
          <p className="text-gray-600 mt-2">The booking you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                  <p className="text-gray-900">{booking.patient_name}</p>
                  <p className="text-gray-600">{booking.patient_phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Emergency Level</h3>
                  <p className="text-gray-900 capitalize">{booking.emergency_level}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pickup Location</h3>
                  <p className="text-gray-900">{booking.pickup_address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dropoff Location</h3>
                  <p className="text-gray-900">{booking.dropoff_address}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Booking Time</h3>
                  <p className="text-gray-900">
                    {new Date(booking.created_at).toLocaleString()}
                  </p>
                </div>

                {booking.driver && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-500">Driver Information</h3>
                    <p className="text-gray-900">{booking.driver.full_name}</p>
                    <p className="text-gray-600">{booking.driver.vehicle_number}</p>
                    <p className="text-gray-600">{booking.driver.vehicle_type}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.created_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Booking Created</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.accepted_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Driver Assigned</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.started_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Driver En Route</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.arrived_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Driver Arrived</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${booking.completed_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">Trip Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-red-600 text-white">
                <h2 className="text-xl font-bold">Live Tracking</h2>
                <p className="text-red-100">Real-time ambulance location</p>
              </div>
              <div className="h-96 lg:h-[600px]">
                <GoogleMap
                  pickupLocation={booking.pickup_location}
                  dropoffLocation={booking.dropoff_location}
                  driverLocation={driverLocation}
                  showRoute={true}
                  trackingMode={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackBooking;