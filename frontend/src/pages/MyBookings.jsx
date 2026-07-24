import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/mybookings');
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`);
        alert('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading your bookings...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-gray-500 text-lg mb-4">You haven't booked any tickets yet.</p>
          <Link to="/" className="text-blue-600 font-medium hover:underline">Explore Events</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.booking_id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {booking.image_url ? (
                    <img src={booking.image_url} alt={booking.title} className="w-full md:w-32 h-24 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      <Link to={`/events/${booking.id}`} className="hover:text-blue-600 transition-colors">{booking.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Event Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">
                        Booked on: {new Date(booking.booking_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-between md:flex-col md:items-end gap-4">
                  <span className="text-xl font-bold text-gray-900">${Number(booking.price).toFixed(2)}</span>
                  {booking.status === 'booked' && (
                    <button 
                      onClick={() => handleCancel(booking.booking_id)}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
