import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';

const Scenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const PAGE_SIZE = 20;

  useEffect(() => {
    loadScenarios(0);
  }, []);

  const loadScenarios = async (offsetValue) => {
    try {
      if (offsetValue === 0) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scenarios?limit=${PAGE_SIZE}&offset=${offsetValue}`);
      const data = await response.json();
      
      if (data.success) {
        setScenarios(prev => offsetValue === 0 ? data.data : [...prev, ...data.data]);
        setTotalScenarios(data.total || 0);
        setHasMore(data.data.length === PAGE_SIZE && offsetValue + PAGE_SIZE < data.total);
        setOffset(offsetValue + PAGE_SIZE);
      } else {
        console.error('API error:', data);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadScenarios(offset);
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

  // 🚀 FIX: REMOVED THE HARDCODED GATE
  // Before: if (completedModules < 3) show "Complete training modules to unlock scenarios"
  // After: All scenarios are always visible immediately
  // No "completed modules" check - all 100 scenarios show instantly

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '4px'
        }}>
          <i className="fas fa-shield-alt" style={{ color: 'var(--color-accent)', fontSize: '20px' }}></i>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Scenario Training</h2>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
          Test your knowledge with {totalScenarios} realistic cybersecurity scenarios
        </p>
      </div>

      {/* Scenario Cards - ALL scenarios render immediately, NO GATE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {scenarios.length > 0 ? (
          scenarios.map((scenario, index) => {
            const scenarioId = scenario.id || index + 1;
            const title = scenario.scenario?.title || `Scenario ${scenarioId}`;
            const description = scenario.scenario?.description || 'Analyze this cybersecurity scenario.';

            return (
              <Link
                key={scenarioId}
                to={`/scenarios/${scenarioId}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'linear-gradient(145deg, rgba(15,27,47,0.96), rgba(10,20,36,0.96))',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-accent-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '2px'
                    }}>
                      {title}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {description}
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-accent)',
                    color: 'var(--color-bg-primary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}>
                    Start →
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--color-text-muted)'
          }}>
            <i className="fas fa-shield-alt" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
            <p>No scenarios found.</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && scenarios.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              background: loadingMore ? 'var(--color-bg-secondary)' : 'var(--color-accent)',
              color: loadingMore ? 'var(--color-text-muted)' : 'var(--color-bg-primary)',
              border: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: loadingMore ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {loadingMore ? 'Loading...' : 'Load More Scenarios'}
          </button>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Showing {scenarios.length} of {totalScenarios} scenarios
          </div>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
