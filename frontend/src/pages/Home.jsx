import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../services/storage';
import { calculateOverallScore, getScoreBand, getModulePerformance, getDashboardStats } from '../utils/score';
import { getUnlockedBadges } from '../utils/badges';
import CyberBuddyAvatar from '../components/ui/CyberBuddyAvatar';
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
    <div className="w-full max-w-4xl mx-auto px-4 py-4 pb-20 bg-slate-950 text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">CyberAware</h1>
          <p className="text-xs text-slate-400">Stay Aware. Stay Secure.</p>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-bell text-lg"></i>
        </button>
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-slate-400">Welcome back!</p>
        <p className="text-lg font-bold text-white">Stay smart.</p>
        <p className="text-lg font-bold text-sky-400">Stay secure. 👋</p>
      </div>

      {/* Stats Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Modules */}
        <div className="flex flex-row items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">
            <i className="fas fa-book"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Modules</p>
            <p className="text-base font-bold text-white">{stats?.completedCount || 0}/{stats?.totalModules || 10}</p>
            <p className="text-xs font-semibold text-cyan-400">{stats?.progress || 0}%</p>
          </div>
        </div>

        {/* Quizzes */}
        <div className="flex flex-row items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
            <i className="fas fa-question-circle"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Quizzes</p>
            <p className="text-base font-bold text-white">{Object.keys(storage.getQuizScores()).length}</p>
            <p className="text-xs font-semibold text-purple-400">{stats?.avgQuizScore || 0}%</p>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-row items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Score</p>
            <p className="text-base font-bold text-white">{overallScore !== null ? `${overallScore}` : '—'}</p>
            <p className="text-xs font-semibold text-amber-400">{scoreBand?.label || 'Not started'}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-row items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm">
            <i className="fas fa-trophy"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Badges</p>
            <p className="text-base font-bold text-white">{stats?.badgesCount || 0}</p>
            <p className="text-xs font-semibold text-orange-400">Keep going!</p>
          </div>
        </div>
      </div>

      {/* Progress Cards (Vertical Stack) */}
      <div className="flex flex-col gap-4 w-full mb-6">
        {/* Your Progress */}
        <div className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-white">Your Progress</h3>
            <span className="text-xs text-slate-400">Last 30 Days ▼</span>
          </div>
          <div className="h-40 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2} dot={{ fill: '#38bdf8', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Complete a module to see progress
              </div>
            )}
          </div>
        </div>

        {/* Topic Progress */}
        <div className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-white">Topic Progress</h3>
            <Link to="/progress" className="text-xs text-sky-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {modules.slice(0, 4).map((mod) => {
              const score = storage.getQuizScore(mod.id) || 0;
              const color = score >= 70 ? 'bg-emerald-500' : 'bg-amber-500';
              return (
                <div key={mod.id}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{mod.title}</span>
                    <span className="text-slate-400">{score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions + CyberBuddy (optional) - keep as is or adapt */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/learn" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium hover:bg-sky-500/20 transition-colors">
          <i className="fas fa-graduation-cap"></i> Continue
        </Link>
        <Link to="/ai-coach" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
          <i className="fas fa-robot"></i> CyberBuddy
        </Link>
      </div>
    </div>
  );
};

export default Home;
