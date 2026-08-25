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

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-bg-primary)',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {!isMobile && <DesktopSidebar />}

      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        {isMobile && <MobileHeader showBack={showBack} title={getPageTitle(location.pathname)} />}

        <main style={{
          flex: 1,
          padding: isMobile ? '16px 16px 100px' : '24px 32px 32px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '1200px',
          margin: '0 auto',
          overflowX: 'hidden',
          position: 'relative',
          background: 'var(--color-bg-primary)'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                maxWidth: '100%',
                opacity: 1,
                position: 'relative',
                zIndex: 1
              }}
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

export default AppShell;
