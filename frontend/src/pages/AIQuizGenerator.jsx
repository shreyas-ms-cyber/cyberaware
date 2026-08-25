import { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'var(--color-green)' },
    { value: 'intermediate', label: 'Intermediate', color: 'var(--color-amber)' },
    { value: 'advanced', label: 'Advanced', color: 'var(--color-red)' },
  ];

  const questionCounts = [3, 5, 10];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const response = await api.generateQuiz(topic, difficulty, questionCount);
      if (response.success) {
        setQuiz(response.data);
      } else {
        setError(response.error?.message || 'Failed to generate quiz');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    if (!quiz) return;
    
    const allAnswered = quiz.questions.every((_, index) => selectedAnswers[index] !== undefined);
    if (!allAnswered) {
      alert('Please answer all questions');
      return;
    }
    setShowResults(true);
  };

  const handleRetry = () => {
    setQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="spinner-border text-accent" role="status">
          <span className="visually-hidden">Generating quiz...</span>
        </div>
        <p style={{ marginLeft: '12px', color: 'var(--color-text-secondary)' }}>Generating your quiz...</p>
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
          <i className="fas fa-magic" style={{ color: 'var(--color-accent)', fontSize: '20px' }}></i>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>AI Quiz Generator</h2>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
          Create custom quizzes on any cybersecurity topic
        </p>
      </div>

      {!quiz ? (
        // Generator Form
        <div style={{
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              display: 'block',
              marginBottom: '6px'
            }}>
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Phishing, Password Security, MFA..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              display: 'block',
              marginBottom: '6px'
            }}>
              Difficulty Level
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: difficulty === d.value ? d.color : 'var(--color-bg-secondary)',
                    color: difficulty === d.value ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                    border: difficulty === d.value ? 'none' : '1px solid var(--color-border)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: difficulty === d.value ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              display: 'block',
              marginBottom: '6px'
            }}>
              Number of Questions
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: questionCount === count ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                    color: questionCount === count ? 'var(--color-bg-primary)' : 'var(--color-text-secondary)',
                    border: questionCount === count ? 'none' : '1px solid var(--color-border)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: questionCount === count ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--color-red)',
              fontSize: 'var(--text-sm)',
              marginBottom: '12px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent)',
              color: 'var(--color-bg-primary)',
              border: 'none',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fas fa-wand-magic-sparkles me-2"></i>
            Generate Quiz
          </button>
        </div>
      ) : (
        // Quiz Display
        <div>
          {/* Quiz Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                {quiz.topic}
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {quiz.questions.length} questions • {quiz.difficulty}
              </p>
            </div>
            <button
              onClick={handleRetry}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-redo me-1"></i> New Quiz
            </button>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {quiz.questions.map((q, index) => {
              const selected = selectedAnswers[index];
              const isCorrect = showResults && selected === q.correct_answer;
              const isWrong = showResults && selected && selected !== q.correct_answer;

              return (
                <div key={index} style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  border: `1px solid ${
                    showResults
                      ? isCorrect
                        ? 'rgba(34, 197, 94, 0.3)'
                        : isWrong
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'var(--color-border)'
                      : 'var(--color-border)'
                  }`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-muted)',
                      fontWeight: 600
                    }}>
                      Question {index + 1} of {quiz.questions.length}
                    </span>
                    {showResults && (
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: isCorrect ? 'var(--color-green)' : 'var(--color-red)'
                      }}>
                        {isCorrect ? '✅ Correct' : isWrong ? '❌ Incorrect' : '⚠️ Not answered'}
                      </span>
                    )}
                  </div>

                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 500,
                    marginBottom: '10px'
                  }}>
                    {q.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {q.options.map((option, optIndex) => {
                      const isSelected = selected === option;
                      const isCorrectAnswer = showResults && option === q.correct_answer;
                      const isWrongAnswer = showResults && isSelected && option !== q.correct_answer;

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswerSelect(index, option)}
                          disabled={showResults}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            background: isCorrectAnswer
                              ? 'rgba(34, 197, 94, 0.15)'
                              : isWrongAnswer
                              ? 'rgba(239, 68, 68, 0.15)'
                              : isSelected
                              ? 'var(--color-accent-soft)'
                              : 'var(--color-bg-secondary)',
                            border: `1px solid ${
                              isCorrectAnswer
                                ? 'rgba(34, 197, 94, 0.4)'
                                : isWrongAnswer
                                ? 'rgba(239, 68, 68, 0.4)'
                                : isSelected
                                ? 'var(--color-accent)'
                                : 'var(--color-border)'
                            }`,
                            color: isSelected || isCorrectAnswer ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            cursor: showResults ? 'default' : 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: showResults && !isSelected && !isCorrectAnswer ? 0.6 : 1
                          }}
                        >
                          <span style={{
                            fontWeight: 600,
                            color: isCorrectAnswer
                              ? 'var(--color-green)'
                              : isWrongAnswer
                              ? 'var(--color-red)'
                              : isSelected
                              ? 'var(--color-accent)'
                              : 'var(--color-text-muted)'
                          }}>
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {option}
                          {isCorrectAnswer && (
                            <span style={{ marginLeft: 'auto', color: 'var(--color-green)' }}>
                              <i className="fas fa-check-circle"></i>
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span style={{ marginLeft: 'auto', color: 'var(--color-red)' }}>
                              <i className="fas fa-times-circle"></i>
                            </span>
                          )}
                          {!showResults && isSelected && (
                            <span style={{ marginLeft: 'auto', color: 'var(--color-accent)' }}>
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 229, 255, 0.05)',
                      border: '1px solid var(--color-border)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {!showResults && (
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent)',
                color: 'var(--color-bg-primary)',
                border: 'none',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Submit Answers
            </button>
          )}

          {/* Results Summary */}
          {showResults && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-accent)' }}>
                {quiz.questions.filter((_, i) => selectedAnswers[i] === quiz.questions[i].correct_answer).length} / {quiz.questions.length}
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Correct Answers
              </p>
              <button
                onClick={handleRetry}
                style={{
                  padding: '8px 24px',
                  marginTop: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-redo me-2"></i>
                Generate New Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuizGenerator;
