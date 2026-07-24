import pool from './db.js';

const makeAdmin = async () => {
  try {
    const [result] = await pool.query("UPDATE users SET role='admin'");
    console.log(`Updated ${result.affectedRows} users to admin role.`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

makeAdmin();
