// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useBooking } from '../../contexts/BookingContext';
// import { Link } from 'react-router-dom';
// import LoadingSpinner from '../../components/LoadingSpinner';

// const BookingHistory = () => {
//   const { user } = useAuth();
//   const { getUserBookings } = useBooking();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const userBookings = await getUserBookings(user.id);
//         setBookings(userBookings);
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [user.id, getUserBookings]);

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
//       case 'pending': return 'Pending';
//       case 'accepted': return 'Accepted';
//       case 'en_route': return 'En Route';
//       case 'arrived': return 'Arrived';
//       case 'completed': return 'Completed';
//       case 'cancelled': return 'Cancelled';
//       default: return status;
//     }
//   };

//   const filteredBookings = bookings.filter(booking => {
//     if (filter === 'all') return true;
//     return booking.status === filter;
//   });

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//               <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
              
//               <div className="mt-4 sm:mt-0">
//                 <select
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   <option value="all">All Bookings</option>
//                   <option value="pending">Pending</option>
//                   <option value="accepted">Accepted</option>
//                   <option value="en_route">En Route</option>
//                   <option value="arrived">Arrived</option>
//                   <option value="completed">Completed</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {filteredBookings.length === 0 ? (
//               <div className="text-center py-12">
//                 <div className="text-gray-400 text-6xl mb-4">🚑</div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
//                 <p className="text-gray-600 mb-6">
//                   {filter === 'all' 
//                     ? "You haven't made any ambulance bookings yet."
//                     : `No ${filter} bookings found.`
//                   }
//                 </p>
//                 <Link
//                   to="/user/book"
//                   className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                 >
//                   Book Ambulance
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredBookings.map((booking) => (
//                   <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h3 className="text-lg font-medium text-gray-900">
//                             {booking.patient_name}
//                           </h3>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
//                             {getStatusText(booking.status)}
//                           </span>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             booking.emergency_level === 'critical' ? 'text-red-600 bg-red-100' :
//                             booking.emergency_level === 'high' ? 'text-orange-600 bg-orange-100' :
//                             booking.emergency_level === 'medium' ? 'text-yellow-600 bg-yellow-100' :
//                             'text-green-600 bg-green-100'
//                           }`}>
//                             {booking.emergency_level} priority
//                           </span>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                           <div>
//                             <p><span className="font-medium">From:</span> {booking.pickup_address}</p>
//                             <p><span className="font-medium">To:</span> {booking.dropoff_address}</p>
//                           </div>
//                           <div>
//                             <p><span className="font-medium">Date:</span> {new Date(booking.created_at).toLocaleDateString()}</p>
//                             <p><span className="font-medium">Time:</span> {new Date(booking.created_at).toLocaleTimeString()}</p>
//                           </div>
//                         </div>

//                         {booking.driver && (
//                           <div className="mt-2 text-sm text-gray-600">
//                             <p><span className="font-medium">Driver:</span> {booking.driver.full_name}</p>
//                             <p><span className="font-medium">Vehicle:</span> {booking.driver.vehicle_number} ({booking.driver.vehicle_type})</p>
//                           </div>
//                         )}
//                       </div>

//                       <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
//                         {(booking.status === 'accepted' || booking.status === 'en_route' || booking.status === 'arrived') && (
//                           <Link
//                             to={`/user/track/${booking.id}`}
//                             className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
//                           >
//                             Track Live
//                           </Link>
//                         )}
//                         <Link
//                           to={`/user/booking/${booking.id}`}
//                           className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingHistory;

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { db } from "../../lib/supabase"
import { Link } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner"

const BookingHistory = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userBookings = await db.getUserBookings(user.id)
        setBookings(userBookings)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchBookings()
    }
  }, [user?.id])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "accepted":
        return "text-blue-600 bg-blue-100"
      case "en_route":
        return "text-purple-600 bg-purple-100"
      case "arrived":
        return "text-green-600 bg-green-100"
      case "completed":
        return "text-gray-600 bg-gray-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "en_route":
        return "En Route"
      case "arrived":
        return "Arrived"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>

              <div className="mt-4 sm:mt-0">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="en_route">En Route</option>
                  <option value="arrived">Arrived</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🚑</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === "all" ? "You haven't made any ambulance bookings yet." : `No ${filter} bookings found.`}
                </p>
                <Link
                  to="/user/book"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Book Ambulance
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{booking.patient_name}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                          >
                            {getStatusText(booking.status)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.emergency_level === "critical"
                                ? "text-red-600 bg-red-100"
                                : booking.emergency_level === "high"
                                  ? "text-orange-600 bg-orange-100"
                                  : booking.emergency_level === "medium"
                                    ? "text-yellow-600 bg-yellow-100"
                                    : "text-green-600 bg-green-100"
                            }`}
                          >
                            {booking.emergency_level} priority
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p>
                              <span className="font-medium">From:</span> {booking.pickup_address}
                            </p>
                            <p>
                              <span className="font-medium">To:</span> {booking.dropoff_address}
                            </p>
                          </div>
                          <div>
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                            <p>
                              <span className="font-medium">Time:</span>{" "}
                              {new Date(booking.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {booking.driver && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Driver:</span> {booking.driver.full_name}
                            </p>
                            <p>
                              <span className="font-medium">Vehicle:</span> {booking.driver.vehicle_number} (
                              {booking.driver.vehicle_type})
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
                        {(booking.status === "accepted" ||
                          booking.status === "en_route" ||
                          booking.status === "arrived") && (
                          <Link
                            to={`/user/track/${booking.id}`}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            Track Live
                          </Link>
                        )}
                        <Link
                          to={`/user/booking/${booking.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingHistory
