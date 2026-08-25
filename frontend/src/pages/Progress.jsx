import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { getDashboardStats } from '../utils/score';
import { getUnlockedBadges } from '../utils/badges';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const dashboardStats = getDashboardStats();
      setStats(dashboardStats);
      setUnlockedBadges(getUnlockedBadges());
      
      // Fetch all modules from API
      const response = await api.getModules(200, 0);
      if (response.success) {
        setModules(response.data);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div className="spinner-border text-accent" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stats || !stats.hasStarted) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            <i className="fas fa-chart-line" style={{ color: 'var(--color-text-secondary)' }}></i>
          </div>
          <h3>No Progress Yet</h3>
          <p className="text-secondary">Start your cybersecurity training to track your progress.</p>
          <Link to="/learn" className="btn btn-lg mt-3" style={{
            background: 'var(--color-accent)',
            color: 'var(--color-bg-primary)',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}>
            Start Training <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    );
  }

  const totalModules = modules.length || 0;

  return (
    <div className="container px-3 py-3" style={{ width: '100%', maxWidth: '100%' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0" style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '1.25rem',
          color: 'var(--color-text-primary)'
        }}>
          <i className="fas fa-chart-line me-2" style={{ color: 'var(--color-accent)' }}></i>
          Progress Dashboard
        </h2>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-6">
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--color-bg-surface)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              {stats.progress}%
            </div>
            <div className="text-secondary" style={{ fontSize: '0.65rem' }}>Progress</div>
            <div className="mt-1" style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
              {stats.completedCount}/{totalModules}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--color-bg-surface)' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: stats.overallScore >= 70 ? 'var(--success)' : 'var(--warning)' 
            }}>
              {stats.overallScore !== null ? `${stats.overallScore}%` : '—'}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.65rem' }}>Awareness Score</div>
            {stats.scoreBand && (
              <div className="mt-1" style={{ fontSize: '0.55rem', color: stats.scoreBand.color }}>
                {stats.scoreBand.label}
              </div>
            )}
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--color-bg-surface)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>
              {stats.badgesCount}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.65rem' }}>Badges</div>
          </div>
        </div>
        <div className="col-6">
          <div className="p-2 rounded-lg text-center" style={{ background: 'var(--color-bg-surface)' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: stats.avgQuizScore >= 70 ? 'var(--success)' : 'var(--warning)' 
            }}>
              {stats.avgQuizScore}%
            </div>
            <div className="text-secondary" style={{ fontSize: '0.65rem' }}>Avg Quiz</div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-secondary mb-1" style={{ fontSize: '0.7rem' }}>
          <i className="fas fa-list me-1"></i>
          Module Progress ({totalModules} total)
        </div>
        {modules.map(module => {
          const quizScores = storage.getQuizScores();
          const score = quizScores[module.id] || 0;
          const isCompleted = storage.isModuleComplete(module.id);
          
          return (
            <Link key={module.id} to={`/module/${module.id}`} className="text-decoration-none">
              <div className="p-2 mb-1 rounded-sm d-flex justify-content-between align-items-center" style={{
                background: 'var(--color-bg-surface)',
                border: isCompleted ? '1px solid rgba(0, 210, 106, 0.3)' : '1px solid var(--color-border)'
              }}>
                <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCompleted ? 'rgba(0, 210, 106, 0.2)' : 'rgba(0, 229, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted ? 'var(--success)' : 'var(--color-accent)',
                    fontSize: '0.6rem',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {module.title}
                    </div>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {score > 0 && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: score >= 70 ? 'var(--success)' : 'var(--warning)',
                      fontWeight: 600
                    }}>
                      {score}%
                    </span>
                  )}
                  {isCompleted && score === 0 && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--success)' }}>
                      <i className="fas fa-check-circle"></i>
                    </span>
                  )}
                  {!isCompleted && score === 0 && (
                    <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
                      Start
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
