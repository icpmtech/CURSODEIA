const express = require('express');
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - public
router.get('/', (req, res) => {
  const { category, level, search } = req.query;
  let query = 'SELECT c.*, u.name as author_name FROM courses c LEFT JOIN users u ON c.author_id = u.id WHERE c.is_published = 1';
  const params = [];
  if (category) { query += ' AND c.category = ?'; params.push(category); }
  if (level) { query += ' AND c.level = ?'; params.push(level); }
  if (search) { query += ' AND (c.title LIKE ? OR c.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY c.created_at DESC';
  const courses = db.prepare(query).all(...params);
  res.json(courses);
});

// GET /api/courses/all - admin
router.get('/all', authenticate, requireAdmin, (req, res) => {
  const courses = db.prepare('SELECT c.*, u.name as author_name FROM courses c LEFT JOIN users u ON c.author_id = u.id ORDER BY c.created_at DESC').all();
  res.json(courses);
});

// GET /api/courses/user/enrolled - authenticated
router.get('/user/enrolled', authenticate, (req, res) => {
  const courses = db.prepare(`
    SELECT c.*, e.progress, e.enrolled_at 
    FROM enrollments e 
    JOIN courses c ON e.course_id = c.id 
    WHERE e.user_id = ?
    ORDER BY e.enrolled_at DESC
  `).all(req.user.id);
  res.json(courses);
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  const course = db.prepare('SELECT c.*, u.name as author_name FROM courses c LEFT JOIN users u ON c.author_id = u.id WHERE c.id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
  const chapters = db.prepare('SELECT * FROM chapters WHERE course_id = ? ORDER BY order_index').all(req.params.id);
  res.json({ ...course, chapters });
});

// POST /api/courses - admin
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { title, description, content, category, level, duration, is_published, cover_image } = req.body;
  if (!title) return res.status(400).json({ error: 'Título é obrigatório' });
  const result = db.prepare(
    'INSERT INTO courses (title, description, content, category, level, duration, is_published, cover_image, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(title, description, JSON.stringify(content || []), category || 'AI', level || 'beginner', duration || 0, is_published ? 1 : 0, cover_image || null, req.user.id);
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(course);
});

// PUT /api/courses/:id - admin
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { title, description, content, category, level, duration, is_published, cover_image } = req.body;
  const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
  db.prepare(
    'UPDATE courses SET title = ?, description = ?, content = ?, category = ?, level = ?, duration = ?, is_published = ?, cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(title, description, JSON.stringify(content || []), category, level, duration, is_published ? 1 : 0, cover_image || null, req.params.id);
  const updated = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/courses/:id - admin
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const course = db.prepare('SELECT id FROM courses WHERE id = ?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
  db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ message: 'Curso eliminado com sucesso' });
});

// POST /api/courses/:id/chapters - admin
router.post('/:id/chapters', authenticate, requireAdmin, (req, res) => {
  const { title, content, order_index } = req.body;
  if (!title) return res.status(400).json({ error: 'Título do capítulo é obrigatório' });
  const result = db.prepare('INSERT INTO chapters (course_id, title, content, order_index) VALUES (?, ?, ?, ?)').run(req.params.id, title, content || '', order_index || 0);
  const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(chapter);
});

// PUT /api/courses/:id/chapters/:chapterId - admin
router.put('/:id/chapters/:chapterId', authenticate, requireAdmin, (req, res) => {
  const { title, content, order_index } = req.body;
  db.prepare('UPDATE chapters SET title = ?, content = ?, order_index = ? WHERE id = ? AND course_id = ?').run(title, content, order_index, req.params.chapterId, req.params.id);
  const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.chapterId);
  res.json(chapter);
});

// DELETE /api/courses/:id/chapters/:chapterId - admin
router.delete('/:id/chapters/:chapterId', authenticate, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM chapters WHERE id = ? AND course_id = ?').run(req.params.chapterId, req.params.id);
  res.json({ message: 'Capítulo eliminado' });
});

// POST /api/courses/:id/enroll - authenticated
router.post('/:id/enroll', authenticate, (req, res) => {
  const course = db.prepare('SELECT id FROM courses WHERE id = ? AND is_published = 1').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
  const existing = db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?').get(req.user.id, req.params.id);
  if (existing) return res.status(409).json({ error: 'Já inscrito neste curso' });
  db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)').run(req.user.id, req.params.id);
  res.status(201).json({ message: 'Inscrito com sucesso' });
});

module.exports = router;
