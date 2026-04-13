import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/courses', label: 'Cursos', icon: '📚' },
  { to: '/admin/users', label: 'Utilizadores', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Admin Header */}
      <header className="bg-[#464775] text-white h-14 flex items-center px-4 sm:px-6 sticky top-0 z-50 shadow">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
              <span className="text-[#464775] font-bold text-xs">AI</span>
            </div>
            <span className="font-semibold">CURSODEIA</span>
          </Link>
          <span className="text-white/50">|</span>
          <span className="text-sm text-white/80">Backoffice</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80 hidden sm:block">{user?.name}</span>
          <Link to="/" className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1.5 rounded transition-colors">Ver Site</Link>
          <button onClick={handleLogout} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1.5 rounded transition-colors">Sair</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-[#E1DFDD] hidden md:block">
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                    active ? 'bg-[#E8E8F0] text-[#6264A7]' : 'text-[#605E5C] hover:bg-[#F5F5F5] hover:text-[#323130]'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
