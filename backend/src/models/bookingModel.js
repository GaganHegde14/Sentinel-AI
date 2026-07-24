import pool from '../config/db.js';

export const bookTicket = async (userId, eventId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if tickets are available
    const [eventRows] = await connection.query('SELECT available_tickets FROM events WHERE id = ? FOR UPDATE', [eventId]);
    if (eventRows.length === 0 || eventRows[0].available_tickets <= 0) {
      throw new Error('Tickets sold out');
    }

    // Insert booking
    const [bookingResult] = await connection.query(
      'INSERT INTO bookings (user_id, event_id, status) VALUES (?, ?, ?)',
      [userId, eventId, 'booked']
    );

    // Update event ticket count
    await connection.query('UPDATE events SET available_tickets = available_tickets - 1 WHERE id = ?', [eventId]);

    await connection.commit();
    return bookingResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const cancelBooking = async (userId, bookingId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check booking
    const [bookingRows] = await connection.query('SELECT event_id, status FROM bookings WHERE id = ? AND user_id = ? FOR UPDATE', [bookingId, userId]);
    if (bookingRows.length === 0) {
      throw new Error('Booking not found');
    }
    if (bookingRows[0].status === 'cancelled') {
      throw new Error('Booking already cancelled');
    }

    const eventId = bookingRows[0].event_id;

    // Update booking status
    await connection.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);

    // Restore ticket count
    await connection.query('UPDATE events SET available_tickets = available_tickets + 1 WHERE id = ?', [eventId]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getUserBookings = async (userId) => {
  const query = `
    SELECT b.id as booking_id, b.status, b.booking_date, e.* 
    FROM bookings b 
    JOIN events e ON b.event_id = e.id 
    WHERE b.user_id = ? 
    ORDER BY b.booking_date DESC
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows;
};

export const getAllBookings = async () => {
  const query = `
    SELECT b.id as booking_id, b.status, b.booking_date, u.name as user_name, u.email as user_email, e.title as event_title 
    FROM bookings b 
    JOIN events e ON b.event_id = e.id 
    JOIN users u ON b.user_id = u.id
    ORDER BY b.booking_date DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};
