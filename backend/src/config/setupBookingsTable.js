import pool from './db.js';

const setupBookingsTable = async () => {
  try {
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        status ENUM('booked', 'cancelled') DEFAULT 'booked',
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      );
    `;
    await pool.query(createBookingsTable);
    console.log('Bookings table created or already exists.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating bookings table:', error);
    process.exit(1);
  }
};

setupBookingsTable();
