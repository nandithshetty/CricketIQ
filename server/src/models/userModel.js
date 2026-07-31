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

export async function ensureAdminUserExists() {
  try {
    const bcrypt = (await import('bcryptjs')).default;
    const adminEmail = 'admin@cricketiq.com';
    const existing = await findUserByEmail(adminEmail);
    if (!existing) {
      const hash = await bcrypt.hash('admin123', 10);
      await createUser(adminEmail, hash, 'admin');
      console.log(`👑 Default Admin Account Initialized: ${adminEmail} (password: admin123)`);
    }
  } catch (err) {
    console.error('Failed to initialize admin account:', err.message);
  }
}
