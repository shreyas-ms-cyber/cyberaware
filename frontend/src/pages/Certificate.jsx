import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../services/storage';
import { api } from '../services/api';
import { calculateOverallScore, getScoreBand } from '../utils/score';
import { getUnlockedBadges } from '../utils/badges';

const Certificate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [score, setScore] = useState(null);
  const [scoreBand, setScoreBand] = useState(null);
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [completedModules, setCompletedModules] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = () => {
    const completed = storage.getCompletedModules();
    setCompletedModules(completed);
    
    const overallScore = calculateOverallScore();
    setScore(overallScore);
    
    if (overallScore !== null) {
      setScoreBand(getScoreBand(overallScore));
    }
    
    // Check eligibility: all 10 modules completed AND score >= 70
    const allModulesComplete = completed.length >= 10;
    const scoreEligible = overallScore !== null && overallScore >= 70;
    
    setEligible(allModulesComplete && scoreEligible);
    
    // Get badges
    setBadges(getUnlockedBadges());
  };

  const handleGenerateCertificate = async () => {
    if (!eligible) return;
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.createCertificate(name.trim(), score);
      if (response.success) {
        setCertificate(response.data);
        storage.addActivity({
          type: 'certificate_generated',
          name: name.trim(),
          score: score
        });
      } else {
        setError(response.error?.message || 'Failed to generate certificate');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If certificate is generated, show certificate view
  if (certificate) {
    return (
      <div className="container py-4" id="certificate-container">
        <div className="text-center mb-4">
          <button 
            onClick={handlePrint}
            className="btn px-4 py-2"
            style={{
              background: 'var(--accent)',
              color: 'var(--bg-primary)',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: 'none'
            }}
          >
            <i className="fas fa-print me-2"></i>
            Download / Print Certificate
          </button>
          <button 
            onClick={() => {
              setCertificate(null);
              setName('');
            }}
            className="btn px-4 py-2 ms-2"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Generate Another
          </button>
        </div>

        {/* Certificate Design */}
        <div style={{
          background: 'linear-gradient(135deg, #0B1120 0%, #141E30 100%)',
          border: '2px solid var(--accent)',
          borderRadius: '20px',
          padding: '40px 30px',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative border */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '16px',
            pointerEvents: 'none'
          }}></div>
          
          {/* Decorative lines */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            opacity: 0.5
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            opacity: 0.5
          }}></div>

          <div className="text-center">
            {/* Logo */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--accent)',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '4px'
            }}>
              CyberAware
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              letterSpacing: '4px',
              marginBottom: '20px'
            }}>
              CYBERSECURITY AWARENESS TRAINING
            </div>

            {/* Certificate Title */}
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '8px'
            }}>
              Certificate of Completion
            </div>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto 20px'
            }}></div>

            {/* Awarded To */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '4px'
            }}>
              Awarded to
            </p>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '16px'
            }}>
              {certificate.name}
            </div>

            {/* Score */}
            <div style={{
              display: 'inline-block',
              padding: '8px 24px',
              background: 'rgba(0, 229, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Awareness Score</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                {certificate.score}%
              </div>
            </div>

            {/* Badges earned */}
            {badges.length > 0 && (
              <div className="mb-3">
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Badges Earned
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {badges.map(badge => (
                    <span key={badge.id} style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 200, 87, 0.1)',
                      border: '1px solid rgba(255, 200, 87, 0.2)',
                      color: 'var(--warning)',
                      fontSize: '0.7rem'
                    }}>
                      <i className={`fas ${badge.icon} me-1`}></i>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate ID */}
            <div style={{
              fontSize: '0.6rem',
              color: 'var(--text-secondary)',
              padding: '8px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              marginTop: '16px',
              wordBreak: 'break-all'
            }}>
              Certificate ID: {certificate.certificate_id}
            </div>

            {/* Date */}
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              marginTop: '8px'
            }}>
              Issued: {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Disclaimer */}
            <div style={{
              marginTop: '20px',
              padding: '8px 16px',
              background: 'rgba(255, 200, 87, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 200, 87, 0.1)',
              fontSize: '0.6rem',
              color: 'var(--text-secondary)'
            }}>
              <i className="fas fa-info-circle me-1"></i>
              Demo certificate for portfolio/educational purposes — not an accredited credential.
            </div>

            {/* Verification link */}
            <div style={{
              marginTop: '12px',
              fontSize: '0.65rem',
              color: 'var(--text-secondary)'
            }}>
              <i className="fas fa-check-circle me-1" style={{ color: 'var(--success)' }}></i>
              Verify at: {window.location.origin}/verify/{certificate.certificate_id}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Eligibility check
  if (!eligible) {
    return (
      <div className="container py-5">
        <div className="text-center py-4">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            <i className="fas fa-certificate" style={{ color: 'var(--text-secondary)' }}></i>
          </div>
          <h3 style={{ fontFamily: "'Poppins', sans-serif" }}>
            Certificate Not Available Yet
          </h3>
          <p className="text-secondary" style={{ maxWidth: '500px', margin: '0 auto' }}>
            To earn a certificate, you need to:
          </p>
          <div className="mt-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="d-flex align-items-center gap-3 p-2 rounded-sm" style={{
              background: completedModules.length >= 10 ? 'rgba(0, 210, 106, 0.1)' : 'rgba(255, 59, 92, 0.1)',
              border: `1px solid ${completedModules.length >= 10 ? 'rgba(0, 210, 106, 0.2)' : 'rgba(255, 59, 92, 0.2)'}`
            }}>
              <div style={{ fontSize: '1.2rem' }}>
                {completedModules.length >= 10 ? '✅' : '❌'}
              </div>
              <div className="text-start">
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  Complete all 10 modules
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {completedModules.length}/10 completed
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 p-2 rounded-sm mt-2" style={{
              background: score !== null && score >= 70 ? 'rgba(0, 210, 106, 0.1)' : 'rgba(255, 59, 92, 0.1)',
              border: `1px solid ${score !== null && score >= 70 ? 'rgba(0, 210, 106, 0.2)' : 'rgba(255, 59, 92, 0.2)'}`
            }}>
              <div style={{ fontSize: '1.2rem' }}>
                {score !== null && score >= 70 ? '✅' : '❌'}
              </div>
              <div className="text-start">
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  Achieve Awareness Score ≥ 70%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {score !== null ? `${score}%` : 'No score yet'}
                </div>
              </div>
            </div>
          </div>
          <Link to="/learn" className="btn mt-4" style={{
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}>
            Continue Training <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          <i className="fas fa-certificate" style={{ color: 'var(--accent)' }}></i>
        </div>
        <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>
          You're Eligible for a Certificate!
        </h2>
        <p className="text-secondary">
          Congratulations! You've completed all modules with a score of {score}%.
          Enter your name to generate your certificate.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="mb-3">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  marginTop: '4px'
                }}
              />
            </div>

            {error && (
              <div className="mb-3 p-2 rounded-sm" style={{
                background: 'rgba(255, 59, 92, 0.1)',
                border: '1px solid rgba(255, 59, 92, 0.2)',
                color: 'var(--danger)',
                fontSize: '0.85rem'
              }}>
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <div className="mb-3">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Awareness Score</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{score}%</span>
              </div>
            </div>

            <button
              onClick={handleGenerateCertificate}
              disabled={loading || !name.trim()}
              className="btn w-100 py-3"
              style={{
                background: loading || !name.trim() ? 'var(--bg-secondary)' : 'var(--accent)',
                color: loading || !name.trim() ? 'var(--text-secondary)' : 'var(--bg-primary)',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-certificate me-2"></i>
                  Generate Certificate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
