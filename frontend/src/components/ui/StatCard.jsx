const StatCard = ({ label, value, sublabel, color = 'var(--accent)', icon, trend }) => {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      border: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {icon && <i className={`fas ${icon}`} style={{ color: color, fontSize: '16px' }} />}
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: color }}>{value}</div>
      {sublabel && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sublabel}</div>}
      {trend && (
        <div style={{ fontSize: '11px', color: trend > 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px' }}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
};

export default StatCard;
