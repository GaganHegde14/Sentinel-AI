import pool from './db.js';

const setupEventsTable = async () => {
  try {
    const createEventsTable = `
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        date DATETIME NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        available_tickets INT NOT NULL,
        image_url VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createEventsTable);
    console.log('Events table created or already exists.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating events table:', error);
    process.exit(1);
  }
};

setupEventsTable();
