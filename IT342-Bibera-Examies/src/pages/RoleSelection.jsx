import React from 'react';
import "../assets/styles/RoleSelection.css";

const RoleSelection = ({ setRole }) => {
  return (
    <div className="role-selection fade-in">
      <p className="selection-title">I am a...</p>
      <div className="role-cards">
        <div className="role-card" onClick={() => setRole('student')}>
          <div className="role-icon student-bg">🎓</div>
          <p>Student</p>
        </div>
        <div className="role-card" onClick={() => setRole('teacher')}>
          <div className="role-icon teacher-bg">📖</div>
          <p>Teacher</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;