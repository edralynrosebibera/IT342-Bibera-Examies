import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import RoleSelection from './RoleSelection';
import "../assets/styles/ExamFlowAuth.css";

const ExamFlowAuth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState(null);

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
            <SignUpForm role={role} setRole={setRole} />
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