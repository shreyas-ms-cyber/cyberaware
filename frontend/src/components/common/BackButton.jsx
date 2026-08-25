import { useNavigate } from 'react-router-dom';

const BackButton = ({ fallbackPath = '/' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if there's a valid previous entry in history
    // window.history.state is null when there's no history entry
    // or when the user landed directly on the page
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      // Fall back to home if no history exists
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: 500,
        padding: '8px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: '44px', // Mobile touch target
        minWidth: '44px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'transparent';
      }}
      aria-label="Go back"
    >
      <i className="fas fa-chevron-left" style={{ fontSize: '14px' }}></i>
      <span style={{ fontSize: '13px' }}>Back</span>
    </button>
  );
};

export default BackButton;
