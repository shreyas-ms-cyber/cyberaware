const ProgressBar = ({ value, max = 100, label, color = 'var(--accent)', size = 'md', showLabel = true }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const heights = { sm: 4, md: 6, lg: 8 };
  const height = heights[size] || 6;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {showLabel && label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div style={{
        height: height,
        background: 'var(--bg-secondary)',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '3px',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
          {percentage > 0 && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '20px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2))',
              borderRadius: '3px'
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
