import { useState, useEffect } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';

const levelLabels = { beginner: 'Iniciante', intermediate: 'Intermédio', advanced: 'Avançado' };

const emptyForm = { title: '', description: '', category: 'AI Fundamentals', level: 'beginner', duration: 60, is_published: false, content: [] };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCourses = () => {
    setLoading(true);
    client.get('/courses/all')
      .then(res => setCourses(res.data))
      .catch(() => toast.error('Erro ao carregar cursos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (course) => {
    setEditing(course);
    let content = [];
    try { content = typeof course.content === 'string' ? JSON.parse(course.content) : (course.content || []); } catch {}
    setForm({ ...course, content, is_published: !!course.is_published });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await client.put(`/courses/${editing.id}`, form);
        toast.success('Curso actualizado!');
      } else {
        await client.post('/courses', form);
        toast.success('Curso criado!');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este curso?')) return;
    try {
      await client.delete(`/courses/${id}`);
      toast.success('Curso eliminado');
      fetchCourses();
    } catch {
      toast.error('Erro ao eliminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#323130]">Gestão de Cursos</h1>
          <p className="text-[#605E5C] text-sm mt-1">{courses.length} cursos no total</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2">+ Novo Curso</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6264A7]"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] border-b border-[#E1DFDD]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C]">Título</th>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C] hidden md:table-cell">Categoria</th>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C] hidden md:table-cell">Nível</th>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C]">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-[#605E5C]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFDD]">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-[#F5F5F5] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#323130]">{course.title}</td>
                  <td className="px-4 py-3 text-[#605E5C] hidden md:table-cell">{course.category}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-[#E8E8F0] text-[#6264A7] px-2 py-0.5 rounded-full">{levelLabels[course.level]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {course.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(course)} className="text-[#6264A7] hover:underline text-xs font-medium mr-3">Editar</button>
                    <button onClick={() => handleDelete(course.id)} className="text-[#C4314B] hover:underline text-xs font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E1DFDD]">
              <h2 className="font-semibold text-[#323130] text-lg">{editing ? 'Editar Curso' : 'Novo Curso'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#605E5C] hover:text-[#323130] text-xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">Título *</label>
                <input type="text" className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">Descrição</label>
                <textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#323130] mb-1">Categoria</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {['AI Fundamentals','Machine Learning','Deep Learning','NLP','Generative AI','Data Science'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#323130] mb-1">Nível</label>
                  <select className="input-field" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermédio</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">Duração (minutos)</label>
                <input type="number" className="input-field" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value)})} min={0} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="w-4 h-4 accent-[#6264A7]" />
                <label htmlFor="published" className="text-sm text-[#323130]">Publicar curso</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary px-6 flex-1" disabled={saving}>{saving ? 'A guardar...' : 'Guardar'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary px-6">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
