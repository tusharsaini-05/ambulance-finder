import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { getDriverBookings, updateBookingStatus } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const driverBookings = await getDriverBookings(user.id);
        setBookings(driverBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user.id, getDriverBookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

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

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => ['accepted', 'en_route', 'arrived'].includes(b.status));
  const completedBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.full_name}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Available:</span>
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAvailable ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAvailable ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
              }`}>
                {isAvailable ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{activeBookings.length}</div>
            <div className="text-sm text-gray-600">Active Trips</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{completedBookings.length}</div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div key={booking.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {booking.patient_name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.emergency_level === 'critical' ? 'text-red-600 bg-red-100' :
                            booking.emergency_level === 'high' ? 'text-orange-600 bg-orange-100' :
                            booking.emergency_level === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                            'text-green-600 bg-green-100'
                          }`}>
                            {booking.emergency_level} priority
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">From:</span> {booking.pickup_address}</p>
                            <p><span className="font-medium">To:</span> {booking.dropoff_address}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Patient Phone:</span> {booking.patient_phone}</p>
                            <p><span className="font-medium">Requested:</span> {new Date(booking.created_at).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Trips */}
        {activeBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Active Trips</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {booking.patient_name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><span className="font-medium">From:</span> {booking.pickup_address}</p>
                            <p><span className="font-medium">To:</span> {booking.dropoff_address}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Patient Phone:</span> {booking.patient_phone}</p>
                            <p><span className="font-medium">Emergency Level:</span> {booking.emergency_level}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col space-y-2">
                        {booking.status === 'accepted' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'en_route')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                          >
                            Start Trip
                          </button>
                        )}
                        {booking.status === 'en_route' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'arrived')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Mark Arrived
                          </button>
                        )}
                        {booking.status === 'arrived' && (
                          <button
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                          >
                            Complete Trip
                          </button>
                        )}
                        <Link
                          to={`/driver/track/${booking.id}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
                        >
                          View Map
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Completed */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Completed Trips</h2>
          </div>
          <div className="p-6">
            {completedBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🚑</div>
                <p className="text-gray-600">No completed trips yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.patient_name}</h3>
                        <p className="text-sm text-gray-600">
                          {booking.pickup_address} → {booking.dropoff_address}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.completed_at || booking.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;