const StatCard = ({ label, value, sublabel, color = 'var(--color-accent)', icon, trend }) => {
  const colorMap = {
    cyan: 'var(--color-accent)',
    green: 'var(--color-green)',
    amber: 'var(--color-amber)',
    purple: 'var(--color-purple)',
    orange: 'var(--color-orange)',
    red: 'var(--color-red)',
  };

  const bgColorMap = {
    cyan: 'rgba(0, 229, 255, 0.12)',
    green: 'rgba(0, 210, 106, 0.12)',
    amber: 'rgba(255, 200, 87, 0.12)',
    purple: 'rgba(123, 97, 255, 0.12)',
    orange: 'rgba(255, 138, 76, 0.12)',
    red: 'rgba(255, 59, 92, 0.12)',
  };

  const actualColor = colorMap[color] || color || 'var(--color-accent)';
  const actualBg = bgColorMap[color] || 'rgba(0, 229, 255, 0.12)';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      width: '100%',
      minHeight: '80px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        background: actualBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: '16px',
        color: actualColor
      }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
          {value}
        </div>
        {sublabel && (
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: actualColor }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
