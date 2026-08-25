import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';

const Scenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      // Fetch scenarios for modules 1-3 (they have scenarios)
      const moduleIds = [1, 2, 3];
      const results = await Promise.all(
        moduleIds.map(id => api.getScenarios(id))
      );
      
      const allScenarios = [];
      results.forEach((res, index) => {
        if (res.success && res.data.length > 0) {
          allScenarios.push({
            moduleId: moduleIds[index],
            scenarios: res.data
          });
        }
      });
      setScenarios(allScenarios);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const moduleTitles = {
    1: 'Password Security',
    2: 'Phishing & Social Engineering',
    3: 'Multi-Factor Authentication'
  };

  const moduleIcons = {
    1: 'fa-key',
    2: 'fa-fish',
    3: 'fa-shield-halved'
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
          Test your knowledge with realistic cybersecurity scenarios
        </p>
      </div>

      {/* Scenario Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {scenarios.map((module) => (
          <Link
            key={module.moduleId}
            to={`/scenarios/${module.moduleId}`}
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
                <i className={`fas ${moduleIcons[module.moduleId] || 'fa-shield-alt'}`}></i>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '2px'
                }}>
                  {moduleTitles[module.moduleId] || `Module ${module.moduleId}`}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)'
                }}>
                  {module.scenarios.length} scenario{module.scenarios.length > 1 ? 's' : ''} • Ready to start
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
        ))}
      </div>

      {scenarios.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--color-text-muted)'
        }}>
          <i className="fas fa-shield-alt" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
          <p>No scenarios available yet.</p>
          <p style={{ fontSize: 'var(--text-sm)' }}>Complete training modules to unlock scenarios.</p>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
