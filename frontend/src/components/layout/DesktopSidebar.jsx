import { Link, useLocation } from 'react-router-dom';
import CyberBuddyAvatar from '../ui/CyberBuddyAvatar';

const DesktopSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fa-house' },
    { path: '/learn', label: 'Learn', icon: 'fa-graduation-cap' },
    { path: '/scenarios', label: 'Scenarios', icon: 'fa-shield-alt' },
    { path: '/quiz', label: 'Quizzes', icon: 'fa-question-circle' },
    { path: '/progress', label: 'Progress', icon: 'fa-chart-line' },
    { path: '/badges', label: 'Badges', icon: 'fa-trophy' },
    { path: '/ai-coach', label: 'AI Assistant', icon: 'fa-robot' },
    { path: '/certificate', label: 'Certificate', icon: 'fa-certificate' },
    { path: '/about', label: 'About', icon: 'fa-info-circle' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      overflowY: 'auto',
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--accent)',
          fontFamily: 'var(--font-heading)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>CyberAware</span>
          <span style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border)'
          }}>v1.0</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Stay Aware. Stay Secure.
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                background: active ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                marginBottom: '2px',
                position: 'relative',
                fontWeight: active ? 600 : 400
              }}
            >
              <i className={`fas ${item.icon}`} style={{ width: '20px', fontSize: '16px', flexShrink: 0 }}></i>
              <span style={{ fontSize: '14px' }}>{item.label}</span>
              {item.path === '/ai-coach' && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '9px',
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700
                }}>NEW</span>
              )}
              {active && (
                <span style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '24px',
                  background: 'var(--accent)',
                  borderRadius: '2px'
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - CyberBuddy + Tip */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CyberBuddyAvatar size="sm" />
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>CyberBuddy AI</strong>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
              Your security assistant
            </p>
          </div>
        </div>
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          padding: '0 8px',
          lineHeight: 1.5
        }}>
          <i className="fas fa-lightbulb" style={{ color: 'var(--warning)', marginRight: '6px' }}></i>
          Tip: Enable MFA on all accounts
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
