import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';

const levelColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};
const levelLabels = { beginner: 'Iniciante', intermediate: 'Intermédio', advanced: 'Avançado' };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (level) params.level = level;
      const res = await client.get('/courses', { params });
      setCourses(res.data);
    } catch {
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [search, level]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#323130] mb-2">Catálogo de Cursos</h1>
        <p className="text-[#605E5C]">Aprende IA com os melhores cursos em português</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Pesquisar cursos..."
          className="input-field max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input-field max-w-xs" value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">Todos os níveis</option>
          <option value="beginner">Iniciante</option>
          <option value="intermediate">Intermédio</option>
          <option value="advanced">Avançado</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6264A7]"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-[#605E5C]">Nenhum curso encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card hover:shadow-lg transition-shadow group">
              <div className="h-36 bg-gradient-to-br from-[#6264A7] to-[#464775] rounded-t-lg flex items-center justify-center">
                <span className="text-5xl">🤖</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[course.level]}`}>
                    {levelLabels[course.level]}
                  </span>
                  <span className="text-xs text-[#605E5C] bg-[#F5F5F5] px-2 py-0.5 rounded-full">
                    {course.category}
                  </span>
                </div>
                <h3 className="font-semibold text-[#323130] mb-2 group-hover:text-[#6264A7] transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-[#605E5C] mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-[#605E5C]">
                  <span>⏱ {course.duration} min</span>
                  <span>por {course.author_name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
