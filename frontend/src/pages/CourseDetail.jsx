import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const levelLabels = { beginner: 'Iniciante', intermediate: 'Intermédio', advanced: 'Avançado' };

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    client.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(() => toast.error('Curso não encontrado'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await client.post(`/courses/${id}/enroll`);
      toast.success('Inscrito com sucesso!');
    } catch (err) {
      if (err.response?.status === 409) toast('Já estás inscrito neste curso!');
      else toast.error('Erro ao inscrever');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6264A7]"></div></div>;
  if (!course) return <div className="text-center py-20 text-[#605E5C]">Curso não encontrado.</div>;

  const chapters = course.chapters || [];
  let contentBlocks = [];
  try { contentBlocks = typeof course.content === 'string' ? JSON.parse(course.content) : (course.content || []); } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course header */}
      <div className="bg-gradient-to-br from-[#6264A7] to-[#464775] rounded-xl p-8 text-white mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{course.category}</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{levelLabels[course.level]}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-[#E8E8F0] mb-4">{course.description}</p>
            <div className="flex gap-4 text-sm text-[#E8E8F0]">
              <span>⏱ {course.duration} minutos</span>
              <span>📖 {chapters.length} capítulos</span>
              <span>👤 {course.author_name}</span>
            </div>
          </div>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-white text-[#6264A7] hover:bg-[#E8E8F0] font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {enrolling ? 'A inscrever...' : 'Inscrever-me'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar — chapters */}
        {chapters.length > 0 && (
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-20">
              <h3 className="font-semibold text-[#323130] mb-3 text-sm uppercase tracking-wide">Capítulos</h3>
              <ul className="space-y-1">
                {chapters.map((ch, i) => (
                  <li key={ch.id}>
                    <button
                      onClick={() => setActiveChapter(i)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeChapter === i
                          ? 'bg-[#6264A7] text-white font-medium'
                          : 'text-[#323130] hover:bg-[#E8E8F0]'
                      }`}
                    >
                      {ch.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className={chapters.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {chapters.length > 0 ? (
            <div className="card p-8">
              <h2 className="text-xl font-bold text-[#323130] mb-4">{chapters[activeChapter]?.title}</h2>
              <div className="prose prose-sm max-w-none text-[#323130]">
                <pre className="whitespace-pre-wrap font-sans text-[#323130] leading-relaxed">
                  {chapters[activeChapter]?.content}
                </pre>
              </div>
            </div>
          ) : contentBlocks.length > 0 ? (
            <div className="space-y-6">
              {contentBlocks.map((block, i) => (
                <div key={i} className="card p-6">
                  <h2 className="text-lg font-semibold text-[#323130] mb-3">{block.heading}</h2>
                  <p className="text-[#605E5C] leading-relaxed">{block.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-[#605E5C]">
              Conteúdo em breve...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
