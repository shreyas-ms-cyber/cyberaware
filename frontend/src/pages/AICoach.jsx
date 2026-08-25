import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { SUGGESTED_PROMPTS } from '../utils/constants';
import { storage } from '../services/storage';

const AICoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    setError('');
    setLoading(true);
    setInput('');

    // Add user message
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Prepare conversation history (last 5 messages)
      const history = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await api.sendChatMessage(message, 'general', history);
      
      if (response.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.message
        }]);
        storage.addActivity({
          type: 'ai_chat',
          message: message.substring(0, 50)
        });
      } else {
        setError(response.error?.message || 'Failed to get response');
        // Remove the user message if failed
        setMessages(prev => prev.filter(m => m !== userMessage));
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setMessages(prev => prev.filter(m => m !== userMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 140px)',
      maxHeight: '800px',
      padding: '16px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #00B4D8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: 'var(--bg-primary)'
          }}>
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h5 className="mb-0" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-primary)' }}>
              CyberBuddy
            </h5>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Cybersecurity AI Assistant
            </span>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              padding: '4px 12px'
            }}
          >
            <i className="fas fa-trash me-1"></i>
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 0',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '16px',
              opacity: 0.5
            }}>
              🤖
            </div>
            <h5 style={{ color: 'var(--text-primary)' }}>Ask CyberBuddy</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
              Get answers to your cybersecurity questions. I can help with phishing, passwords, MFA, safe browsing, and more.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '12px'
            }}>
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface)',
                color: msg.role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                wordWrap: 'break-word',
                maxWidth: '100%'
              }}>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--surface)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <div className="spinner-border spinner-border-sm text-accent" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CyberBuddy is thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 59, 92, 0.1)',
            border: '1px solid rgba(255, 59, 92, 0.2)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <button
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                marginLeft: '8px',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end'
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask CyberBuddy about cybersecurity..."
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            resize: 'none',
            outline: 'none',
            minHeight: '44px',
            maxHeight: '120px',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: loading || !input.trim() ? 'var(--bg-secondary)' : 'var(--accent)',
            color: loading || !input.trim() ? 'var(--text-secondary)' : 'var(--bg-primary)',
            border: 'none',
            fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            minHeight: '44px',
            minWidth: '44px',
            transition: 'all 0.2s ease'
          }}
        >
          <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default AICoach;
