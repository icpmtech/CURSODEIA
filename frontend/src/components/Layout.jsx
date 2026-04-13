import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
          active
            ? 'bg-[#464775] text-white'
            : 'text-[#E8E8F0] hover:bg-[#464775] hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Top nav */}
      <header className="bg-[#6264A7] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-[#6264A7] font-bold text-sm">AI</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">CURSODEIA</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navLink('/', 'Início')}
                {navLink('/courses', 'Cursos')}
                {user && navLink('/my-courses', 'Os Meus Cursos')}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 bg-[#464775] hover:bg-[#3b3d6b] rounded text-sm font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-[#464775] rounded px-2 py-1.5 transition-colors">
                    <div className="w-7 h-7 bg-[#E8E8F0] rounded-full flex items-center justify-center">
                      <span className="text-[#6264A7] font-bold text-xs uppercase">
                        {user.name?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm hidden sm:block">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[#E8E8F0] hover:text-white text-sm px-2 py-1.5 rounded hover:bg-[#464775] transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="px-3 py-1.5 text-[#E8E8F0] hover:text-white text-sm font-medium hover:bg-[#464775] rounded transition-colors">
                    Entrar
                  </Link>
                  <Link to="/register" className="px-3 py-1.5 bg-white text-[#6264A7] hover:bg-[#E8E8F0] rounded text-sm font-medium transition-colors">
                    Registar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#464775] text-[#E8E8F0] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2024 CURSODEIA — Curso de Inteligência Artificial</p>
        </div>
      </footer>
    </div>
  );
}
