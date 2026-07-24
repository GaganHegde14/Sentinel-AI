import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AdminEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', price: '', available_tickets: '', image_url: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
      } else {
        await api.post('/events', formData);
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', description: '', date: '', price: '', available_tickets: '', image_url: '' });
      fetchEvents();
    } catch (error) {
      alert('Error saving event: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (evt) => {
    setEditingId(evt.id);
    setFormData({
      title: evt.title,
      description: evt.description,
      // Format date for datetime-local input
      date: new Date(evt.date).toISOString().slice(0, 16),
      price: evt.price,
      available_tickets: evt.available_tickets,
      image_url: evt.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        alert('Error deleting event');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', date: '', price: '', available_tickets: '', image_url: '' });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add New Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading events...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">ID</th>
                <th className="p-4 font-semibold text-gray-700">Title</th>
                <th className="p-4 font-semibold text-gray-700">Date</th>
                <th className="p-4 font-semibold text-gray-700">Price</th>
                <th className="p-4 font-semibold text-gray-700">Tickets</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(evt => (
                <tr key={evt.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">#{evt.id}</td>
                  <td className="p-4 font-medium text-gray-900">{evt.title}</td>
                  <td className="p-4 text-gray-600">{new Date(evt.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600">${Number(evt.price).toFixed(2)}</td>
                  <td className="p-4 text-gray-600">{evt.available_tickets}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleEdit(evt)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(evt.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No events found. Add one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required name="description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input required type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Tickets</label>
                  <input required type="number" name="available_tickets" value={formData.available_tickets} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
