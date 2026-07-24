import * as bookingModel from '../models/bookingModel.js';

export const bookTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const bookingId = await bookingModel.bookTicket(req.user.id, eventId);
    res.status(201).json({ message: 'Ticket booked successfully', bookingId });
  } catch (error) {
    if (error.message === 'Tickets sold out') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error booking ticket:', error);
    res.status(500).json({ message: 'Server error booking ticket' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    await bookingModel.cancelBooking(req.user.id, req.params.id);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    if (error.message === 'Booking not found' || error.message === 'Booking already cancelled') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error fetching all bookings' });
  }
};
