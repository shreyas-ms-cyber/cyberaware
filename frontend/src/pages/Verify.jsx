import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const Verify = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyCertificate();
  }, [id]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await api.verifyCertificate(id);
      if (response.success) {
        setCertificate(response.data);
      } else {
        setError(response.error?.message || 'Certificate not found');
      }
    } catch (err) {
      setError('Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-accent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary mt-3">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i>
          </div>
          <h3>Certificate Not Found</h3>
          <p className="text-secondary">
            The certificate you're looking for could not be found or has been invalidated.
          </p>
          <Link to="/" className="btn mt-3" style={{
            background: 'var(--accent)',
            color: 'var(--bg-primary)',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)'
          }}>
            Go Home <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div style={{
        background: 'linear-gradient(135deg, #0B1120 0%, #141E30 100%)',
        border: '2px solid var(--success)',
        borderRadius: '20px',
        padding: '40px 30px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <div className="text-center">
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i>
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-primary)' }}>
            ✓ Valid Certificate
          </h2>
          
          <div style={{
            width: '60px',
            height: '3px',
            background: 'var(--success)',
            margin: '12px auto'
          }}></div>

          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '4px'
          }}>
            {certificate.name}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Certificate of Completion
          </p>

          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            background: 'rgba(0, 210, 106, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 210, 106, 0.2)',
            margin: '16px 0'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Awareness Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>
              {certificate.score}%
            </div>
          </div>

          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            padding: '8px',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            wordBreak: 'break-all'
          }}>
            Certificate ID: {certificate.certificate_id}
          </div>

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

          <Link to="/" className="btn mt-3" style={{
            background: 'var(--surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)'
          }}>
            <i className="fas fa-home me-2"></i>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
