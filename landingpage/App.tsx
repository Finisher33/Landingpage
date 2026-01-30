
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WebinarInfo from './components/WebinarInfo';
import RegistrationForm from './components/RegistrationForm';
import AdminPage from './components/AdminPage';

type ViewState = 'landing' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Header />

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        {view === 'landing' ? (
          <>
            <Hero />
            <WebinarInfo />
            <RegistrationForm />
          </>
        ) : (
          <AdminPage onBack={() => setView('landing')} />
        )}
        
        <div className="mt-24 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} xClass NOW. All rights reserved.
          </p>
          <button 
            onClick={() => setView('admin')}
            className="mt-4 text-slate-700 hover:text-slate-500 text-xs transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
