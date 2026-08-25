import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { MODULES } from '../utils/constants';

const Scenarios = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [scenarioResults, setScenarioResults] = useState({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (moduleId) {
      fetchData();
    } else {
      setLoading(false);
    }
    setScenarioResults(storage.getScenarioResults());
  }, [moduleId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const moduleResponse = await api.getModule(moduleId);
      if (moduleResponse.success) {
        setModule(moduleResponse.data);
      }
      
      const scenariosResponse = await api.getScenarios(moduleId);
      if (scenariosResponse.success) {
        setScenarios(scenariosResponse.data);
        
        const results = storage.getScenarioResults();
        const allCompleted = scenariosResponse.data.every(s => results[s.id]);
        if (allCompleted && scenariosResponse.data.length > 0) {
          setCompleted(true);
        }
      } else {
        setScenarios([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load scenarios. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || showResult) return;
    
    const scenario = scenarios[currentScenario];
    try {
      const response = await api.evaluateScenario(scenario.id, selectedAnswer);
      if (response.success) {
        setShowResult(true);
        const results = storage.getScenarioResults();
        results[scenario.id] = response.data.is_correct;
        storage.saveScenarioResult(moduleId, results);
        storage.addActivity({
          type: 'scenario_completed',
          moduleId: parseInt(moduleId),
          scenarioId: scenario.id,
          correct: response.data.is_correct
        });
        setScenarioResults(results);
        
        const updatedResults = storage.getScenarioResults();
        const allDone = scenarios.every(s => updatedResults[s.id]);
        if (allDone) {
          setCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error submitting scenario:', error);
      alert('Failed to submit answer. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      navigate(`/module/${moduleId}`);
    }
  };

  // If no moduleId is provided, show list of modules with scenarios
  if (!moduleId) {
    // Get all modules that have scenarios from the API
    const modulesWithScenarios = MODULES.filter(m => [1, 2, 3, 4, 5, 6].includes(m.id));
    
    return (
      <div className="container py-4">
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          <i className="fas fa-shield-alt me-2" style={{ color: 'var(--accent)' }}></i>
          Scenario Training
        </h2>
        <p className="text-secondary mb-4">Test your knowledge with realistic cybersecurity scenarios</p>
        
        <div className="row g-4">
          {modulesWithScenarios.map((mod) => {
            const scenarioResults = storage.getScenarioResults();
            const hasScenarios = scenarioResults[mod.id] && Object.keys(scenarioResults[mod.id]).length > 0;
            
            return (
              <div className="col-md-6 col-lg-4" key={mod.id}>
                <Link 
                  to={`/scenarios/${mod.id}`} 
                  className="text-decoration-none"
                  style={{ display: 'block' }}
                >
                  <div className="card h-100 border-0 rounded-lg" style={{
                    background: 'var(--surface)',
                    border: `1px solid ${hasScenarios ? 'rgba(0, 210, 106, 0.3)' : 'var(--border)'}`,
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
                        <i className={`fas ${mod.icon}`}></i>
                      </div>
                      <h5 style={{ color: 'var(--text-primary)' }}>{mod.title}</h5>
                      <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                        {hasScenarios ? (
                          <span style={{ color: 'var(--success)' }}>
                            <i className="fas fa-check-circle me-1"></i>
                            Completed
                          </span>
                        ) : (
                          'Ready to start'
                        )}
                      </p>
                      <button 
                        className="btn btn-sm px-4"
                        style={{
                          background: hasScenarios ? 'var(--success)' : 'var(--accent)',
                          color: 'var(--bg-primary)',
                          border: 'none',
                          fontWeight: 600
                        }}
                      >
                        {hasScenarios ? 'Review Scenarios' : 'Start Scenarios'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-accent" role="status">
            <span className="visually-hidden">Loading scenarios...</span>
          </div>
          <p className="text-secondary mt-3">Loading your scenarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i>
          </div>
          <h4>Something went wrong</h4>
          <p className="text-secondary">{error}</p>
          <button 
            onClick={fetchData}
            className="btn btn-primary mt-3"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              border: 'none'
            }}
          >
            <i className="fas fa-redo me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <i className="fas fa-shield-alt" style={{ color: 'var(--text-secondary)' }}></i>
          </div>
          <h4>No Scenarios Available</h4>
          <p className="text-secondary">This module doesn't have any scenarios yet.</p>
          <Link to={`/module/${moduleId}`} className="btn btn-primary mt-3">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Module
          </Link>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const isCompleted = scenarioResults[scenario?.id] === true;

  return (
    <div className="container py-4">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/scenarios" className="text-decoration-none text-secondary">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Scenario {currentScenario + 1} of {scenarios.length}
            </div>
            <h2 className="mb-0" style={{ fontFamily: 'var(--font-heading)' }}>
              {module?.title || 'Scenarios'}
            </h2>
          </div>
          {completed && (
            <span className="ms-auto" style={{ color: 'var(--success)' }}>
              <i className="fas fa-check-circle me-1"></i>
              All Completed
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div style={{
          height: '4px',
          background: 'var(--bg-secondary)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentScenario + 1) / scenarios.length) * 100}%`,
            height: '100%',
            background: completed ? 'var(--success)' : 'var(--accent)',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <div className="p-4 rounded-lg" style={{ 
        background: 'var(--surface)',
        border: isCompleted ? '1px solid rgba(0, 210, 106, 0.3)' : '1px solid var(--border)'
      }}>
        <div className="mb-4">
          <h4 style={{ color: 'var(--text-primary)' }}>
            <i className="fas fa-bolt me-2" style={{ color: 'var(--warning)' }}></i>
            {scenario.scenario?.title || 'Scenario'}
          </h4>
          <p className="text-secondary" style={{ lineHeight: 1.8 }}>
            {scenario.scenario?.description || 'Analyze this cybersecurity scenario.'}
          </p>
        </div>

        <div className="mb-4">
          <h6 className="text-secondary mb-3">What would you do?</h6>
          <div className="d-flex flex-column gap-2">
            {scenario.options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === scenario.correct_answer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className="btn text-start p-3 rounded-sm"
                  style={{
                    background: showCorrect ? 'rgba(0, 210, 106, 0.1)' :
                               showWrong ? 'rgba(255, 59, 92, 0.1)' :
                               isSelected ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-secondary)',
                    border: showCorrect ? '2px solid var(--success)' :
                           showWrong ? '2px solid var(--danger)' :
                           isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                    color: showCorrect ? 'var(--success)' :
                           showWrong ? 'var(--danger)' :
                           isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                    cursor: showResult ? 'default' : 'pointer',
                    opacity: showResult && !isCorrect && !isSelected ? 0.5 : 1
                  }}
                  disabled={showResult}
                >
                  <span className="me-2" style={{ 
                    color: showCorrect ? 'var(--success)' :
                           showWrong ? 'var(--danger)' :
                           isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: 600
                  }}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showCorrect && (
                    <span className="ms-2" style={{ color: 'var(--success)' }}>
                      <i className="fas fa-check-circle"></i> ✓ Correct
                    </span>
                  )}
                  {showWrong && (
                    <span className="ms-2" style={{ color: 'var(--danger)' }}>
                      <i className="fas fa-times-circle"></i> ✕ Incorrect
                    </span>
                  )}
                  {!showResult && isSelected && (
                    <span className="ms-2" style={{ color: 'var(--accent)' }}>
                      <i className="fas fa-check"></i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className="mt-4 p-3 rounded-sm" style={{
            background: isCompleted ? 'rgba(0, 210, 106, 0.05)' : 'rgba(255, 59, 92, 0.05)',
            border: `1px solid ${isCompleted ? 'rgba(0, 210, 106, 0.2)' : 'rgba(255, 59, 92, 0.2)'}`
          }}>
            <h6 className={isCompleted ? 'text-success' : 'text-danger'}>
              <i className={`fas ${isCompleted ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
              {isCompleted ? 'Correct!' : 'Not quite right.'}
            </h6>
            <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
              {scenario.explanation}
            </p>
            {!isCompleted && showResult && (
              <div className="mt-2">
                <span style={{ fontSize: '0.9rem', color: 'var(--success)' }}>
                  <i className="fas fa-lightbulb me-1"></i>
                  Correct answer: {scenario.correct_answer}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 d-flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              className="btn btn-primary px-4"
              style={{
                background: selectedAnswer ? 'var(--accent)' : 'var(--bg-secondary)',
                color: selectedAnswer ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 600,
                cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                opacity: selectedAnswer ? 1 : 0.5
              }}
              disabled={!selectedAnswer}
            >
              <i className="fas fa-check me-2"></i>
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary px-4"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                fontWeight: 600
              }}
            >
              {currentScenario < scenarios.length - 1 ? (
                <>
                  Next Scenario
                  <i className="fas fa-arrow-right ms-2"></i>
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  View Module
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scenarios;
