
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Sun, Moon, LogIn, ShieldCheck, X, Menu, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { translations, LangType } from '../translations';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import LoginModal from './LoginModal';

interface LayoutProps {
  children: React.ReactNode;
}

const I18nContext = createContext<{
  lang: LangType;
  t: (key: keyof typeof translations['ar']) => string;
  setLang: (l: LangType) => void;
}>({
  lang: 'ar',
  t: (k) => k,
  setLang: () => {}
});

export const useI18n = () => useContext(I18nContext);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<LangType>('ar');
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState<{ name: string; phone: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('dorak_user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }

    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const t = (key: keyof typeof translations['ar']) => translations[lang][key] || key;

  const handleLoginSuccess = (name: string) => {
    const savedUser = localStorage.getItem('dorak_user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      navigate('/profile'); // Redirect to profile on success
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dorak_user');
    setUserData(null);
    navigate('/');
  };

  const handleAccountClick = () => {
    if (userData) {
      navigate('/profile');
    } else {
      setShowLogin(true);
    }
  };

  // Active Link Style Logic
  const getNavLinkClass = (isActive: boolean) => {
    return `transition-all duration-300 font-black text-xl py-2 border-b-2 ${
      isActive 
        ? 'text-blue-600 border-blue-600' 
        : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-blue-400 hover:border-blue-200'
    }`;
  };

  const userDisplayName = userData ? userData.name.split(' ')[0] : t('nav_account');

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      <div className="flex flex-col min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 font-cairo overflow-x-hidden" dir="rtl">
        
        {/* Navigation Header */}
        <header className="fixed top-0 left-0 right-0 h-20 md:h-28 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-900 z-[100] px-4 md:px-12 lg:px-24">
          <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between">
            
            {/* Logo - Far Right */}
            <div 
              className="flex items-center gap-3 md:gap-5 cursor-pointer group shrink-0" 
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-600 rounded-2xl md:rounded-[24px] flex items-center justify-center text-white font-black text-xl md:text-3xl shadow-2xl shadow-blue-400/40 group-hover:rotate-6 transition-transform">
                D
              </div>
              <span className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                {lang === 'ar' ? 'دورك' : 'Dorak'}
              </span>
            </div>

            {/* Desktop Navigation Links - Center */}
            <nav className="hidden lg:flex items-center gap-12 h-full">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {t('nav_home')}
              </NavLink>
              <NavLink 
                to="/doctors" 
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {t('nav_doctors')}
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {t('nav_about')}
              </NavLink>
            </nav>

            {/* Utilities - Far Left */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:flex items-center gap-3">
                 <button 
                  onClick={() => setIsDark(!isDark)}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-blue-50 transition-all border border-slate-100 dark:border-slate-800"
                >
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <button 
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 font-black hover:bg-blue-50 transition-all border border-slate-100 dark:border-slate-800"
                >
                  {lang === 'ar' ? 'EN' : 'AR'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAccountClick}
                  className={`flex items-center gap-3 font-black px-6 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-[24px] shadow-2xl transition-all active:scale-95 ${
                    userData 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800' 
                      : 'bg-blue-600 text-white shadow-blue-200 dark:shadow-none hover:bg-blue-700'
                  }`}
                >
                  <User size={24} className="hidden sm:block" />
                  <span className="text-lg md:text-xl whitespace-nowrap">{userDisplayName}</span>
                </button>
                
                {userData && (
                  <button 
                    onClick={handleLogout}
                    className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/50 hover:bg-red-100 transition-all"
                    title="تسجيل الخروج"
                  >
                    <LogOut size={20} />
                  </button>
                )}
              </div>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 px-6 py-8 flex flex-col gap-6"
              >
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => `text-2xl font-black ${isActive ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}
                >
                  {t('nav_home')}
                </NavLink>
                <NavLink 
                  to="/doctors" 
                  className={({ isActive }) => `text-2xl font-black ${isActive ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}
                >
                  {t('nav_doctors')}
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `text-2xl font-black ${isActive ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}
                >
                  {t('nav_about')}
                </NavLink>
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex gap-4">
                      <button onClick={() => setIsDark(!isDark)} className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center">{isDark ? <Sun /> : <Moon />}</button>
                      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center font-black">EN</button>
                   </div>
                   <span className="text-slate-400 font-bold">الإعدادات</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Header Spacer */}
        <div className="h-20 md:h-28" />

        {/* Main Content */}
        <main className="flex-1 w-full max-w-[100vw]">
          {children}
        </main>

        <Footer />
        <WhatsAppButton />

        {/* Login Modal */}
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </I18nContext.Provider>
  );
};

export default Layout;
