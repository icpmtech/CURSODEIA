import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Bem-vindo, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/courses');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao iniciar sessão');
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
            <h1 className="text-2xl font-bold text-[#323130]">Iniciar Sessão</h1>
            <p className="text-[#605E5C] text-sm mt-1">CURSODEIA — Plataforma de IA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#323130] mb-1">Senha</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#605E5C]">
            Não tens conta?{' '}
            <Link to="/register" className="text-[#6264A7] hover:underline font-medium">
              Registar
            </Link>
          </div>

          <div className="mt-6 p-3 bg-[#E8E8F0] rounded text-xs text-[#605E5C]">
            <p className="font-medium mb-1">Demo admin:</p>
            <p>Email: admin@cursodeia.ai</p>
            <p>Senha: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
