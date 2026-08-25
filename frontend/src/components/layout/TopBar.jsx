import { useLocation } from 'react-router-dom';
import CyberBuddyAvatar from '../common/CyberBuddyAvatar';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const location = useLocation();

  const getGreeting = () => {
    const path = location.pathname;
    if (path === '/') return 'Welcome back, Stay smart. Stay secure. 👋';
    if (path === '/learn') return 'Continue your learning journey 📚';
    if (path === '/scenarios') return 'Practice real-world scenarios 🛡️';
    if (path === '/quiz') return 'Test your knowledge ❓';
    if (path === '/progress') return 'Track your progress 📊';
    if (path === '/badges') return 'Your achievements 🏆';
    if (path === '/certificate') return 'Earn your certificate 📜';
    if (path === '/ai-coach') return 'Chat with CyberBuddy 🤖';
    if (path === '/about') return 'About CyberAware ℹ️';
    return 'Stay smart. Stay secure. 👋';
  };

  return (
    <header style={{
      padding: '16px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(8, 13, 24, 0.8)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left: Greeting */}
      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#F8FAFC'
        }}>
          {getGreeting()}
        </div>
      </div>

      {/* Center: Search (hidden for now) */}
      <div style={{
        flex: 1,
        maxWidth: '400px',
        margin: '0 24px',
        display: 'none'
      }}>
        {/* Search bar placeholder */}
      </div>

      {/* Right: Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Dark mode toggle (placeholder) */}
        <button style={{
          background: 'none',
          border: 'none',
          color: '#64748B',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px',
          minWidth: '36px',
          minHeight: '36px'
        }}>
          <i className="fas fa-moon"></i>
        </button>

        {/* CyberBuddy AI Pill */}
        <Link to="/ai-coach" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px 6px 10px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          textDecoration: 'none',
          transition: 'all 0.15s ease'
        }}>
          <CyberBuddyAvatar size="small" glow={false} />
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#94A3B8'
          }}>
            CyberBuddy AI
          </span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
