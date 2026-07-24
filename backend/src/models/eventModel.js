import pool from '../config/db.js';

export const getAllEvents = async (search = '') => {
  let query = 'SELECT * FROM events';
  const params = [];
  
  if (search) {
    query += ' WHERE title LIKE ? OR description LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY date ASC';
  
  const [rows] = await pool.query(query, params);
  return rows;
};

export const getEventById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
  return rows[0];
};

export const createEvent = async (eventData) => {
  const { title, description, date, price, available_tickets, image_url } = eventData;
  const [result] = await pool.query(
    'INSERT INTO events (title, description, date, price, available_tickets, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, date, price, available_tickets, image_url || '']
  );
  return result.insertId;
};

export const updateEvent = async (id, eventData) => {
  const { title, description, date, price, available_tickets, image_url } = eventData;
  const [result] = await pool.query(
    'UPDATE events SET title = ?, description = ?, date = ?, price = ?, available_tickets = ?, image_url = ? WHERE id = ?',
    [title, description, date, price, available_tickets, image_url, id]
  );
  return result.affectedRows > 0;
};

export const deleteEvent = async (id) => {
  const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
