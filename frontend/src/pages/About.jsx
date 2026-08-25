import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 16px 80px 16px',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Profile Picture */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), #00B4D8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        color: 'var(--bg-primary)',
        fontWeight: 700,
        marginBottom: '16px',
        flexShrink: 0,
        border: '3px solid var(--border)'
      }}>
        {/* TODO: Replace with actual profile photo */}
        {/* To add image, replace the div below with: 
            <img src="/src/assets/profile.jpg" alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> 
        */}
        SM
      </div>

      {/* Name */}
      <h2 style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '4px'
      }}>
        Shreyas M S
      </h2>

      {/* Tagline - EDITABLE TEXT */}
      <p style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        Cybersecurity enthusiast | Building tools to make security awareness accessible
      </p>

      {/* About This Project */}
      <div style={{
        width: '100%',
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border)',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: '12px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <i className="fas fa-info-circle me-2"></i>
          About This Project
        </h3>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: 0
        }}>
          CyberAware is a cybersecurity awareness training platform designed to help 
          individuals build strong security habits. Through interactive modules, 
          real-world scenarios, quizzes, and an AI coach, users learn to identify 
          phishing attempts, secure their accounts, and develop safe digital habits 
          that protect their personal and professional lives.
        </p>
      </div>

      {/* Connect / Contact */}
      <div style={{
        width: '100%',
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: '16px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <i className="fas fa-link me-2"></i>
          Connect & Contact
        </h3>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {/* GitHub */}
          <a
            href="https://github.com/shreyas-ms-cyber"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <i className="fab fa-github" style={{ fontSize: '18px', color: 'var(--text-primary)' }}></i>
            GitHub
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/shreyas-m-s-cyber"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <i className="fab fa-linkedin-in" style={{ fontSize: '18px', color: 'var(--text-primary)' }}></i>
            LinkedIn
          </a>

          {/* Email */}
          <a
            href="mailto:shreyasvaishnav40@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <i className="fas fa-envelope" style={{ fontSize: '16px', color: 'var(--accent)' }}></i>
            Email
          </a>

          {/* Phone */}
          <a
            href="tel:+919880974964"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <i className="fas fa-phone" style={{ fontSize: '16px', color: 'var(--success)' }}></i>
            Phone
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
