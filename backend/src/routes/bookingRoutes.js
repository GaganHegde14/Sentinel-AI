import express from 'express';
import { bookTicket, cancelBooking, getMyBookings, getAllBookings } from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, bookTicket);
router.get('/mybookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, adminOnly, getAllBookings);

export default router;
