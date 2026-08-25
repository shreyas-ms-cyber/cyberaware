export const MODULES = [
  { id: 1, title: 'Password Security', icon: 'fa-key' },
  { id: 2, title: 'Phishing & Social Engineering', icon: 'fa-fish' },
  { id: 3, title: 'Multi-Factor Authentication', icon: 'fa-shield-halved' },
  { id: 4, title: 'Email Security', icon: 'fa-envelope' },
  { id: 5, title: 'Safe Browsing', icon: 'fa-globe' },
  { id: 6, title: 'Public Wi-Fi Security', icon: 'fa-wifi' },
  { id: 7, title: 'Malware & Ransomware', icon: 'fa-bug' },
  { id: 8, title: 'Data Protection', icon: 'fa-lock' },
  { id: 9, title: 'Mobile Security', icon: 'fa-mobile-screen-button' },
  { id: 10, title: 'Incident Reporting', icon: 'fa-triangle-exclamation' }
];

export const DIFFICULTY_LEVELS = {
  beginner: { label: 'Beginner', color: '#00D26A' },
  intermediate: { label: 'Intermediate', color: '#FFC857' },
  advanced: { label: 'Advanced', color: '#FF3B5C' }
};

export const SCORE_BANDS = {
  excellent: { min: 71, label: 'Excellent', color: '#00D26A' },
  good: { min: 41, label: 'Good', color: '#FFC857' },
  needsImprovement: { min: 0, label: 'Needs Improvement', color: '#FF3B5C' }
};

export const BADGES = [
  // Existing badges
  { id: 'first_training', label: 'First Training', icon: 'fa-star', description: 'Complete your first training module' },
  { id: 'phishing_defender', label: 'Phishing Defender', icon: 'fa-shield', description: 'Complete Phishing & Social Engineering module' },
  { id: 'password_pro', label: 'Password Pro', icon: 'fa-key', description: 'Complete Password Security module' },
  { id: 'safe_browser', label: 'Safe Browser', icon: 'fa-globe', description: 'Complete Safe Browsing module' },
  { id: 'cyber_guardian', label: 'Cyber Guardian', icon: 'fa-crown', description: 'Complete all 10 modules' },
  { id: 'perfect_score', label: 'Perfect Score', icon: 'fa-medal', description: 'Get 100% on any quiz' },
  
  // New badges
  { id: 'quiz_master', label: 'Quiz Master', icon: 'fa-brain', description: 'Complete 10 quizzes' },
  { id: 'scenario_solver', label: 'Scenario Solver', icon: 'fa-puzzle-piece', description: 'Complete all scenario modules' },
  { id: 'streak_keeper', label: 'Streak Keeper', icon: 'fa-fire', description: 'Log in 5 days in a row' },
  { id: 'mfa_champion', label: 'MFA Champion', icon: 'fa-shield-halved', description: 'Complete Multi-Factor Authentication module' },
  { id: 'social_engineer_spotter', label: 'Social Engineer Spotter', icon: 'fa-eye', description: 'Score 100% on a phishing scenario' },
  { id: 'cyber_veteran', label: 'Cyber Veteran', icon: 'fa-award', description: 'Unlock all other badges' }
];

export const SUGGESTED_PROMPTS = [
  'How do I identify phishing?',
  'Explain MFA.',
  'What should I do after clicking a suspicious link?',
  'Give me a phishing example.',
  'How to create a strong password?',
  'What is social engineering?'
];
