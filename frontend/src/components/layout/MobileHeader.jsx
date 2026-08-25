import { useNavigate } from 'react-router-dom';

const MobileHeader = ({ showBack = false, title = 'CyberAware' }) => {
  const navigate = useNavigate();

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'rgba(8, 13, 24, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
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
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-family-heading)',
            lineHeight: 1.2
          }}>
            {title === 'CyberAware' ? 'CyberAware' : title}
          </div>
          {title === 'CyberAware' && (
            <div style={{
              fontSize: '9px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.2,
              marginTop: -2
            }}>
              Stay Aware. Stay Secure.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-secondary)',
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
