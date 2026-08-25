import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { getDashboardStats, getModulePerformance } from '../utils/score';
import { getUnlockedBadges } from '../utils/badges';
import { MODULES } from '../utils/constants';
import ResetProgress from '../components/common/ResetProgress';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const dashboardStats = getDashboardStats();
    setStats(dashboardStats);
    setUnlockedBadges(getUnlockedBadges());
    setLoading(false);
  };

  const getModuleTitle = (id) => {
    const mod = MODULES.find(m => m.id === id);
    return mod ? mod.title : `Module ${id}`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-accent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // If no progress yet
  if (!stats || !stats.hasStarted) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            <i className="fas fa-chart-line" style={{ color: 'var(--text-secondary)' }}></i>
          </div>
          <h3>No Progress Yet</h3>
          <p className="text-secondary">Start your cybersecurity training to track your progress.</p>
          <Link to="/learn" className="btn btn-lg mt-3" style={{
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}>
            Start Training <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-3 py-3">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="mb-0" style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.25rem',
          color: 'var(--text-primary)'
        }}>
          <i className="fas fa-chart-line me-2" style={{ color: 'var(--accent)' }}></i>
          Progress Dashboard
        </h2>
        <ResetProgress />
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div className="row g-2 mb-4">
        <div className="col-6">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
              {stats.progress}%
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Progress</div>
            <div className="mt-1" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              {stats.completedCount}/{stats.totalModules}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              color: stats.overallScore >= 70 ? 'var(--success)' : 'var(--warning)' 
            }}>
              {stats.overallScore !== null ? `${stats.overallScore}%` : '—'}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Awareness Score</div>
            {stats.scoreBand && (
              <div className="mt-1" style={{ fontSize: '0.65rem', color: stats.scoreBand.color }}>
                {stats.scoreBand.label}
              </div>
            )}
          </div>
        </div>
        <div className="col-6">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)' }}>
              {stats.badgesCount}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Badges</div>
          </div>
        </div>
        <div className="col-6">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              color: stats.avgQuizScore >= 70 ? 'var(--success)' : 'var(--warning)' 
            }}>
              {stats.avgQuizScore}%
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Avg Quiz</div>
          </div>
        </div>
      </div>

      {/* Recommended Next Module */}
      {stats.recommendedModule && (
        <div className="mb-4 p-3 rounded-lg" style={{ 
          background: 'rgba(0, 229, 255, 0.05)',
          border: '1px solid rgba(0, 229, 255, 0.2)'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <i className="fas fa-lightbulb me-1" style={{ color: 'var(--accent)' }}></i>
                Recommended Next
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {getModuleTitle(stats.recommendedModule)}
              </div>
            </div>
            <Link to={`/module/${stats.recommendedModule}`} className="btn btn-sm" style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontWeight: 600,
              border: 'none',
              padding: '6px 14px',
              fontSize: '0.8rem'
            }}>
              Start <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      )}

      {/* Weak Areas */}
      {stats.weakAreas && stats.weakAreas.length > 0 && (
        <div className="mb-3">
          <div className="text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
            <i className="fas fa-exclamation-triangle me-1" style={{ color: 'var(--danger)' }}></i>
            Areas to Improve
          </div>
          <div className="d-flex flex-wrap gap-1">
            {stats.weakAreas.map(area => (
              <Link key={area.moduleId} to={`/module/${area.moduleId}`} className="text-decoration-none">
                <span className="px-2 py-1 rounded-sm" style={{
                  background: 'rgba(255, 59, 92, 0.1)',
                  border: '1px solid rgba(255, 59, 92, 0.2)',
                  color: 'var(--danger)',
                  fontSize: '0.7rem',
                  display: 'inline-block'
                }}>
                  {getModuleTitle(area.moduleId)} - {area.score}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Strong Areas */}
      {stats.strongAreas && stats.strongAreas.length > 0 && (
        <div className="mb-3">
          <div className="text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
            <i className="fas fa-star me-1" style={{ color: 'var(--success)' }}></i>
            Strong Areas
          </div>
          <div className="d-flex flex-wrap gap-1">
            {stats.strongAreas.map(area => (
              <span key={area.moduleId} className="px-2 py-1 rounded-sm" style={{
                background: 'rgba(0, 210, 106, 0.1)',
                border: '1px solid rgba(0, 210, 106, 0.2)',
                color: 'var(--success)',
                fontSize: '0.7rem',
                display: 'inline-block'
              }}>
                {getModuleTitle(area.moduleId)} - {area.score}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {unlockedBadges.length > 0 && (
        <div className="mb-3">
          <div className="text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
            <i className="fas fa-trophy me-1" style={{ color: 'var(--warning)' }}></i>
            Your Badges ({unlockedBadges.length})
          </div>
          <div className="d-flex flex-wrap gap-1">
            {unlockedBadges.map(badge => (
              <div key={badge.id} className="d-flex align-items-center gap-1 px-2 py-1 rounded-sm" style={{
                background: 'rgba(255, 200, 87, 0.1)',
                border: '1px solid rgba(255, 200, 87, 0.2)',
                fontSize: '0.7rem'
              }}>
                <i className={`fas ${badge.icon}`} style={{ color: 'var(--warning)', fontSize: '0.7rem' }}></i>
                <span style={{ color: 'var(--text-primary)' }}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module Progress List */}
      <div className="mt-4">
        <div className="text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
          <i className="fas fa-list me-1"></i>
          Module Progress
        </div>
        {MODULES.map(module => {
          const quizScores = storage.getQuizScores();
          const score = quizScores[module.id];
          const isCompleted = storage.isModuleComplete(module.id);
          
          return (
            <Link key={module.id} to={`/module/${module.id}`} className="text-decoration-none">
              <div className="p-2 mb-1 rounded-sm d-flex justify-content-between align-items-center" style={{
                background: 'var(--surface)',
                border: isCompleted ? '1px solid rgba(0, 210, 106, 0.3)' : '1px solid var(--border)'
              }}>
                <div className="d-flex align-items-center gap-2">
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCompleted ? 'rgba(0, 210, 106, 0.2)' : 'rgba(0, 229, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted ? 'var(--success)' : 'var(--accent)',
                    fontSize: '0.7rem'
                  }}>
                    <i className={`fas ${module.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                      {module.title}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                      Module {module.id}
                    </div>
                  </div>
                </div>
                <div>
                  {score !== null && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: score >= 70 ? 'var(--success)' : 'var(--warning)',
                      fontWeight: 600
                    }}>
                      {score}%
                    </span>
                  )}
                  {isCompleted && score === null && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                  {!isCompleted && score === null && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                      Not started
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;
