const STORAGE_KEYS = {
  PROGRESS: 'cyberaware_progress',
  QUIZ_SCORES: 'cyberaware_quiz_scores',
  COMPLETED_MODULES: 'cyberaware_completed_modules',
  BADGES: 'cyberaware_badges',
  SCENARIOS: 'cyberaware_scenarios',
  ACTIVITY: 'cyberaware_activity'
};

/**
 * Storage service using localStorage
 * Each user gets their own isolated storage based on their browser/device
 * No login required - data is stored locally on the user's device
 */
export const storage = {
  // Get data from localStorage
  get: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  // Set data in localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Error writing ${key} to localStorage:`, e);
      return false;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Error removing ${key} from localStorage:`, e);
      return false;
    }
  },

  // Check if user has any data
  hasData: () => {
    try {
      return Object.values(STORAGE_KEYS).some(key => {
        const data = localStorage.getItem(key);
        return data !== null && data !== 'null' && data !== '[]' && data !== '{}';
      });
    } catch (e) {
      return false;
    }
  },

  // Clear all CyberAware data for this user
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
      return false;
    }
  },

  // Get user's unique ID (based on browser fingerprint)
  getUserId: () => {
    try {
      // Check if we already have a user ID
      let userId = localStorage.getItem('cyberaware_user_id');
      if (!userId) {
        // Generate a unique ID for this browser/device
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('cyberaware_user_id', userId);
      }
      return userId;
    } catch (e) {
      return 'anonymous_' + Date.now();
    }
  },

  // --- Progress specific methods ---

  getProgress: () => {
    return storage.get(STORAGE_KEYS.PROGRESS, {});
  },

  saveProgress: (progress) => {
    return storage.set(STORAGE_KEYS.PROGRESS, progress);
  },

  // --- Quiz scores ---

  getQuizScores: () => {
    return storage.get(STORAGE_KEYS.QUIZ_SCORES, {});
  },

  saveQuizScore: (moduleId, score) => {
    const scores = storage.getQuizScores();
    scores[moduleId] = score;
    return storage.set(STORAGE_KEYS.QUIZ_SCORES, scores);
  },

  getQuizScore: (moduleId) => {
    const scores = storage.getQuizScores();
    return scores[moduleId] || null;
  },

  // --- Completed modules ---

  getCompletedModules: () => {
    return storage.get(STORAGE_KEYS.COMPLETED_MODULES, []);
  },

  markModuleComplete: (moduleId) => {
    const completed = storage.getCompletedModules();
    if (!completed.includes(moduleId)) {
      completed.push(moduleId);
      storage.set(STORAGE_KEYS.COMPLETED_MODULES, completed);
      return true;
    }
    return false;
  },

  isModuleComplete: (moduleId) => {
    const completed = storage.getCompletedModules();
    return completed.includes(moduleId);
  },

  getCompletedCount: () => {
    return storage.getCompletedModules().length;
  },

  // --- Badges ---

  getBadges: () => {
    return storage.get(STORAGE_KEYS.BADGES, []);
  },

  unlockBadge: (badgeId) => {
    const badges = storage.getBadges();
    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      storage.set(STORAGE_KEYS.BADGES, badges);
      return true;
    }
    return false;
  },

  hasBadge: (badgeId) => {
    const badges = storage.getBadges();
    return badges.includes(badgeId);
  },

  // --- Scenarios ---

  getScenarioResults: () => {
    return storage.get(STORAGE_KEYS.SCENARIOS, {});
  },

  saveScenarioResult: (moduleId, results) => {
    const allResults = storage.getScenarioResults();
    allResults[moduleId] = results;
    return storage.set(STORAGE_KEYS.SCENARIOS, allResults);
  },

  getScenarioResult: (moduleId) => {
    const results = storage.getScenarioResults();
    return results[moduleId] || null;
  },

  // --- Activity log ---

  getActivity: () => {
    return storage.get(STORAGE_KEYS.ACTIVITY, []);
  },

  addActivity: (activity) => {
    const activities = storage.getActivity();
    activities.unshift({
      ...activity,
      timestamp: new Date().toISOString(),
      userId: storage.getUserId()
    });
    // Keep only last 50 activities
    if (activities.length > 50) {
      activities.length = 50;
    }
    return storage.set(STORAGE_KEYS.ACTIVITY, activities);
  },

  clearActivity: () => {
    return storage.set(STORAGE_KEYS.ACTIVITY, []);
  },

  // --- Stats ---

  getStats: () => {
    const completed = storage.getCompletedModules();
    const scores = storage.getQuizScores();
    const badges = storage.getBadges();
    const activity = storage.getActivity();
    
    const totalModules = 10;
    const completedCount = completed.length;
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const avgScore = Object.keys(scores).length > 0 
      ? Math.round(totalScore / Object.keys(scores).length) 
      : 0;
    
    return {
      totalModules,
      completedCount,
      progress: Math.round((completedCount / totalModules) * 100),
      avgScore,
      badgesCount: badges.length,
      activitiesCount: activity.length,
      hasStarted: completedCount > 0 || Object.keys(scores).length > 0
    };
  }
};
