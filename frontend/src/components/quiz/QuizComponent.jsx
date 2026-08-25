import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const QuizComponent = ({ moduleId, onComplete, quizCompleted, quizScore }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [moduleId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.getQuizQuestions(moduleId);
      if (response.success && response.data.length > 0) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    // Check if all questions answered
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    try {
      const response = await api.submitQuiz(moduleId, answers);
      if (response.success) {
        setResults(response.data);
        setSubmitted(true);
        onComplete(response.data.score);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  if (quizCompleted && quizScore !== null) {
    return (
      <div className="text-center p-4">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i>
        </div>
        <h4>Quiz Already Completed!</h4>
        <p className="text-secondary">Your Score: <strong style={{ color: quizScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>{quizScore}%</strong></p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-accent" role="status">
          <span className="visually-hidden">Loading quiz...</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-4">
        <h4>No Quiz Available</h4>
        <p className="text-secondary">No quiz questions found for this module.</p>
      </div>
    );
  }

  if (submitted && results) {
    const passed = results.score >= 70;
    return (
      <div className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            <i className={`fas ${passed ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} 
               style={{ color: passed ? 'var(--success)' : 'var(--warning)' }}></i>
          </div>
          <h4>{passed ? 'Great Job!' : 'Keep Learning!'}</h4>
          <p className="text-secondary">
            You scored <strong style={{ color: passed ? 'var(--success)' : 'var(--warning)' }}>{results.score}%</strong>
          </p>
        </div>
        
        <div className="mt-4">
          {results.results.map((result, index) => (
            <div key={index} className="mb-3 p-3 rounded-sm" style={{
              background: result.is_correct ? 'rgba(0, 210, 106, 0.05)' : 'rgba(255, 59, 92, 0.05)',
              border: `1px solid ${result.is_correct ? 'rgba(0, 210, 106, 0.2)' : 'rgba(255, 59, 92, 0.2)'}`
            }}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {index + 1}. {result.question}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Your answer: {result.user_answer || 'Not answered'}
                  </div>
                  {!result.is_correct && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                      Correct answer: {result.correct_answer}
                    </div>
                  )}
                </div>
                <div>
                  <i className={`fas ${result.is_correct ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'}`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--surface)' }}>
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {Math.round(progress)}% complete
          </span>
        </div>
        <div style={{
          height: '3px',
          background: 'var(--bg-secondary)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--accent)',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>
          {question.question}
        </h5>
        <div className="d-flex flex-column gap-2">
          {question.options.map((option, index) => {
            const isSelected = answers[question.id] === option;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, option)}
                className="btn text-start p-3 rounded-sm"
                style={{
                  background: isSelected ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-secondary)',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span className="me-2" style={{ 
                  color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: 600
                }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {isSelected && (
                  <span className="ms-2" style={{ color: 'var(--accent)' }}>
                    <i className="fas fa-check"></i>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          className="btn btn-outline-secondary"
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Previous
        </button>
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              border: 'none',
              fontWeight: 600
            }}
          >
            <i className="fas fa-check me-2"></i>
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
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
      </div>
    </div>
  );
};

export default QuizComponent;
