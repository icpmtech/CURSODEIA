import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: '🤖', title: 'IA & Machine Learning', desc: 'Aprenda os fundamentos e técnicas avançadas de IA' },
  { icon: '🧠', title: 'Deep Learning', desc: 'Redes neurais, CNN, RNN e transformers' },
  { icon: '💬', title: 'NLP & LLMs', desc: 'Processamento de linguagem e modelos generativos' },
  { icon: '📊', title: 'Data Science', desc: 'Análise de dados e visualização com Python' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#6264A7] to-[#464775] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            🚀 A plataforma de IA em português
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Aprende Inteligência Artificial<br />
            <span className="text-[#E8E8F0]">do zero ao avançado</span>
          </h1>
          <p className="text-xl text-[#E8E8F0] mb-10 max-w-2xl mx-auto">
            Cursos práticos e interativos sobre IA, Machine Learning, Deep Learning e muito mais. 
            Em português, para toda a comunidade lusófona.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/courses" className="px-8 py-3 bg-white text-[#6264A7] font-semibold rounded-lg hover:bg-[#E8E8F0] transition-colors text-lg">
              Ver Cursos
            </Link>
            {!user && (
              <Link to="/register" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg">
                Criar Conta Grátis
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E1DFDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '5+', label: 'Cursos' },
              { value: '100%', label: 'Em Português' },
              { value: 'SQLite', label: 'Base de dados' },
              { value: 'Grátis', label: 'Acesso' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[#6264A7]">{stat.value}</div>
                <div className="text-sm text-[#605E5C] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#323130] mb-2 text-center">O que vais aprender</h2>
        <p className="text-[#605E5C] text-center mb-10">Conteúdo actualizado e prático</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-[#323130] mb-2">{f.title}</h3>
              <p className="text-sm text-[#605E5C]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="bg-[#E8E8F0] py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-[#323130] mb-4">Pronto para começar?</h2>
            <p className="text-[#605E5C] mb-8">Regista-te gratuitamente e começa a aprender IA hoje.</p>
            <Link to="/register" className="btn-primary px-10 py-3 text-lg">
              Começar Agora — É Grátis
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
