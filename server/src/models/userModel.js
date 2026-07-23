import { query } from '../config/db.js';

export async function createUser(email, passwordHash, role = 'viewer') {
  const result = await query(
    `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
    [email, passwordHash, role]
  );
  return { id: result.insertId, email, role };
}

export async function findUserByEmail(email) {
  const users = await query(`SELECT * FROM users WHERE email = ?`, [email]);
  return users.length > 0 ? users[0] : null;
}

export async function findUserById(id) {
  const users = await query(`SELECT id, email, role, created_at FROM users WHERE id = ?`, [id]);
  return users.length > 0 ? users[0] : null;
}
