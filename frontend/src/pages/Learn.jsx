import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { MODULES } from '../utils/constants';

const Learn = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [scores, setScores] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [offset, setOffset] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [allModulesLoaded, setAllModulesLoaded] = useState(false);

  const PAGE_SIZE = 20; // Load 20 modules at a time

  useEffect(() => {
    setCompleted(storage.getCompletedModules());
    setScores(storage.getQuizScores());
    loadModules(0);
  }, []);

  const loadModules = async (offsetValue) => {
    try {
      if (offsetValue === 0) setLoading(true);
      else setLoadingMore(true);

      const res = await api.getModules(PAGE_SIZE, offsetValue);
      if (res.success) {
        setModules(prev => offsetValue === 0 ? res.data : [...prev, ...res.data]);
        setTotalModules(res.total);
        setHasMore(res.data.length === PAGE_SIZE && res.data.length < res.total);
        if (res.data.length === 0 || offsetValue + PAGE_SIZE >= res.total) {
          setAllModulesLoaded(true);
        }
        setOffset(offsetValue + PAGE_SIZE);
      }
    } catch (e) {
      console.error('Error fetching modules:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadModules(offset);
    }
  };

  const filteredModules = modules.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'completed') return matchesSearch && completed.includes(mod.id);
    if (filter === 'in-progress') return matchesSearch && !completed.includes(mod.id) && scores[mod.id] !== undefined;
    return matchesSearch;
  });

  if (loading && modules.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div className="spinner-border text-accent" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Learn</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
          Explore cybersecurity topics ({totalModules} modules)
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <i className="fas fa-search" style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          fontSize: '14px'
        }} />
        <input
          type="text"
          placeholder="Search modules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-sm)',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
        />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {['all', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: filter === f ? 'var(--color-accent)' : 'var(--color-bg-card)',
              color: filter === f ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
              border: filter === f ? 'none' : '1px solid var(--color-border)',
              fontSize: 'var(--text-xs)',
              fontWeight: filter === f ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Module Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredModules.map(mod => {
          const isCompleted = completed.includes(mod.id);
          const score = scores[mod.id] || null;
          const modIcon = MODULES.find(m => m.id === mod.id)?.icon || 'fa-book';
          const progress = isCompleted ? 100 : (score !== null ? score : 0);

          return (
            <Link key={mod.id} to={`/module/${mod.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-card)',
                border: `1px solid ${isCompleted ? 'rgba(0, 210, 106, 0.2)' : 'var(--color-border)'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: isCompleted ? 'rgba(0, 210, 106, 0.12)' : 'var(--color-accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted ? 'var(--color-green)' : 'var(--color-accent)',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  <i className={`fas ${modIcon}`}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <h5 style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      margin: 0,
                      color: 'var(--color-text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {mod.title}
                    </h5>
                    <i className="fas fa-chevron-right" style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      flexShrink: 0
                    }} />
                  </div>
                  <p style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    margin: '2px 0 6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {mod.content?.description || 'Learn cybersecurity best practices'}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '3px',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: isCompleted ? 'var(--color-green)' : (progress > 0 ? 'var(--color-accent)' : 'var(--color-text-muted)'),
                        borderRadius: '2px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: isCompleted ? 'var(--color-green)' : (progress > 0 ? 'var(--color-accent)' : 'var(--color-text-muted)')
                    }}>
                      {isCompleted ? '✓' : `${Math.round(progress)}%`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Load More Button */}
      {!allModulesLoaded && filteredModules.length > 0 && (
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
            {loadingMore ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Loading...
              </>
            ) : (
              'Load More Modules'
            )}
          </button>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Showing {filteredModules.length} of {totalModules} modules
          </div>
        </div>
      )}

      {allModulesLoaded && filteredModules.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          All {totalModules} modules loaded
        </div>
      )}
    </div>
  );
};

export default Learn;
