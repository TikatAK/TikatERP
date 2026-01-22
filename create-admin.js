const bcrypt = require('./backend/node_modules/bcryptjs');
const { Pool } = require('./backend/node_modules/pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'erp_db',
  user: 'erp_user',
  password: 'erp_pass123'
});

async function createAdmin() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hash);

    const result = await pool.query(
      'INSERT INTO users (username, password, real_name, email, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, username',
      ['admin', hash, '系统管理员', 'admin@example.com', 'active']
    );

    console.log('User created:', result.rows[0]);
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
  }
}

createAdmin();
