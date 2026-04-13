const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../data/cursodeia.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    avatar TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    cover_image TEXT,
    category TEXT DEFAULT 'AI',
    level TEXT DEFAULT 'beginner',
    duration INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 0,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    progress INTEGER DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );
`);

// Seed admin user if not exists
const admin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@cursodeia.ai');
if (!admin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run('Admin', 'admin@cursodeia.ai', hash, 'admin');
}

// Seed sample courses if none exist
const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get();
if (courseCount.count === 0) {
  const adminUser = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  const courses = [
    {
      title: 'Introdução à Inteligência Artificial',
      description: 'Aprenda os fundamentos da IA, machine learning e deep learning neste curso completo.',
      content: JSON.stringify([
        { heading: 'O que é IA?', body: 'A Inteligência Artificial (IA) é a simulação de processos de inteligência humana por sistemas computacionais.' },
        { heading: 'História da IA', body: 'Desde os anos 1950, com Alan Turing, até os dias atuais com modelos de linguagem como GPT.' },
      ]),
      category: 'AI Fundamentals',
      level: 'beginner',
      duration: 120,
      is_published: 1,
      author_id: adminUser.id,
    },
    {
      title: 'Machine Learning com Python',
      description: 'Domine os algoritmos de ML usando scikit-learn, pandas e numpy.',
      content: JSON.stringify([
        { heading: 'Instalação do Ambiente', body: 'Configure seu ambiente Python com Anaconda, Jupyter Notebook e as principais bibliotecas.' },
        { heading: 'Regressão Linear', body: 'Entenda e implemente regressão linear do zero para prever valores contínuos.' },
      ]),
      category: 'Machine Learning',
      level: 'intermediate',
      duration: 240,
      is_published: 1,
      author_id: adminUser.id,
    },
    {
      title: 'Deep Learning e Redes Neurais',
      description: 'Construa redes neurais profundas com TensorFlow e PyTorch.',
      content: JSON.stringify([
        { heading: 'Perceptrão', body: 'O perceptrão é a unidade básica de uma rede neural, inspirado no neurônio biológico.' },
        { heading: 'Backpropagation', body: 'O algoritmo de retropropagação calcula gradientes para treinar redes neurais.' },
      ]),
      category: 'Deep Learning',
      level: 'advanced',
      duration: 360,
      is_published: 1,
      author_id: adminUser.id,
    },
    {
      title: 'Processamento de Linguagem Natural',
      description: 'Explore NLP, transformers, BERT e GPT para processamento de texto.',
      content: JSON.stringify([
        { heading: 'Tokenização', body: 'A tokenização divide texto em unidades menores (tokens) para processamento por modelos.' },
        { heading: 'Word Embeddings', body: 'Word2Vec, GloVe e FastText convertem palavras em vetores numéricos densos.' },
      ]),
      category: 'NLP',
      level: 'advanced',
      duration: 300,
      is_published: 1,
      author_id: adminUser.id,
    },
    {
      title: 'IA Generativa com Prompts',
      description: 'Aprenda prompt engineering para ChatGPT, Claude e outros LLMs.',
      content: JSON.stringify([
        { heading: 'O que é Prompt Engineering?', body: 'A arte de criar instruções eficazes para modelos de linguagem obter resultados precisos.' },
        { heading: 'Técnicas Avançadas', body: 'Chain-of-thought, few-shot learning e outras técnicas para maximizar a qualidade das respostas.' },
      ]),
      category: 'Generative AI',
      level: 'beginner',
      duration: 90,
      is_published: 1,
      author_id: adminUser.id,
    },
  ];
  const insertCourse = db.prepare('INSERT INTO courses (title, description, content, category, level, duration, is_published, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  courses.forEach(c => insertCourse.run(c.title, c.description, c.content, c.category, c.level, c.duration, c.is_published, c.author_id));

  // Add chapters for first course
  const firstCourse = db.prepare('SELECT id FROM courses LIMIT 1').get();
  if (firstCourse) {
    const chapters = [
      { title: 'Capítulo 1: Fundamentos', content: '# Fundamentos da IA\n\nNeste capítulo exploraremos os conceitos básicos...', order_index: 1 },
      { title: 'Capítulo 2: Algoritmos', content: '# Algoritmos de IA\n\nOs principais algoritmos incluem...', order_index: 2 },
      { title: 'Capítulo 3: Aplicações', content: '# Aplicações Práticas\n\nA IA é usada em reconhecimento de imagem, NLP...', order_index: 3 },
    ];
    const insertChapter = db.prepare('INSERT INTO chapters (course_id, title, content, order_index) VALUES (?, ?, ?, ?)');
    chapters.forEach(ch => insertChapter.run(firstCourse.id, ch.title, ch.content, ch.order_index));
  }
}

module.exports = db;
