const CyberBuddyAvatar = ({ size = 'md', animated = true }) => {
  const sizes = { sm: 44, md: 64, lg: 96, xl: 128 };
  const px = sizes[size] || 64;

  return (
    <div style={{
      width: px,
      height: px,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #00E5FF, #7B61FF)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 ${px * 0.4}px rgba(0, 229, 255, 0.15), 0 0 ${px * 0.8}px rgba(123, 97, 255, 0.1)`,
      position: 'relative',
      flexShrink: 0
    }}>
      <div style={{
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px * 0.3,
        color: 'white',
      }}>
        <i className="fas fa-robot"></i>
      </div>
      <div style={{
        position: 'absolute',
        inset: '-3px',
        borderRadius: '50%',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        animation: animated ? 'breatheGlow 2.5s ease-in-out infinite' : 'none',
      }} />
      <div style={{
        position: 'absolute',
        inset: '-8px',
        borderRadius: '50%',
        border: '1px solid rgba(123, 97, 255, 0.06)',
        animation: animated ? 'breatheGlow 3s ease-in-out infinite 0.5s' : 'none',
      }} />
    </div>
  );
};

export default CyberBuddyAvatar;
