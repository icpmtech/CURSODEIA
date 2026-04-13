const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/stats/summary - admin (must be before /:id)
router.get('/stats/summary', authenticate, requireAdmin, (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
  const publishedCourses = db.prepare('SELECT COUNT(*) as count FROM courses WHERE is_published = 1').get().count;
  const totalEnrollments = db.prepare('SELECT COUNT(*) as count FROM enrollments').get().count;
  res.json({ totalUsers, totalCourses, publishedCourses, totalEnrollments });
});

// GET /api/users - admin
router.get('/', authenticate, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, avatar, bio, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

// GET /api/users/:id - admin
router.get('/:id', authenticate, requireAdmin, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, avatar, bio, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
  const enrollments = db.prepare('SELECT e.*, c.title FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = ?').all(req.params.id);
  res.json({ ...user, enrollments });
});

// POST /api/users - admin
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email já existe' });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, hash, role || 'student');
  const user = db.prepare('SELECT id, name, email, role, avatar, bio, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(user);
});

// PUT /api/users/:id - admin
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { name, email, role, bio } = req.body;
  db.prepare('UPDATE users SET name = ?, email = ?, role = ?, bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, email, role, bio || null, req.params.id);
  const user = db.prepare('SELECT id, name, email, role, avatar, bio, created_at FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
});

// DELETE /api/users/:id - admin
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
  if (user.role === 'admin') return res.status(403).json({ error: 'Não é possível eliminar um admin' });
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'Utilizador eliminado com sucesso' });
});

module.exports = router;
