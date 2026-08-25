import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { calculateOverallScore, getScoreBand, getModulePerformance, getDashboardStats } from '../utils/score';
import { getUnlockedBadges } from '../utils/badges';
import CyberBuddyAvatar from '../components/ui/CyberBuddyAvatar';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div>
      {/* Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Welcome back 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Stay smart. Stay secure.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
            <i className="fas fa-search"></i>
          </button>
          <button style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <i className="fas fa-moon"></i>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Modules Completed" value={`${stats?.completedCount || 0}/${stats?.totalModules || 10}`} sublabel={`${stats?.progress || 0}% Complete`} color="var(--accent)" icon="fa-book" />
        <StatCard label="Quizzes Completed" value={stats?.avgQuizScore ? `${stats.avgQuizScore}%` : '—'} sublabel="Avg. Score" color="var(--success)" icon="fa-question-circle" />
        <StatCard label="Awareness Score" value={overallScore !== null ? `${overallScore}%` : '—'} sublabel={scoreBand?.label || 'Not started'} color={overallScore >= 70 ? 'var(--success)' : 'var(--warning)'} icon="fa-shield-alt" />
        <StatCard label="Badges Earned" value={stats?.badgesCount || 0} sublabel="Keep going!" color="var(--warning)" icon="fa-trophy" />
      </div>

      {/* Chart + Topic Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Your Progress</h3>
          <div style={{ height: '200px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
                  <Line type="monotone" dataKey="score" stroke="#00E5FF" strokeWidth={2} dot={{ fill: '#00E5FF', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Complete modules to see progress
              </div>
            )}
          </div>
        </div>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Topic Progress</h3>
          {modules.slice(0, 5).map((mod) => {
            const score = storage.getQuizScore(mod.id) || 0;
            return (
              <ProgressBar
                key={mod.id}
                value={score}
                max={100}
                label={mod.title}
                color={score >= 70 ? 'var(--success)' : 'var(--warning)'}
                style={{ marginBottom: '8px' }}
              />
            );
          })}
          <Link to="/progress" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>View All Topics →</Link>
        </div>
      </div>

      {/* Recent Activity + CyberBuddy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentActivity.map((act, i) => (
                <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <i className="fas fa-circle" style={{ fontSize: '6px', color: 'var(--accent)', marginRight: '8px', verticalAlign: 'middle' }} />
                    {act.type === 'module_completed' && `Completed ${act.moduleTitle}`}
                    {act.type === 'quiz_completed' && `Quiz: ${act.moduleTitle} – ${act.score}%`}
                    {act.type === 'badge_unlocked' && `Unlocked ${act.badge}`}
                    {act.type === 'scenario_completed' && `Scenario: ${act.moduleTitle}`}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{act.score || 50}XP</span>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>No activity yet</div>
          )}
          <Link to="/progress" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>View All Activity →</Link>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-surface-elevated))',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <CyberBuddyAvatar size="lg" />
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '16px 0 4px' }}>CyberBuddy AI</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Your AI cybersecurity assistant</p>
          <Link to="/ai-coach" style={{
            padding: '10px 28px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            Chat with CyberBuddy
          </Link>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Ask me anything about cybersecurity
          </div>
        </div>
      </div>

      {/* Security Tip */}
      <div style={{ marginTop: '24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '16px 20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <i className="fas fa-shield-alt" style={{ color: 'var(--accent)', fontSize: '20px' }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Security Tip of the Day</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Always verify the sender's email address before clicking on any links or attachments.</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
