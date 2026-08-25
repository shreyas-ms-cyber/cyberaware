export const moduleColors = {
  // Module 1: Password Security
  1: { 
    bg: 'rgba(59, 130, 246, 0.15)', 
    border: 'rgba(59, 130, 246, 0.3)',
    color: '#3B82F6',
    icon: 'fa-key'
  },
  // Module 2: Phishing & Social Engineering
  2: { 
    bg: 'rgba(239, 68, 68, 0.15)', 
    border: 'rgba(239, 68, 68, 0.3)',
    color: '#EF4444',
    icon: 'fa-fish'
  },
  // Module 3: Multi-Factor Authentication
  3: { 
    bg: 'rgba(139, 92, 246, 0.15)', 
    border: 'rgba(139, 92, 246, 0.3)',
    color: '#8B5CF6',
    icon: 'fa-shield-halved'
  },
  // Module 4: Email Security
  4: { 
    bg: 'rgba(251, 146, 60, 0.15)', 
    border: 'rgba(251, 146, 60, 0.3)',
    color: '#FB923C',
    icon: 'fa-envelope'
  },
  // Module 5: Safe Browsing
  5: { 
    bg: 'rgba(52, 211, 153, 0.15)', 
    border: 'rgba(52, 211, 153, 0.3)',
    color: '#34D399',
    icon: 'fa-globe'
  },
  // Module 6: Public Wi-Fi Security
  6: { 
    bg: 'rgba(6, 182, 212, 0.15)', 
    border: 'rgba(6, 182, 212, 0.3)',
    color: '#06B6D4',
    icon: 'fa-wifi'
  },
  // Module 7: Malware & Ransomware
  7: { 
    bg: 'rgba(239, 68, 68, 0.2)', 
    border: 'rgba(239, 68, 68, 0.4)',
    color: '#DC2626',
    icon: 'fa-bug'
  },
  // Module 8: Data Protection
  8: { 
    bg: 'rgba(99, 102, 241, 0.15)', 
    border: 'rgba(99, 102, 241, 0.3)',
    color: '#6366F1',
    icon: 'fa-lock'
  },
  // Module 9: Mobile Security
  9: { 
    bg: 'rgba(168, 85, 247, 0.15)', 
    border: 'rgba(168, 85, 247, 0.3)',
    color: '#A855F7',
    icon: 'fa-mobile-screen-button'
  },
  // Module 10: Incident Reporting
  10: { 
    bg: 'rgba(251, 191, 36, 0.15)', 
    border: 'rgba(251, 191, 36, 0.3)',
    color: '#FBBF24',
    icon: 'fa-triangle-exclamation'
  }
};

export const getModuleColor = (moduleId) => {
  return moduleColors[moduleId] || moduleColors[1];
};
