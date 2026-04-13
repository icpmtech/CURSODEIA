import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/courses/user/enrolled')
      .then(res => setCourses(res.data))
      .catch(() => toast.error('Erro ao carregar cursos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#323130] mb-6">Os Meus Cursos</h1>
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6264A7]"></div></div>
      ) : courses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[#605E5C] mb-4">Ainda não estás inscrito em nenhum curso.</p>
          <Link to="/courses" className="btn-primary px-6 py-2.5">Explorar Cursos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="h-28 bg-gradient-to-br from-[#6264A7] to-[#464775] rounded-t-lg flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#323130] mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-[#605E5C] mb-3">{course.category}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#E1DFDD] rounded-full h-1.5">
                    <div className="bg-[#6264A7] h-1.5 rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                  </div>
                  <span className="text-xs text-[#605E5C]">{course.progress || 0}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
