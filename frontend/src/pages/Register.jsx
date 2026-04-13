import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Conta criada com sucesso!');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#6264A7] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-[#323130]">Criar Conta</h1>
            <p className="text-[#605E5C] text-sm mt-1">Junta-te ao CURSODEIA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Nome completo</label>
              <input
                type="text"
                className="input-field"
                placeholder="João Silva"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Senha</label>
              <input
                type="password"
                className="input-field"
                placeholder="Mín. 6 caracteres"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Confirmar senha</label>
              <input
                type="password"
                className="input-field"
                placeholder="Repita a senha"
                value={form.confirm}
                onChange={e => setForm({...form, confirm: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#605E5C]">
            Já tens conta?{' '}
            <Link to="/login" className="text-[#6264A7] hover:underline font-medium">
              Iniciar Sessão
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
