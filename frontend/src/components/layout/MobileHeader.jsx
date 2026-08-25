import { useNavigate } from 'react-router-dom';

const MobileHeader = ({ showBack = false, title = 'CyberAware' }) => {
  const navigate = useNavigate();

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'rgba(8, 13, 24, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '18px',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              minWidth: '44px',
              minHeight: '44px',
              justifyContent: 'center'
            }}
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-heading)'
        }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: '18px',
          padding: '8px',
          cursor: 'pointer',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className="fas fa-bell"></i>
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
