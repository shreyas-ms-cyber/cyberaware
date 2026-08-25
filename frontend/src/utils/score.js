import { SCORE_BANDS } from './constants';
import { storage } from '../services/storage';

/**
 * Calculate score for a single module
 * @param {number} moduleId - The module ID
 * @param {number} quizScore - Quiz score percentage (0-100)
 * @param {number} scenarioScore - Scenario score percentage (0-100)
 * @returns {number|null} Module score or null if no quiz score
 */
export const calculateModuleScore = (moduleId, quizScore, scenarioScore) => {
  if (quizScore === undefined || quizScore === null) return null;
  
  const quizWeight = 0.6;
  const scenarioWeight = 0.4;
  
  const scenarioScoreValue = scenarioScore || 0;
  const moduleScore = (quizScore * quizWeight) + (scenarioScoreValue * scenarioWeight);
  
  return Math.round(moduleScore);
};

/**
 * Calculate overall awareness score across all modules
 * Average of all attempted module scores
 * @returns {number|null} Overall score or null if no modules attempted
 */
export const calculateOverallScore = () => {
  const quizScores = storage.getQuizScores();
  const scenarioResults = storage.getScenarioResults();
  
  let totalScore = 0;
  let moduleCount = 0;
  
  // Get all unique module IDs from quiz scores
  const moduleIds = Object.keys(quizScores);
  
  if (moduleIds.length === 0) return null;
  
  moduleIds.forEach(moduleId => {
    const quizScore = quizScores[moduleId] || 0;
    
    // Get scenario score for this module
    let scenarioScore = 0;
    const moduleScenarios = scenarioResults[moduleId];
    if (moduleScenarios && typeof moduleScenarios === 'object') {
      // Calculate scenario score as percentage of correct scenarios
      const scenarioEntries = Object.values(moduleScenarios);
      if (scenarioEntries.length > 0) {
        const correctCount = scenarioEntries.filter(v => v === true).length;
        scenarioScore = Math.round((correctCount / scenarioEntries.length) * 100);
      }
    }
    
    const moduleScore = calculateModuleScore(moduleId, quizScore, scenarioScore);
    
    if (moduleScore !== null) {
      totalScore += moduleScore;
      moduleCount++;
    }
  });
  
  if (moduleCount === 0) return null;
  
  return Math.round(totalScore / moduleCount);
};

/**
 * Get score band based on score
 * @param {number} score - Score (0-100)
 * @returns {Object} Score band object with label and color
 */
export const getScoreBand = (score) => {
  if (score >= 71) return SCORE_BANDS.excellent;
  if (score >= 41) return SCORE_BANDS.good;
  return SCORE_BANDS.needsImprovement;
};

/**
 * Get overall score band
 * @returns {Object|null} Score band object or null if no score
 */
export const getOverallScoreBand = () => {
  const score = calculateOverallScore();
  if (score === null) return null;
  return getScoreBand(score);
};

/**
 * Get weak areas (modules with score < 70)
 * @returns {Array} Array of weak areas with moduleId and score
 */
export const getWeakAreas = () => {
  const quizScores = storage.getQuizScores();
  const scenarioResults = storage.getScenarioResults();
  const weakAreas = [];
  
  Object.keys(quizScores).forEach(moduleId => {
    const quizScore = quizScores[moduleId];
    
    // Get scenario score for this module
    let scenarioScore = 0;
    const moduleScenarios = scenarioResults[moduleId];
    if (moduleScenarios && typeof moduleScenarios === 'object') {
      const scenarioEntries = Object.values(moduleScenarios);
      if (scenarioEntries.length > 0) {
        const correctCount = scenarioEntries.filter(v => v === true).length;
        scenarioScore = Math.round((correctCount / scenarioEntries.length) * 100);
      }
    }
    
    const moduleScore = calculateModuleScore(moduleId, quizScore, scenarioScore);
    
    if (moduleScore !== null && moduleScore < 70) {
      weakAreas.push({
        moduleId: parseInt(moduleId),
        score: moduleScore,
        quizScore: quizScore,
        scenarioScore: scenarioScore
      });
    }
  });
  
  return weakAreas.sort((a, b) => a.score - b.score);
};

/**
 * Get strong areas (modules with score >= 70)
 * @returns {Array} Array of strong areas with moduleId and score
 */
