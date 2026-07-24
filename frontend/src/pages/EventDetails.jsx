import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError('Failed to load event details. It might have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setBookingLoading(true);
      await api.post('/bookings', { eventId: id });
      alert('Ticket booked successfully!');
      navigate('/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book ticket');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-6">{error}</div>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          &larr; Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Events
      </button>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {event.image_url ? (
          <div className="w-full h-64 md:h-96 bg-gray-200">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-500 font-medium">
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end bg-gray-50 p-4 rounded-xl">
              <span className="text-3xl font-extrabold text-blue-600">${Number(event.price).toFixed(2)}</span>
              <span className="text-sm text-gray-500 mt-1">{event.available_tickets} tickets remaining</span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-8 text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About this event</h3>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-end">
            <button
              onClick={handleBook}
              disabled={event.available_tickets === 0 || bookingLoading}
              className={`px-8 py-3 rounded-lg text-lg font-semibold shadow-sm transition-all
                ${event.available_tickets > 0 && !bookingLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              {bookingLoading ? 'Booking...' : event.available_tickets > 0 ? 'Book Ticket Now' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
