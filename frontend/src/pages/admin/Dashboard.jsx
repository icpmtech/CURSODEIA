import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/users/stats/summary')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Erro ao carregar estatísticas'))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Utilizadores', value: stats.totalUsers, icon: '👥', color: 'from-[#6264A7] to-[#464775]' },
    { label: 'Total Cursos', value: stats.totalCourses, icon: '📚', color: 'from-[#0078D4] to-[#106EBE]' },
    { label: 'Cursos Publicados', value: stats.publishedCourses, icon: '✅', color: 'from-[#107C10] to-[#0E6B0E]' },
    { label: 'Inscrições', value: stats.totalEnrollments, icon: '🎓', color: 'from-[#D83B01] to-[#B83301]' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#323130]">Dashboard Admin</h1>
        <p className="text-[#605E5C] mt-1">Bem-vindo ao painel de administração do CURSODEIA</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6264A7]"></div></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map(card => (
              <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white`}>
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="text-3xl font-bold">{card.value}</div>
                <div className="text-white/80 text-sm mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="font-semibold text-[#323130] mb-4">Gestão Rápida</h2>
              <div className="space-y-3">
                <Link to="/admin/courses" className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded transition-colors">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium text-[#323130]">Gerir Cursos</p>
                    <p className="text-xs text-[#605E5C]">Criar, editar e publicar cursos</p>
                  </div>
                </Link>
                <Link to="/admin/users" className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded transition-colors">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-medium text-[#323130]">Gerir Utilizadores</p>
                    <p className="text-xs text-[#605E5C]">Ver e administrar utilizadores</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-[#323130] mb-4">Informação do Sistema</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-[#E1DFDD]">
                  <span className="text-[#605E5C]">Base de dados</span>
                  <span className="font-medium text-[#323130]">SQLite</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E1DFDD]">
                  <span className="text-[#605E5C]">Frontend</span>
                  <span className="font-medium text-[#323130]">React + Vite</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#E1DFDD]">
                  <span className="text-[#605E5C]">Backend</span>
                  <span className="font-medium text-[#323130]">Express.js</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#605E5C]">Estilo</span>
                  <span className="font-medium text-[#323130]">Tailwind (Teams)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
