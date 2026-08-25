import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { MODULES } from '../utils/constants';
import QuizComponent from '../components/quiz/QuizComponent';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [scenarioScore, setScenarioScore] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);

  useEffect(() => {
    fetchModule();
    setCompletedModules(storage.getCompletedModules());
    
    const quizScores = storage.getQuizScores();
    if (quizScores[id]) {
      setQuizCompleted(true);
      setQuizScore(quizScores[id]);
    }
    
    const scenarioResults = storage.getScenarioResults();
    if (scenarioResults[id]) {
      setScenarioCompleted(true);
      setScenarioScore(scenarioResults[id]);
    }
  }, [id]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await api.getModule(id);
      if (response.success) {
        setModule(response.data);
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    storage.markModuleComplete(parseInt(id));
    storage.addActivity({
      type: 'module_completed',
      moduleId: parseInt(id),
      moduleTitle: module?.title
    });
    navigate('/learn');
  };

  const handleQuizComplete = (score) => {
    setQuizCompleted(true);
    setQuizScore(score);
    storage.saveQuizScore(parseInt(id), score);
    storage.addActivity({
      type: 'quiz_completed',
      moduleId: parseInt(id),
      moduleTitle: module?.title,
      score: score
    });
  };

  const handleScenarioComplete = (score) => {
    setScenarioCompleted(true);
    setScenarioScore(score);
    storage.saveScenarioResult(parseInt(id), score);
    storage.addActivity({
      type: 'scenario_completed',
      moduleId: parseInt(id),
      moduleTitle: module?.title,
      score: score
    });
  };

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

  if (!module) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h2>Module not found</h2>
          <Link to="/learn" className="btn btn-primary mt-3">Back to Modules</Link>
        </div>
      </div>
    );
  }

  const moduleInfo = MODULES.find(m => m.id === parseInt(id));
  const isCompleted = completedModules.includes(parseInt(id));
  const steps = [
    { label: 'Learn', icon: 'fa-book' },
    { label: 'Real-World Example', icon: 'fa-globe' },
    { label: 'Identify Threat', icon: 'fa-search' },
    { label: 'Quiz', icon: 'fa-question-circle' },
    { label: 'Results', icon: 'fa-check-circle' }
  ];

  const renderContent = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
            <h3 className="mb-4" style={{ color: 'var(--accent)' }}>
              <i className="fas fa-book me-2"></i>
              Learn
            </h3>
            {module.content?.content?.map((item, index) => (
              <div key={index} className="mb-4">
                <h5 style={{ color: 'var(--text-primary)' }}>{item.title}</h5>
                <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
            <h3 className="mb-4" style={{ color: 'var(--warning)' }}>
              <i className="fas fa-globe me-2"></i>
              Real-World Example
            </h3>
            <div style={{
              background: 'rgba(255, 200, 87, 0.05)',
              border: '1px solid rgba(255, 200, 87, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem'
            }}>
              <h5 className="text-warning">{module.content?.real_world_example?.title}</h5>
              <p className="text-secondary" style={{ lineHeight: 1.8 }}>
                {module.content?.real_world_example?.description}
              </p>
            </div>
            <div className="mt-4">
              <h6 className="text-secondary">Key Takeaway:</h6>
              <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                Understanding real-world attacks helps you recognize and avoid similar threats in your daily life.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
            <h3 className="mb-4" style={{ color: 'var(--danger)' }}>
              <i className="fas fa-search me-2"></i>
              Identify the Threat
            </h3>
            <div style={{
              background: 'rgba(255, 59, 92, 0.05)',
              border: '1px solid rgba(255, 59, 92, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem'
            }}>
              <h5 className="text-danger">Common Signs of Cyber Threats:</h5>
              <ul className="text-secondary" style={{ lineHeight: 2 }}>
                <li>🚨 Urgent or threatening language</li>
                <li>🔗 Suspicious links or attachments</li>
                <li>✍️ Spelling and grammar errors</li>
                <li>📧 Unusual sender addresses</li>
                <li>💰 Requests for sensitive information</li>
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                <strong>Remember:</strong> Always verify before trusting any unexpected communication.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <QuizComponent 
            moduleId={parseInt(id)} 
            onComplete={handleQuizComplete}
            quizCompleted={quizCompleted}
            quizScore={quizScore}
          />
        );

      case 4:
        return (
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--surface)' }}>
            <h3 className="mb-4" style={{ color: 'var(--accent)' }}>
              <i className="fas fa-check-circle me-2"></i>
              Training Complete!
            </h3>
            
            <div className="row g-4 justify-content-center mt-3">
              <div className="col-md-4">
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <h6 className="text-secondary">Quiz Score</h6>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: quizScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                    {quizScore}%
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <h6 className="text-secondary">Scenarios</h6>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: scenarioScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                    {scenarioScore ? `${scenarioScore}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            {!isCompleted && (
              <button 
                onClick={handleComplete}
                className="btn btn-lg mt-4 px-5"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <i className="fas fa-check me-2"></i>
                Mark as Complete
              </button>
            )}
            
            {isCompleted && (
              <div className="mt-4">
                <div className="d-inline-block px-4 py-2 rounded-sm" style={{
                  background: 'rgba(0, 210, 106, 0.1)',
                  color: 'var(--success)',
                  border: '1px solid rgba(0, 210, 106, 0.2)'
                }}>
                  <i className="fas fa-check-circle me-2"></i>
                  Module Complete!
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Link to="/learn" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Modules
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/learn" className="text-decoration-none text-secondary">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Module {module.module_order} of 10
            </div>
            <h2 className="mb-0" style={{ fontFamily: 'var(--font-heading)' }}>
              {module.title}
            </h2>
          </div>
          {isCompleted && (
            <span className="ms-auto" style={{ color: 'var(--success)' }}>
              <i className="fas fa-check-circle me-1"></i>
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {steps.map((step, index) => (
            <div key={index} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
              <button
                onClick={() => {
                  if (index <= currentStep || 
                      (index === 3 && quizCompleted) ||
                      (index === 4 && isCompleted)) {
                    setCurrentStep(index);
                  }
                }}
                className="btn btn-sm rounded-circle mb-1"
                style={{
                  width: '40px',
                  height: '40px',
                  background: index <= currentStep ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: index <= currentStep ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  opacity: (index <= currentStep || 
                           (index === 3 && quizCompleted) ||
                           (index === 4 && isCompleted)) ? 1 : 0.5,
                  cursor: (index <= currentStep || 
                          (index === 3 && quizCompleted) ||
                          (index === 4 && isCompleted)) ? 'pointer' : 'not-allowed'
                }}
              >
                <i className={`fas ${step.icon}`}></i>
              </button>
              <span style={{ 
                fontSize: '0.7rem', 
                color: index <= currentStep ? 'var(--text-primary)' : 'var(--text-secondary)',
                textAlign: 'center'
              }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2" style={{
          height: '3px',
          background: 'var(--bg-secondary)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            height: '100%',
            background: 'var(--accent)',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <div className="mt-4">
        {renderContent()}
      </div>

      <div className="mt-4 d-flex justify-content-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="btn btn-outline-secondary"
          disabled={currentStep === 0}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Previous
        </button>
        {currentStep < 3 && (
          <button
            onClick={() => {
              if (currentStep === 2) {
                if (quizCompleted) {
                  setCurrentStep(4);
                } else {
                  setCurrentStep(3);
                }
              } else {
                setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
              }
            }}
            className="btn btn-primary"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              border: 'none',
              fontWeight: 600
            }}
          >
            Next
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        )}
        {currentStep === 3 && quizCompleted && (
          <button
            onClick={() => setCurrentStep(4)}
            className="btn btn-primary"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              border: 'none',
              fontWeight: 600
            }}
          >
            View Results
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
// Add at the top with other imports
import { checkAndUnlockBadges } from '../utils/badges';

// Update handleComplete function
const handleComplete = () => {
  storage.markModuleComplete(parseInt(id));
  storage.addActivity({
    type: 'module_completed',
    moduleId: parseInt(id),
    moduleTitle: module?.title
  });
  
  // Check for new badges
  const newBadges = checkAndUnlockBadges();
  if (newBadges.length > 0) {
    // Show badge notification
    const badgeNames = newBadges.map(b => {
      const badge = BADGES.find(b => b.id === b);
      return badge ? badge.label : b;
    }).join(', ');
    // You can show a toast notification here
    console.log(`🎉 New badges unlocked: ${badgeNames}`);
  }
  
  navigate('/learn');
};

// Also update handleQuizComplete
const handleQuizComplete = (score) => {
  setQuizCompleted(true);
  setQuizScore(score);
  storage.saveQuizScore(parseInt(id), score);
  storage.addActivity({
    type: 'quiz_completed',
    moduleId: parseInt(id),
    moduleTitle: module?.title,
    score: score
  });
  
  // Check for badges (especially perfect score)
  const newBadges = checkAndUnlockBadges();
  if (newBadges.length > 0) {
    const badgeNames = newBadges.map(b => {
      const badge = BADGES.find(b => b.id === b);
      return badge ? badge.label : b;
    }).join(', ');
    console.log(`🎉 New badges unlocked: ${badgeNames}`);
  }
};
