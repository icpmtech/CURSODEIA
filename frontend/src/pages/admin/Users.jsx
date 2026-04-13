import { useState, useEffect } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';

const emptyForm = { name: '', email: '', password: '', role: 'student' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    client.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Erro ao carregar utilizadores'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (user) => { setEditing(user); setForm({ name: user.name, email: user.email, role: user.role, bio: user.bio || '', password: '' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await client.put(`/users/${editing.id}`, form);
        toast.success('Utilizador actualizado!');
      } else {
        await client.post('/users', form);
        toast.success('Utilizador criado!');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este utilizador?')) return;
    try {
      await client.delete(`/users/${id}`);
      toast.success('Utilizador eliminado');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao eliminar');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#323130]">Gestão de Utilizadores</h1>
          <p className="text-[#605E5C] text-sm mt-1">{users.length} utilizadores registados</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-4 py-2">+ Novo Utilizador</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6264A7]"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] border-b border-[#E1DFDD]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C]">Utilizador</th>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C] hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C]">Função</th>
                <th className="text-left px-4 py-3 font-medium text-[#605E5C] hidden md:table-cell">Registado em</th>
                <th className="text-right px-4 py-3 font-medium text-[#605E5C]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFDD]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-[#F5F5F5] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-[#6264A7] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold uppercase">{user.name?.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-[#323130]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#605E5C] hidden md:table-cell">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Estudante'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#605E5C] hidden md:table-cell">{new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(user)} className="text-[#6264A7] hover:underline text-xs font-medium mr-3">Editar</button>
                    {user.role !== 'admin' && (
                      <button onClick={() => handleDelete(user.id)} className="text-[#C4314B] hover:underline text-xs font-medium">Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[#E1DFDD]">
              <h2 className="font-semibold text-[#323130] text-lg">{editing ? 'Editar Utilizador' : 'Novo Utilizador'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#605E5C] hover:text-[#323130] text-xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">Nome *</label>
                <input type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">Email *</label>
                <input type="email" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-[#323130] mb-1">Senha *</label>
                  <input type="password" className="input-field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editing} minLength={6} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#323130] mb-1">Função</label>
                <select className="input-field" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="student">Estudante</option>
                  <option value="admin">Administrador</option>
                </select>
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
