import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import QuizComponent from '../components/quiz/QuizComponent';

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    if (moduleId) {
      fetchModule();
      const quizScores = storage.getQuizScores();
      if (quizScores[moduleId]) {
        setQuizCompleted(true);
        setQuizScore(quizScores[moduleId]);
      }
    }
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await api.getModule(moduleId);
      if (response.success) {
        setModule(response.data);
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (score) => {
    setQuizCompleted(true);
    setQuizScore(score);
    storage.saveQuizScore(parseInt(moduleId), score);
    storage.addActivity({
      type: 'quiz_completed',
      moduleId: parseInt(moduleId),
      moduleTitle: module?.title,
      score: score
    });
  };

  // If no moduleId is provided, show a list of available quizzes
  if (!moduleId) {
    return (
      <div className="container py-4">
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fas fa-question-circle me-2" style={{ color: 'var(--accent)' }}></i>
          Available Quizzes
        </h2>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
            const quizScores = storage.getQuizScores();
            const score = quizScores[id];
            const completed = storage.getCompletedModules().includes(id);
            
            return (
              <div className="col-md-6 col-lg-4" key={id}>
                <Link 
                  to={`/quiz/${id}`} 
                  className="text-decoration-none"
                  style={{ display: 'block' }}
                >
                  <div className="card h-100 border-0 rounded-lg" style={{
                    background: 'var(--surface)',
                    border: `1px solid ${score ? 'rgba(0, 210, 106, 0.3)' : 'var(--border)'}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <div className="card-body p-4 text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(0, 229, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'var(--accent)',
                        fontSize: '1.5rem'
                      }}>
                        <i className="fas fa-book"></i>
                      </div>
                      <h5 style={{ color: 'var(--text-primary)' }}>Module {id}</h5>
                      <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                        {score ? (
                          <>
                            <span style={{ color: score >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                              {score}%
                            </span>
                            <span className="ms-2 text-secondary">• Completed</span>
                          </>
                        ) : (
                          'Not attempted'
                        )}
                      </p>
                      <button 
                        className="btn btn-sm px-4"
                        style={{
                          background: score ? 'var(--success)' : 'var(--accent)',
                          color: 'var(--bg-primary)',
                          border: 'none',
                          fontWeight: 600
                        }}
                      >
                        {score ? 'Retake Quiz' : 'Start Quiz'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-4">
          <Link to="/learn" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-accent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/learn" className="text-decoration-none text-secondary">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Module {module?.module_order || moduleId}
            </div>
            <h2 className="mb-0" style={{ fontFamily: 'var(--font-heading)' }}>
              {module?.title || `Module ${moduleId}`}
            </h2>
          </div>
          {quizCompleted && (
            <span className="ms-auto" style={{ color: 'var(--success)' }}>
              <i className="fas fa-check-circle me-1"></i>
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <QuizComponent 
          moduleId={parseInt(moduleId)} 
          onComplete={handleQuizComplete}
          quizCompleted={quizCompleted}
          quizScore={quizScore}
        />
      </div>
    </div>
  );
};

export default Quiz;
