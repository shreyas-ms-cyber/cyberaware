import { BADGES } from './constants';
import { storage } from '../services/storage';

export const checkBadges = () => {
  const unlockedBadges = storage.getBadges();
  const completedModules = storage.getCompletedModules();
  const quizScores = storage.getQuizScores();
  const scenarioResults = storage.getScenarioResults();
  const activity = storage.getActivity();
  const newBadges = [];
  
  // First Training
  if (completedModules.length > 0 && !unlockedBadges.includes('first_training')) {
    newBadges.push('first_training');
    storage.addActivity({ type: 'badge_unlocked', badge: 'First Training' });
  }
  
  // Phishing Defender
  if (completedModules.includes(2) && !unlockedBadges.includes('phishing_defender')) {
    newBadges.push('phishing_defender');
    storage.addActivity({ type: 'badge_unlocked', badge: 'Phishing Defender' });
  }
  
  // Password Pro
  if (completedModules.includes(1) && !unlockedBadges.includes('password_pro')) {
    newBadges.push('password_pro');
    storage.addActivity({ type: 'badge_unlocked', badge: 'Password Pro' });
  }
  
  // Safe Browser
  if (completedModules.includes(5) && !unlockedBadges.includes('safe_browser')) {
    newBadges.push('safe_browser');
    storage.addActivity({ type: 'badge_unlocked', badge: 'Safe Browser' });
  }
  
  // Cyber Guardian
  if (completedModules.length >= 10 && !unlockedBadges.includes('cyber_guardian')) {
    newBadges.push('cyber_guardian');
    storage.addActivity({ type: 'badge_unlocked', badge: 'Cyber Guardian' });
  }
  
  // Perfect Score
  if (!unlockedBadges.includes('perfect_score')) {
    const hasPerfectScore = Object.values(quizScores).some(score => score === 100);
    if (hasPerfectScore) {
      newBadges.push('perfect_score');
      storage.addActivity({ type: 'badge_unlocked', badge: 'Perfect Score' });
    }
  }
  
  // Quiz Master
  if (Object.keys(quizScores).length >= 10 && !unlockedBadges.includes('quiz_master')) {
    newBadges.push('quiz_master');
    storage.addActivity({ type: 'badge_unlocked', badge: 'Quiz Master' });
  }
  
  // Scenario Solver
  const scenarioModules = Object.keys(scenarioResults);
  if (scenarioModules.length >= 3 && !unlockedBadges.includes('scenario_solver')) {
    newBadges.push('scenario_solver');
    storage.addActivity({ type: 'badge_unlocked', badge: 'Scenario Solver' });
  }
  
  // Streak Keeper
  if (!unlockedBadges.includes('streak_keeper')) {
    const dates = activity.map(a => new Date(a.timestamp).toDateString());
    const uniqueDates = [...new Set(dates)];
    if (uniqueDates.length >= 5) {
      newBadges.push('streak_keeper');
      storage.addActivity({ type: 'badge_unlocked', badge: 'Streak Keeper' });
    }
  }
  
  // MFA Champion
  if (completedModules.includes(3) && !unlockedBadges.includes('mfa_champion')) {
    newBadges.push('mfa_champion');
    storage.addActivity({ type: 'badge_unlocked', badge: 'MFA Champion' });
  }
  
  // Social Engineer Spotter
  if (!unlockedBadges.includes('social_engineer_spotter')) {
    const hasPerfectScenario = Object.values(scenarioResults).some(
      moduleResults => Object.values(moduleResults).every(result => result === true)
    );
    if (hasPerfectScenario) {
      newBadges.push('social_engineer_spotter');
      storage.addActivity({ type: 'badge_unlocked', badge: 'Social Engineer Spotter' });
    }
  }
  
  // Cyber Veteran
  const allBadges = BADGES.map(b => b.id);
  const allOtherBadges = allBadges.filter(id => id !== 'cyber_veteran');
  if (!unlockedBadges.includes('cyber_veteran')) {
    const allUnlocked = allOtherBadges.every(id => unlockedBadges.includes(id) || newBadges.includes(id));
    if (allUnlocked) {
      newBadges.push('cyber_veteran');
      storage.addActivity({ type: 'badge_unlocked', badge: 'Cyber Veteran' });
    }
  }
  
  newBadges.forEach(badgeId => {
    storage.unlockBadge(badgeId);
  });
  
  return newBadges;
};

export const getBadgeDetails = (badgeId) => {
  return BADGES.find(b => b.id === badgeId);
};

export const getUnlockedBadges = () => {
  const unlocked = storage.getBadges();
  return unlocked.map(id => getBadgeDetails(id)).filter(Boolean);
};

export const getLockedBadges = () => {
  const unlocked = storage.getBadges();
  return BADGES.filter(b => !unlocked.includes(b.id));
};

export const getBadgeProgress = () => {
  const completedModules = storage.getCompletedModules();
  const quizScores = storage.getQuizScores();
  const scenarioResults = storage.getScenarioResults();
  const activity = storage.getActivity();
  
  return {
    first_training: completedModules.length > 0,
    phishing_defender: completedModules.includes(2),
    password_pro: completedModules.includes(1),
    safe_browser: completedModules.includes(5),
    cyber_guardian: completedModules.length >= 10,
    perfect_score: Object.values(quizScores).some(score => score === 100),
    quiz_master: Object.keys(quizScores).length >= 10,
    scenario_solver: Object.keys(scenarioResults).length >= 3,
    streak_keeper: new Set(activity.map(a => new Date(a.timestamp).toDateString())).size >= 5,
    mfa_champion: completedModules.includes(3),
    social_engineer_spotter: Object.values(scenarioResults).some(
      moduleResults => Object.values(moduleResults).every(result => result === true)
    ),
    cyber_veteran: false
  };
};

export const checkAndUnlockBadges = () => {
  const newBadges = checkBadges();
  return newBadges;
};
