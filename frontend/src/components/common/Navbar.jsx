import { Link, useLocation } from 'react-router-dom';
import BackButton from './BackButton';

const Navbar = ({ showBackButton = false }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fa-house' },
    { path: '/learn', label: 'Learn', icon: 'fa-graduation-cap' },
    { path: '/scenarios', label: 'Scenarios', icon: 'fa-shield-alt' },
    { path: '/quiz', label: 'Quizzes', icon: 'fa-question-circle' },
    { path: '/ai-quiz', label: 'AI Quiz', icon: 'fa-magic' },
    { path: '/progress', label: 'Progress', icon: 'fa-chart-line' },
    { path: '/badges', label: 'Badges', icon: 'fa-trophy' },
    { path: '/ai-coach', label: 'AI Coach', icon: 'fa-robot' },
    { path: '/certificate', label: 'Certificate', icon: 'fa-certificate' },
    { path: '/about', label: 'About', icon: 'fa-info-circle' },
  ];

  const isBackButtonPage = showBackButton;

  return (
    <nav className="navbar navbar-expand-lg" style={{ 
      background: 'rgba(8, 13, 24, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0.75rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center gap-3">
          {isBackButtonPage ? (
            <BackButton fallbackPath="/" />
          ) : (
            <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: 'var(--color-text-primary)' }}>
              <span style={{ 
                color: 'var(--color-accent)',
                fontWeight: 800,
                fontSize: '1.5rem',
                fontFamily: 'var(--font-family-heading)'
              }}>
                CyberAware
              </span>
              <span style={{ 
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                marginLeft: '0.5rem',
                padding: '2px 8px',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                background: 'var(--color-bg-surface)'
              }}>
                v1.0
              </span>
            </Link>
          )}
        </div>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style={{ color: 'var(--color-text-primary)' }}>
          <i className="fas fa-bars" style={{ fontSize: '1.25rem' }}></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link px-3 py-2 rounded-sm ${
                      isActive ? 'active' : ''
                    }`}
                    style={{
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      fontWeight: isActive ? '600' : '400',
                      background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <i className={`fas ${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
