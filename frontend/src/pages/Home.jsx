import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { calculateOverallScore, getScoreBand, getModulePerformance, getDashboardStats } from '../utils/score';
import { getUnlockedBadges } from '../utils/badges';
import CyberBuddyAvatar from '../components/ui/CyberBuddyAvatar';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [performance, setPerformance] = useState({ labels: [], scores: [] });
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const dashboardStats = getDashboardStats();
    setStats(dashboardStats);
    setRecentActivity(storage.getActivity().slice(0, 5));
    setPerformance(getModulePerformance());
    import('../utils/constants').then(({ MODULES }) => setModules(MODULES));
  }, []);

  const overallScore = stats?.overallScore;
  const scoreBand = stats?.scoreBand;

  const chartData = performance.labels.map((label, i) => ({
    name: label,
    score: performance.scores[i] || 0,
  }));

  return (
    <div style={{ width: '100%', maxWidth: '100%', paddingBottom: '4px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Welcome back!</p>
        <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Stay smart.</p>
        <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-accent)' }}>Stay secure. 👋</p>
      </div>

      {/* Stats Grid - 2 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <StatCard
          label="Modules"
          value={`${stats?.completedCount || 0}/${stats?.totalModules || 10}`}
          sublabel={`${stats?.progress || 0}%`}
          color="cyan"
          icon="fa-book"
        />
        <StatCard
          label="Quizzes"
          value={Object.keys(storage.getQuizScores()).length}
          sublabel={`${stats?.avgQuizScore || 0}%`}
          color="purple"
          icon="fa-question-circle"
        />
        <StatCard
          label="Score"
          value={overallScore !== null ? `${overallScore}` : '—'}
          sublabel={scoreBand?.label || 'Not started'}
          color="amber"
          icon="fa-shield-alt"
        />
        <StatCard
          label="Badges"
          value={stats?.badgesCount || 0}
          sublabel="Keep going!"
          color="orange"
          icon="fa-trophy"
        />
      </div>

      {/* Your Progress */}
      <div style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        border: '1px solid var(--color-border)',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0 }}>Your Progress</h4>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Last 30 Days <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '4px' }}></i>
          </span>
        </div>
        <div style={{ height: '140px', width: '100%' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
                <Line type="monotone" dataKey="score" stroke="var(--color-accent)" strokeWidth={2} dot={{ fill: 'var(--color-accent)', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Complete modules to see progress
            </div>
          )}
        </div>
      </div>

      {/* Topic Progress */}
      <div style={{
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        border: '1px solid var(--color-border)',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0 }}>Topic Progress</h4>
          <Link to="/progress" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', textDecoration: 'none' }}>
            View All
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {modules.slice(0, 4).map((mod) => {
            const score = storage.getQuizScore(mod.id) || 0;
            return (
              <ProgressBar
                key={mod.id}
                value={score}
                max={100}
                label={mod.title}
                color={score >= 70 ? 'green' : 'amber'}
                size="sm"
              />
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}>
        <Link
          to="/learn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-soft)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            color: 'var(--color-accent)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <i className="fas fa-graduation-cap"></i> Continue
        </Link>
        <Link
          to="/ai-coach"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <i className="fas fa-robot"></i> CyberBuddy
        </Link>
      </div>
    </div>
  );
};

export default Home;