export const getStrongAreas = () => {
  const quizScores = storage.getQuizScores();
  const scenarioResults = storage.getScenarioResults();
  const strongAreas = [];
  
  Object.keys(quizScores).forEach(moduleId => {
    const quizScore = quizScores[moduleId];
    
    // Get scenario score for this module
    let scenarioScore = 0;
    const moduleScenarios = scenarioResults[moduleId];
    if (moduleScenarios && typeof moduleScenarios === 'object') {
      const scenarioEntries = Object.values(moduleScenarios);
      if (scenarioEntries.length > 0) {
        const correctCount = scenarioEntries.filter(v => v === true).length;
        scenarioScore = Math.round((correctCount / scenarioEntries.length) * 100);
      }
    }
    
    const moduleScore = calculateModuleScore(moduleId, quizScore, scenarioScore);
    
    if (moduleScore !== null && moduleScore >= 70) {
      strongAreas.push({
        moduleId: parseInt(moduleId),
        score: moduleScore,
        quizScore: quizScore,
        scenarioScore: scenarioScore
      });
    }
  });
  
  return strongAreas.sort((a, b) => b.score - a.score);
};

/**
 * Get recommended next module
 * @returns {number|null} Module ID of recommended module or null if all complete
 */
export const getRecommendedNextModule = () => {
  const completedModules = storage.getCompletedModules();
  const weakAreas = getWeakAreas();
  
  // If there are weak areas, recommend the weakest one
  if (weakAreas.length > 0) {
    return weakAreas[0].moduleId;
  }
  
  // Otherwise find the first uncompleted module
  for (let i = 1; i <= 10; i++) {
    if (!completedModules.includes(i)) {
      return i;
    }
  }
  
  return null; // All modules completed
};

/**
 * Get module performance data for charts
 * @returns {Object} Performance data with labels and scores
 */
export const getModulePerformance = () => {
  const quizScores = storage.getQuizScores();
  const scenarioResults = storage.getScenarioResults();
  const labels = [];
  const scores = [];
  const quizScoresArray = [];
  const scenarioScoresArray = [];
  
  Object.keys(quizScores).forEach(moduleId => {
    const quizScore = quizScores[moduleId];
    
    // Get scenario score for this module
    let scenarioScore = 0;
    const moduleScenarios = scenarioResults[moduleId];
    if (moduleScenarios && typeof moduleScenarios === 'object') {
      const scenarioEntries = Object.values(moduleScenarios);
      if (scenarioEntries.length > 0) {
        const correctCount = scenarioEntries.filter(v => v === true).length;
        scenarioScore = Math.round((correctCount / scenarioEntries.length) * 100);
      }
    }
    
    const moduleScore = calculateModuleScore(moduleId, quizScore, scenarioScore);
    
    labels.push(`Module ${moduleId}`);
    scores.push(moduleScore);
    quizScoresArray.push(quizScore);
    scenarioScoresArray.push(scenarioScore);
  });
  
  return {
    labels,
    scores,
    quizScores: quizScoresArray,
    scenarioScores: scenarioScoresArray,
    average: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  };
};

/**
 * Get detailed stats for dashboard
 * @returns {Object} Comprehensive stats
 */
export const getDashboardStats = () => {
  const completedModules = storage.getCompletedModules();
  const quizScores = storage.getQuizScores();
  const badges = storage.getBadges();
  const activity = storage.getActivity();
  
  const totalModules = 10;
  const completedCount = completedModules.length;
  const totalScore = Object.values(quizScores).reduce((sum, score) => sum + score, 0);
  const avgQuizScore = Object.keys(quizScores).length > 0 
    ? Math.round(totalScore / Object.keys(quizScores).length) 
    : 0;
  
  const overallScore = calculateOverallScore();
  const scoreBand = overallScore !== null ? getScoreBand(overallScore) : null;
  const weakAreas = getWeakAreas();
  const strongAreas = getStrongAreas();
  const recommended = getRecommendedNextModule();
  
  return {
    totalModules,
    completedCount,
    progress: Math.round((completedCount / totalModules) * 100),
    avgQuizScore,
    overallScore,
    scoreBand,
    badgesCount: badges.length,
    activitiesCount: activity.length,
    weakAreas,
    strongAreas,
    recommendedModule: recommended,
    hasStarted: completedCount > 0 || Object.keys(quizScores).length > 0
  };
};
