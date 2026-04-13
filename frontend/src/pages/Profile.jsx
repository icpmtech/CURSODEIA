import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [tab, setTab] = useState('profile');

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Perfil actualizado!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('As senhas não coincidem'); return; }
    setPwLoading(true);
    try {
      await client.put('/auth/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Senha alterada!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao alterar senha');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#323130] mb-6">O Meu Perfil</h1>

      {/* Profile header */}
      <div className="card p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-[#6264A7] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-2xl uppercase">{user?.name?.charAt(0)}</span>
        </div>
        <div>
          <h2 className="font-semibold text-[#323130] text-lg">{user?.name}</h2>
          <p className="text-[#605E5C] text-sm">{user?.email}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
            {user?.role === 'admin' ? 'Administrador' : 'Estudante'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E1DFDD] mb-6">
        {['profile', 'password'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-[#6264A7] text-[#6264A7]' : 'border-transparent text-[#605E5C] hover:text-[#323130]'}`}
          >
            {t === 'profile' ? 'Informações' : 'Alterar Senha'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card p-6">
          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Nome</label>
              <input type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Email</label>
              <input type="email" className="input-field opacity-60 cursor-not-allowed" value={user?.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Biografia</label>
              <textarea className="input-field h-24 resize-none" placeholder="Conte um pouco sobre ti..." value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Membro desde</label>
              <input type="text" className="input-field opacity-60 cursor-not-allowed" value={new Date(user?.created_at).toLocaleDateString('pt-PT')} disabled />
            </div>
            <button type="submit" className="btn-primary px-6" disabled={loading}>
              {loading ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card p-6">
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Senha atual</label>
              <input type="password" className="input-field" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Nova senha</label>
              <input type="password" className="input-field" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Confirmar nova senha</label>
              <input type="password" className="input-field" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary px-6" disabled={pwLoading}>
              {pwLoading ? 'A alterar...' : 'Alterar Senha'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
