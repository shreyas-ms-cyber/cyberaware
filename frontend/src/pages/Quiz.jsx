import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import QuizComponent from '../components/quiz/QuizComponent';

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizScores, setQuizScores] = useState({});

  useEffect(() => {
    fetchModules();
    setQuizScores(storage.getQuizScores());
  }, []);

  const fetchModules = async () => {
    try {
      const res = await api.getModules();
      if (res.success) {
        setModules(res.data);
      }
    } catch (e) {
      console.error('Error fetching modules:', e);
    } finally {
      setLoading(false);
    }
  };

  // If no moduleId is provided, show list of modules with quizzes
  if (!moduleId) {
    const modulesWithQuizzes = modules.filter(m => m.quiz_count > 0);

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
            <i className="fas fa-question-circle" style={{ color: 'var(--color-accent)', fontSize: '20px' }}></i>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Available Quizzes</h2>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
            Test your knowledge on each module
          </p>
        </div>

        {/* Quiz Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {modulesWithQuizzes.map((mod) => {
            const score = quizScores[mod.id] || null;
            const isCompleted = score !== null;

            return (
              <Link
                key={mod.id}
                to={`/quiz/${mod.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'linear-gradient(145deg, rgba(15,27,47,0.96), rgba(10,20,36,0.96))',
                  border: `1px solid ${isCompleted ? 'rgba(34, 197, 94, 0.3)' : 'var(--color-border)'}`,
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
                    background: isCompleted ? 'rgba(34, 197, 94, 0.12)' : 'var(--color-accent-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted ? 'var(--color-green)' : 'var(--color-accent)',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-book'}`}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '2px'
                    }}>
                      {mod.title}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: isCompleted ? 'var(--color-green)' : 'var(--color-text-muted)'
                    }}>
                      {isCompleted ? `${score}% • Completed` : `${mod.quiz_count} questions • Not attempted`}
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: isCompleted ? 'var(--color-green)' : 'var(--color-accent)',
                    color: 'var(--color-bg-primary)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}>
                    {isCompleted ? 'Retake →' : 'Start →'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {modulesWithQuizzes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--color-text-muted)'
          }}>
            <i className="fas fa-question-circle" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
            <p>No quizzes available yet.</p>
            <p style={{ fontSize: 'var(--text-sm)' }}>Complete training modules to unlock quizzes.</p>
          </div>
        )}
      </div>
    );
  }

  // Show individual quiz if moduleId is provided
  const module = modules.find(m => m.id === parseInt(moduleId));

  if (!module) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '4px'
        }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
            {module.title}
          </h2>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
          Test your knowledge
        </p>
      </div>

      <QuizComponent
        moduleId={parseInt(moduleId)}
        onComplete={(score) => {
          storage.saveQuizScore(parseInt(moduleId), score);
          setQuizScores(storage.getQuizScores());
        }}
        quizCompleted={quizScores[moduleId] !== null}
        quizScore={quizScores[moduleId] || null}
      />
    </div>
  );
};

export default Quiz;
