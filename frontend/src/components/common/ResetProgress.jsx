import { useState } from 'react';
import { storage } from '../../services/storage';

const ResetProgress = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      storage.clearAll();
      setIsResetting(false);
      setShowConfirm(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="btn btn-sm"
        style={{
          background: 'rgba(255, 59, 92, 0.1)',
          color: 'var(--danger)',
          border: '1px solid rgba(255, 59, 92, 0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          padding: '4px 12px'
        }}
      >
        <i className="fas fa-trash me-1"></i>
        Reset
      </button>

      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
             style={{ 
               background: 'rgba(0, 0, 0, 0.7)',
               zIndex: 9999,
               backdropFilter: 'blur(4px)'
             }}
             onClick={() => !isResetting && setShowConfirm(false)}>
          <div className="p-4 rounded-lg" 
               style={{ 
                 background: 'var(--surface)',
                 maxWidth: '400px',
                 width: '100%'
               }}
               onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i>
              </div>
              <h5 style={{ color: 'var(--text-primary)' }}>Reset All Progress?</h5>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                This will delete all your training progress, quiz scores, badges, and activity history. 
                This action cannot be undone.
              </p>
            </div>
            <div className="d-flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn flex-grow-1"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: 'none'
                }}
                disabled={isResetting}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="btn flex-grow-1"
                style={{
                  background: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600
                }}
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash me-2"></i>
                    Reset All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetProgress;
