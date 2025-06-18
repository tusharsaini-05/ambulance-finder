import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { useNavigate } from 'react-router-dom';
import GoogleMap from '../../components/GoogleMap';
import LoadingSpinner from '../../components/LoadingSpinner';

const BookAmbulance = () => {
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    emergencyLevel: 'medium',
    pickupAddress: '',
    dropoffAddress: ''
  });

  const handleLocationSelect = (location, type) => {
    if (type === 'pickup') {
      setPickupLocation(location);
      setFormData(prev => ({ ...prev, pickupAddress: location.address }));
    } else {
      setDropoffLocation(location);
      setFormData(prev => ({ ...prev, dropoffAddress: location.address }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pickupLocation || !dropoffLocation) {
      alert('Please select both pickup and dropoff locations');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        pickup_location: pickupLocation,
        pickup_address: formData.pickupAddress,
        dropoff_location: dropoffLocation,
        dropoff_address: formData.dropoffAddress,
        patient_name: formData.patientName,
        patient_phone: formData.patientPhone,
        emergency_level: formData.emergencyLevel,
        user_id: user.id
      };

      const booking = await createBooking(bookingData);
      navigate(`/user/track/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-red-600 text-white">
            <h1 className="text-2xl font-bold">Book Emergency Ambulance</h1>
            <p className="text-red-100">Fill in the details and select locations on the map</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Phone *
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Level *
                  </label>
                  <select
                    name="emergencyLevel"
                    value={formData.emergencyLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Click on map to select pickup location"
                    readOnly
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Address
                  </label>
                  <input
                    type="text"
                    name="dropoffAddress"
                    value={formData.dropoffAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Click on map to select dropoff location"
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Locations</h3>
                <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                  <GoogleMap
                    onLocationSelect={handleLocationSelect}
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/user/dashboard')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !pickupLocation || !dropoffLocation}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Book Ambulance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAmbulance;