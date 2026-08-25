import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { getUnlockedBadges, getLockedBadges, getBadgeProgress } from '../utils/badges';
import { BADGES } from '../utils/constants';

const Badges = () => {
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [lockedBadges, setLockedBadges] = useState([]);
  const [badgeProgress, setBadgeProgress] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    progress: 0
  });

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = () => {
    const unlocked = getUnlockedBadges();
    const locked = getLockedBadges();
    const progress = getBadgeProgress();
    
    setUnlockedBadges(unlocked);
    setLockedBadges(locked);
    setBadgeProgress(progress);
    setStats({
      total: BADGES.length,
      unlocked: unlocked.length,
      progress: Math.round((unlocked.length / BADGES.length) * 100)
    });
  };

  const getBadgeIcon = (badgeId) => {
    const badge = BADGES.find(b => b.id === badgeId);
    return badge ? badge.icon : 'fa-award';
  };

  const getBadgeLabel = (badgeId) => {
    const badge = BADGES.find(b => b.id === badgeId);
    return badge ? badge.label : badgeId;
  };

  const getBadgeDescription = (badgeId) => {
    const badge = BADGES.find(b => b.id === badgeId);
    return badge ? badge.description : '';
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fas fa-trophy me-2" style={{ color: 'var(--warning)' }}></i>
          Your Badges
        </h2>
        <p className="text-secondary">
          Earn badges by completing training modules and achieving milestones
        </p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>
              {stats.unlocked}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Unlocked</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {stats.total - stats.unlocked}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Locked</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
              {stats.progress}%
            </div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Progress</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
              {stats.total}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Total Badges</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div style={{
          height: '6px',
          background: 'var(--bg-secondary)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${stats.progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--warning), #FFB347)',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="row g-3">
        {/* Unlocked Badges */}
        {unlockedBadges.map(badge => (
          <div key={badge.id} className="col-6 col-md-4 col-lg-3">
            <div className="p-3 rounded-lg text-center" style={{
              background: 'var(--surface)',
              border: '2px solid rgba(255, 200, 87, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'var(--success)',
                color: 'var(--bg-primary)',
                fontSize: '0.6rem',
                padding: '2px 10px',
                borderRadius: '0 8px 0 8px',
                fontWeight: 600
              }}>
                UNLOCKED
              </div>
              <div style={{
                fontSize: '2.5rem',
                color: 'var(--warning)',
                marginBottom: '8px'
              }}>
                <i className={`fas ${badge.icon}`}></i>
              </div>
              <h6 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                {badge.label}
              </h6>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: 0 }}>
                {badge.description}
              </p>
            </div>
          </div>
        ))}

        {/* Locked Badges */}
        {lockedBadges.map(badge => {
          const isProgress = badgeProgress[badge.id] || false;
          return (
            <div key={badge.id} className="col-6 col-md-4 col-lg-3">
              <div className="p-3 rounded-lg text-center" style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                opacity: 0.6,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.6rem',
                  padding: '2px 10px',
                  borderRadius: '0 8px 0 8px',
                  fontWeight: 600
                }}>
                  LOCKED
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  opacity: 0.5
                }}>
                  <i className={`fas ${badge.icon}`}></i>
                </div>
                <h6 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 400 }}>
                  {badge.label}
                </h6>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: 0 }}>
                  {badge.description}
                </p>
                {isProgress && (
                  <div style={{
                    marginTop: '6px',
                    fontSize: '0.6rem',
                    color: 'var(--warning)'
                  }}>
                    <i className="fas fa-hourglass-half me-1"></i>
                    In Progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {unlockedBadges.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <i className="fas fa-trophy" style={{ color: 'var(--text-secondary)' }}></i>
          </div>
          <h4>No Badges Yet</h4>
          <p className="text-secondary">
            Complete training modules and achieve milestones to earn badges.
          </p>
          <Link to="/learn" className="btn mt-3" style={{
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}>
            Start Training <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Badges;
