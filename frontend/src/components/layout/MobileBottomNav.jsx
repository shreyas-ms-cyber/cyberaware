import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const MobileBottomNav = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef(null);

  const mainItems = [
    { path: '/', label: 'Home', icon: 'fa-house' },
    { path: '/learn', label: 'Learn', icon: 'fa-graduation-cap' },
    { path: '/scenarios', label: 'Scenarios', icon: 'fa-shield-alt' },
    { path: '/quiz', label: 'Quizzes', icon: 'fa-question-circle' },
    { path: '/more', label: 'More', icon: 'fa-ellipsis-h' },
  ];

  const moreItems = [
    { path: '/progress', label: 'Progress', icon: 'fa-chart-line' },
    { path: '/badges', label: 'Badges', icon: 'fa-trophy' },
    { path: '/certificate', label: 'Certificate', icon: 'fa-certificate' },
    { path: '/ai-coach', label: 'AI Coach', icon: 'fa-robot' },
    { path: '/about', label: 'About', icon: 'fa-info-circle' },
  ];

  useEffect(() => {
    setShowMore(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(8, 13, 24, 0.98)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border)',
      height: 'var(--mobile-nav-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100
    }} ref={moreRef}>
      {mainItems.map(item => {
        const active = item.path === '/more' ? isMoreActive : isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => {
              if (item.path === '/more') setShowMore(!showMore);
              else setShowMore(false);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '10px',
              padding: '4px 12px',
              minWidth: '56px',
              minHeight: '56px',
              borderRadius: 'var(--radius-sm)',
              background: active ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <i className={`fas ${item.icon}`} style={{ fontSize: '20px', marginBottom: '2px' }}></i>
            <span>{item.label}</span>
            {active && (
              <span style={{
                position: 'absolute',
                top: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '3px',
                background: 'var(--accent)',
                borderRadius: '2px'
              }} />
            )}
          </Link>
        );
      })}

      {showMore && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 4px)',
          left: '8px',
          right: '8px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          justifyContent: 'center'
        }}>
          {moreItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMore(false)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: active ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '10px',
                  minWidth: '56px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`fas ${item.icon}`} style={{ fontSize: '18px', marginBottom: '2px' }}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default MobileBottomNav;
