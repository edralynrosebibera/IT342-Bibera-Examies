import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/ViewStudentAnswers.css";
import { toast } from 'sonner';

const ViewStudentAnswers = () => {
  const { classId, examId, studentId, attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [student, setStudent] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef();

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch attempt data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attempt details
        const attemptRes = await fetch(`http://localhost:8080/api/attempts/details/${attemptId}`);
        if (!attemptRes.ok) throw new Error('Unable to fetch attempt details');
        const attemptData = await attemptRes.json();
        setAttempt(attemptData);

        // Fetch exam details
        const examRes = await fetch(`http://localhost:8080/api/exams/${examId}`);
        const examData = await examRes.json();
        setExam(examData);

        // Fetch questions
        const questionsRes = await fetch(`http://localhost:8080/api/questions/exam/${examId}`);
        const questionsData = await questionsRes.json();
        setQuestions(Array.isArray(questionsData) ? questionsData : []);

        // Fetch answers
        const answersRes = await fetch(`http://localhost:8080/api/attempts/${attemptId}`);
        const answersData = await answersRes.json();
        setAnswers(Array.isArray(answersData) ? answersData : []);

        // Fetch student info
        const studentRes = await fetch(`http://localhost:8080/api/users/${studentId}`);
        const studentData = await studentRes.json();
        setStudent(studentData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load student answers');
      }
    };

    if (attemptId && examId && studentId) {
      fetchData();
    }
  }, [attemptId, examId, studentId]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleBackToAnalytics = () => {
    navigate(`/analytics/${classId}`);
  };

  if (!attempt || !exam || !student) {
    return <div className="loading">Loading student answers...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-logo">📊</div>
          <div className="nav-brand">Examies</div>
        </div>

        <div className="nav-right">
          <div className="nav-icon">👤</div>
          <div
            className="nav-icon"
            ref={dropdownRef}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ⚙️
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleBackToAnalytics}>
                  Back to Analytics
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        {/* HEADER */}
        <div className="answers-header">
          <div>
            <h1>Student Answers Review</h1>
            <p className="student-info-text">
              {student.firstName} {student.lastName} ({student.email})
            </p>
          </div>
          <div className="score-display">
            <div className="score-box">
              <span className="score-label">Score</span>
              <span className="score-value">{attempt.score}/{exam.totalPoints || 100}</span>
            </div>
            <div className="time-box">
              <span className="time-label">Time Taken</span>
              <span className="time-value">{attempt.timeTaken || 'N/A'} minutes</span>
            </div>
          </div>
        </div>

        {/* ANSWERS REVIEW */}
        {currentQuestion && (
          <div className="answers-container">
            {/* QUESTION NAVIGATOR */}
            <div className="question-navigator">
              <h3>Questions ({currentQuestionIndex + 1}/{questions.length})</h3>
              <div className="questions-grid">
                {questions.map((q, index) => {
                  const answer = answers.find(a => a.questionId === q.id);
                  const isAnswered = answer !== undefined;
                  const isCorrect = answer?.isCorrect;

                  return (
                    <button
                      key={q.id}
                      className={`question-btn ${index === currentQuestionIndex ? 'active' : ''} ${isCorrect ? 'correct' : isAnswered ? 'incorrect' : 'unanswered'}`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION REVIEW */}
            <div className="question-review">
              <div className="question-header">
                <h2 className="question-text">
                  Question {currentQuestionIndex + 1}: {currentQuestion?.questionText}
                </h2>
                <div className="question-meta">
                  <span className="points-badge">{currentQuestion?.points || 1} points</span>
                  {currentAnswer?.isCorrect ? (
                    <span className="status-badge correct">✓ Correct</span>
                  ) : currentAnswer ? (
                    <span className="status-badge incorrect">✗ Incorrect</span>
                  ) : (
                    <span className="status-badge unanswered">- Unanswered</span>
                  )}
                </div>
              </div>

              {/* ANSWER OPTIONS */}
              <div className="options-container">
                {currentQuestion?.options && currentQuestion.options.length > 0 ? (
                  currentQuestion.options.map((option, index) => {
                    const selectedOptionText =
                      typeof currentAnswer?.selectedOption === "object"
                        ? currentAnswer?.selectedOption?.optionText
                        : currentAnswer?.selectedOption;
                    const isStudentAnswer = selectedOptionText === option.optionText;
                    const isCorrectOption = option.isCorrect === true;

                    return (
                      <div
                        key={option.id ?? index}
                        className={`option-card ${isStudentAnswer ? 'selected' : ''} ${
                          isCorrectOption ? 'correct-option' : ''
                        }`}
                      >
                        <div className="option-indicator">
                          {isStudentAnswer && isCorrectOption && <span className="icon">✓</span>}
                          {isStudentAnswer && !isCorrectOption && <span className="icon">✗</span>}
                          {!isStudentAnswer && isCorrectOption && <span className="icon">✓</span>}
                        </div>
                        <div className="option-text">{option.optionText}</div>
                        {isStudentAnswer && <div className="badge">Student Answer</div>}
                        {isCorrectOption && !isStudentAnswer && (
                          <div className="badge correct-answer">Correct Answer</div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="no-options">No options available</p>
                )}
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="navigation-buttons">
                <button
                  className="nav-btn prev-btn"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Previous Question
                </button>

                <button
                  className="nav-btn next-btn"
                  onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next Question →
                </button>
              </div>
            </div>
          </div>
        )}

        {questions.length === 0 && (
          <div className="no-questions">
            <p>No questions found for this exam</p>
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="action-buttons">
          <button className="back-btn" onClick={handleBackToAnalytics}>
            ← Back to Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentAnswers;
