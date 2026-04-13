# CURSODEIA — Curso de Inteligência Artificial

Plataforma de ebooks interativos para cursos de IA, com backoffice e frontoffice, construída com React + Vite e Express + SQLite.

## Tecnologias

- **Frontend**: React 18 + Vite + Tailwind CSS (Microsoft Teams-like)
- **Backend**: Express.js + SQLite (better-sqlite3)
- **Auth**: JWT + bcryptjs
- **Estilo**: Tailwind CSS com tema Microsoft Teams

## Funcionalidades

- 📚 Catálogo de cursos de IA em português
- 📖 Leitor de ebook interativo com capítulos
- 👤 Registo e login de utilizadores
- 🔐 Áreas protegidas por autenticação
- 👤 Área de perfil do utilizador
- 🛠 Backoffice admin: gestão de cursos e utilizadores
- 🗄 Base de dados SQLite

## Instalação & Execução

### Backend
```bash
cd backend
npm install
npm run dev
# API disponível em http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App disponível em http://localhost:5173
```

### Credenciais de demo
- **Admin**: admin@cursodeia.ai / admin123

## Estrutura

```
cursodeia/
├── backend/          # Express API
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── middleware/auth.js
│       └── routes/
├── frontend/         # React Vite app
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       └── pages/
└── data/             # SQLite database (auto-created)
```
