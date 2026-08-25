import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { MODULES } from '../utils/constants';

const Learn = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState([]);
  const [scores, setScores] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchModules();
    setCompleted(storage.getCompletedModules());
    setScores(storage.getQuizScores());
  }, []);

  const fetchModules = async () => {
    try {
      const res = await api.getModules();
      if (res.success) setModules(res.data);
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  };

  const filteredModules = modules.filter(mod =>
    mod.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Training Modules</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Complete all modules to earn your certificate</p>
        <div style={{ marginTop: '12px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredModules.map(mod => {
          const isCompleted = completed.includes(mod.id);
          const score = scores[mod.id] || null;
          const modIcon = MODULES.find(m => m.id === mod.id)?.icon || 'fa-book';
          return (
            <Link key={mod.id} to={`/module/${mod.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: `1px solid ${isCompleted ? 'rgba(0,210,106,0.3)' : 'var(--border)'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 229, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      fontSize: '18px'
                    }}>
                      <i className={`fas ${modIcon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Module {mod.module_order}</div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{mod.title}</h4>
                    </div>
                  </div>
                  {isCompleted && <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i>}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', flex: 1 }}>{mod.content?.description || ''}</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {score !== null && <span style={{ fontSize: '11px', background: 'rgba(0,229,255,0.1)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '12px' }}>{score}%</span>}
                  {mod.quiz_count > 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}><i className="fas fa-question-circle"></i> {mod.quiz_count}</span>}
                  {mod.scenario_count > 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}><i className="fas fa-shield-alt"></i> {mod.scenario_count}</span>}
                </div>
                <div style={{ marginTop: '12px', height: '3px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: isCompleted ? '100%' : '0%', height: '100%', background: 'var(--accent)', transition: 'width 0.5s' }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Learn;
