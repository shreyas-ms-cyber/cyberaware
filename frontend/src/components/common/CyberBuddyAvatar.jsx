import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CyberBuddyAvatar = ({ size = 'medium', glow = true, onClick, className = '' }) => {
  const avatarRef = useRef(null);

  const sizes = {
    small: { container: 48, icon: 20, glow: 30 },
    medium: { container: 80, icon: 36, glow: 50 },
    large: { container: 120, icon: 56, glow: 70 }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <motion.div
      ref={avatarRef}
      onClick={onClick}
      className={className}
      style={{
        width: currentSize.container,
        height: currentSize.container,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #A855F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        margin: '0 auto',
        boxShadow: glow ? `0 0 ${currentSize.glow}px rgba(59, 130, 246, 0.3), 0 0 ${currentSize.glow * 1.5}px rgba(139, 92, 246, 0.15)` : 'none'
      }}
      animate={{
        scale: [1, 1.03, 1],
        boxShadow: glow ? [
          `0 0 ${currentSize.glow}px rgba(59, 130, 246, 0.3), 0 0 ${currentSize.glow * 1.5}px rgba(139, 92, 246, 0.15)`,
          `0 0 ${currentSize.glow * 1.5}px rgba(59, 130, 246, 0.4), 0 0 ${currentSize.glow * 2}px rgba(139, 92, 246, 0.25)`,
          `0 0 ${currentSize.glow}px rgba(59, 130, 246, 0.3), 0 0 ${currentSize.glow * 1.5}px rgba(139, 92, 246, 0.15)`
        ] : 'none'
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Inner glow */}
      <div style={{
        position: 'absolute',
        inset: '4px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      {/* Sparkle effects */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1.2, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1.2, 0.5]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Robot icon */}
      <i className="fas fa-robot" style={{
        fontSize: currentSize.icon,
        color: 'white',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1
      }} />
    </motion.div>
  );
};

export default CyberBuddyAvatar;
