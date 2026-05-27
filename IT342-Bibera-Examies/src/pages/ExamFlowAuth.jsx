import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import RoleSelection from './RoleSelection';
import "../assets/styles/ExamFlowAuth.css";
import { useLocation } from 'react-router-dom';

const ExamFlowAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState(null);
  const [initialEmail, setInitialEmail] = useState('');
  const [oauthSignup, setOauthSignup] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup')) {
      setActiveTab('signup');
    }
    const email = params.get('email');
    setInitialEmail(email || '');
    setOauthSignup(params.get('oauth') === '1');
    setSupabaseUserId(params.get('supabaseUserId') || '');
  }, [location.search]);

  return (
    <div className="page-container">
      <div className="brand-section">
        <div className="brand-logo">🎓</div>
        <h1 className="brand-name">Examies</h1>
        <p className="brand-subtext">Online Examination Platform</p>
      </div>

      <div className="white-box-container">
        <div className="sliding-nav">
          <button 
            className={`nav-item ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setRole(null); }}
          >
            Log In
          </button>
          <button 
            className={`nav-item ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="content-area">
          {activeTab === 'login' ? (
            <LoginForm />
          ) : !role ? (
            <RoleSelection setRole={setRole} />
          ) : (
            <SignUpForm
              role={role}
              setRole={setRole}
              initialEmail={initialEmail}
              oauth={oauthSignup}
              supabaseUserId={supabaseUserId}
            />
          )}
        </div>

              <p className="footer-link">
        {activeTab === 'login' ? "Don't have an account?" : "Already have an account?"}
        <span onClick={() => activeTab === 'login' ? setActiveTab('signup') : setActiveTab('login')}>
          {activeTab === 'login' ? " Sign up" : " Log in"}
        </span>
      </p>
    </div>
      </div>
      

  );
};

export default ExamFlowAuth;
