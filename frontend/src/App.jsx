import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import AdminEvents from './pages/admin/AdminEvents';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
