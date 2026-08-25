import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DesktopSidebar from './DesktopSidebar';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';

const AppShell = ({ children }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const backPages = ['/about', '/progress', '/badges', '/scenarios', '/certificate', '/verify', '/module', '/quiz'];
  const showBack = backPages.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {!isMobile && <DesktopSidebar />}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {isMobile && <MobileHeader showBack={showBack} title={getPageTitle(location.pathname)} />}
        <main style={{
          flex: 1,
          padding: isMobile ? '16px 16px 80px' : '24px 32px 32px',
          maxWidth: isMobile ? '100%' : '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        {isMobile && <MobileBottomNav />}
      </div>
    </div>
  );
};

const getPageTitle = (path) => {
  const titles = {
    '/': 'Dashboard',
    '/learn': 'Learn',
    '/scenarios': 'Scenarios',
    '/quiz': 'Quizzes',
    '/progress': 'Progress',
    '/badges': 'Badges',
    '/ai-coach': 'AI Assistant',
    '/certificate': 'Certificate',
    '/about': 'About',
  };
  return titles[path] || 'CyberAware';
};

export default AppShell;
