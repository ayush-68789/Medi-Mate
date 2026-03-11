import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic Animated Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="auth-card">
        <div className="auth-body">
          <div className="brand-section">
            <div className="logo-circle heartbeat-animation">
               <i className="bi bi-shield-check"></i>
            </div>
            <h1>Log in to Medi-Mate</h1>
            <p className="subtitle">Securely access your personalized health insights and reports.</p>
          </div>

          <div className="auth-methods">
            <button className="method-tile" onClick={() => navigate('/dashboard')}>
              <div className="method-icon google-bg">
                <i className="bi bi-google"></i>
              </div>
              <div className="method-info">
                <strong>Google Account</strong>
                <span>Instant access using your secure identity</span>
              </div>
              <i className="bi bi-arrow-right-short arrow"></i>
            </button>

            <button className="method-tile" onClick={() => navigate('/dashboard')}>
              <div className="method-icon gov-bg">
                <i className="bi bi-person-badge"></i>
              </div>
              <div className="method-info">
                <strong>Government ID</strong>
                <span>Official health record verification</span>
              </div>
              <i className="bi bi-arrow-right-short arrow"></i>
            </button>

            <div className="auth-divider">
              <span>or use your credentials</span>
            </div>

            <button className="method-tile email-tile" onClick={() => navigate('/dashboard')}>
              <div className="method-icon mail-bg">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="method-info">
                <strong>Medi-Mate ID</strong>
                <span>Login with email and password</span>
              </div>
              <i className="bi bi-chevron-right arrow"></i>
            </button>
          </div>

          <footer className="auth-footer">
            <p>By continuing, you agree to our <a href="/terms">Terms</a> & <a href="/privacy">Privacy</a></p>
            <div className="footer-links">
              <a href="/help">Help Center</a>
              <span className="dot"></span>
              <a href="/security">Security Standards</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;