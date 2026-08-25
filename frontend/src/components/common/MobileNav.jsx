import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const MobileNav = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef(null);
  
  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-house' },
    { path: '/learn', label: 'Learn', icon: 'fa-graduation-cap' },
    { path: '/quiz', label: 'Quiz', icon: 'fa-question-circle' },
    { path: '/ai-coach', label: 'AI', icon: 'fa-robot' },
    { path: '/more', label: 'More', icon: 'fa-ellipsis-h' },
  ];

  const moreItems = [
    { path: '/scenarios', label: 'Scenarios', icon: 'fa-shield-alt' },
    { path: '/progress', label: 'Progress', icon: 'fa-chart-line' },
    { path: '/badges', label: 'Badges', icon: 'fa-trophy' },
    { path: '/certificate', label: 'Certificate', icon: 'fa-certificate' },
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

  const toggleMore = () => {
    setShowMore(!showMore);
  };

  const isMoreActive = location.pathname === '/more' || 
    moreItems.some(item => location.pathname === item.path);

  return (
    <nav className="d-md-none" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(8, 13, 24, 0.98)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      padding: '8px 0',
      zIndex: 1000
    }} ref={moreRef}>
      
      {showMore && (
        <>
          <div 
            onClick={() => setShowMore(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 999,
              animation: 'fadeIn 0.2s ease'
            }}
          />
          
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '12px 0',
            zIndex: 1000,
            borderRadius: '16px 16px 0 0',
            animation: 'slideUp 0.3s ease',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              padding: '0 8px'
            }}>
              {moreItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(0, 229, 255, 0.15)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: '16px'
                    }}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400 }}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>
                        <i className="fas fa-check-circle"></i>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="d-flex justify-content-around align-items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/more' && isMoreActive);
          return (
            <div key={item.path} onClick={() => {
              if (item.path === '/more') {
                toggleMore();
              } else {
                setShowMore(false);
              }
            }}>
              {item.path === '/more' ? (
                <div
                  className="d-flex flex-column align-items-center text-decoration-none"
                  style={{
                    color: isActive || showMore ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.6rem',
                    padding: '4px 4px',
                    minWidth: '44px',
                    minHeight: '44px',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <i className={`fas ${item.icon}`} style={{ fontSize: '1.2rem', marginBottom: '2px' }}></i>
                  <span style={{ fontSize: '0.5rem' }}>{item.label}</span>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="d-flex flex-column align-items-center text-decoration-none"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.6rem',
                    padding: '4px 4px',
                    minWidth: '44px',
                    minHeight: '44px',
                    justifyContent: 'center'
                  }}
                >
                  <i className={`fas ${item.icon}`} style={{ fontSize: '1.2rem', marginBottom: '2px' }}></i>
                  <span style={{ fontSize: '0.5rem' }}>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
};

export default MobileNav;
