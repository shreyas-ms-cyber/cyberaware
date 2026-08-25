const ProgressBar = ({ value, max = 100, label, color = 'var(--color-accent)', size = 'md', showLabel = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const heights = { sm: 3, md: 5, lg: 7 };
  const height = heights[size] || 5;

  const colorMap = {
    cyan: 'var(--color-accent)',
    green: 'var(--color-green)',
    amber: 'var(--color-amber)',
    purple: 'var(--color-purple)',
    orange: 'var(--color-orange)',
    red: 'var(--color-red)',
  };

  const actualColor = colorMap[color] || color || 'var(--color-accent)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {showLabel && label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          fontWeight: 500
        }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
            {label}
          </span>
          <span style={{ fontWeight: 600, color: percentage >= 70 ? 'var(--color-green)' : 'var(--color-amber)' }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div style={{
        height: height,
        background: 'var(--color-bg-secondary)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: actualColor,
          borderRadius: '2px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
          {percentage > 0 && percentage < 100 && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '16px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))',
              borderRadius: '2px'
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
