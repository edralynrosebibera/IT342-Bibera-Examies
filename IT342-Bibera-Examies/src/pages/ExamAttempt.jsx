import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/ExamAttempt.css";
import "../assets/styles/StudentDashboard.css";

const ExamAttempt = () => {

  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);

  // 🔥 LOAD QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(
        `http://localhost:8080/api/questions/exam/${examId}`
      );
      const data = await res.json();
      console.log("QUESTIONS:", data);
      setQuestions(data);
    };

    fetchQuestions();
  }, [examId]);

  // 🔥 START ATTEMPT
  useEffect(() => {
    const startAttempt = async () => {
      console.log("USER:", user);

      const userRes = await fetch(
        `http://localhost:8080/api/auth/me?email=${user.email}`
      );
      const userData = await userRes.json();

      const res = await fetch(
        `http://localhost:8080/api/attempts/start?examId=${examId}&studentId=${userData.id}`,
        { method: "POST" }
      );

      const data = await res.json();
      setAttemptId(data.id);
    };

    if (user?.email) startAttempt();
  }, [user, examId]);

  // 🔥 LOAD SAVED ANSWERS
  useEffect(() => {
    const loadAnswers = async () => {
      const res = await fetch(
        `http://localhost:8080/api/attempts/${attemptId}`
      );
      const data = await res.json();

      let saved = {};
      data.forEach(a => {
        saved[a.questionId] = a.textAnswer || a.selectedOption;
      });

      setAnswers(saved);
    };

    if (attemptId) loadAnswers();
  }, [attemptId]);

  // 🔥 SAVE ANSWER
  const handleAnswer = async (questionId, value) => {

    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    await fetch(
      `http://localhost:8080/api/attempts/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          attemptId: attemptId,
          questionId: questionId,
          textAnswer: currentQ.questionType === "identification" ? value : null,
          selectedOption: currentQ.questionType === "mcq" ? value : null,
          uploadFileUrl: currentQ.questionType === "attachment" ? value : null
        })
      }
    );
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    await fetch(
      `http://localhost:8080/api/attempts/submit/${attemptId}`,
      { method: "PUT" }
    );

    alert("Exam submitted!");
    navigate("/student-dashboard");
  };

  const currentQ = questions[current];

  return (
    <div className="exam-container">

      <nav className="navbar exam-navbar">
        <div className="nav-left">
          <div className="nav-logo">🎓</div>
          <span className="nav-brand">ExamHub</span>
        </div>

        <div className="nav-right exam-nav-right">
          <button 
            className="header-btn secondary"
            onClick={() => navigate("/student-dashboard")}
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="exam-wrapper">
        <div className="exam-body">

          <div className="question-panel">

            {currentQ && (
              <>
                <div className="question-header">
                  <span>Question {current + 1}</span>
                  <span>{currentQ.points} pts</span>
                </div>

                <div className="question-content">
                  {currentQ.questionText}
                </div>

                {/* 🔥 MCQ */}
                {currentQ.questionType === "mcq" && (
                  <div className="options-grid">
                    {currentQ.options?.map((opt, i) => (
                      <button
                        key={i}
                        className={`option ${answers[currentQ.id] === opt ? "selected" : ""}`}
                        onClick={() => handleAnswer(currentQ.id, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* 🔥 IDENTIFICATION */}
                {currentQ.questionType === "identification" && (
                  <input
                    type="text"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  />
                )}

                {/* 🔥 ATTACHMENT */}
                {currentQ.questionType === "attachment" && (
                  <input
                    type="file"
                    onChange={(e) => handleAnswer(currentQ.id, e.target.files[0].name)}
                  />
                )}
              </>
            )}

            <div className="controls">
              <button 
                className="secondary-btn"
                onClick={() => setCurrent(prev => Math.max(prev - 1, 0))}
              >
                Previous
              </button>

              <button 
                className="primary-btn"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>

          </div>

          <div className="sidebar-panel">
            <div className="nav-grid">
              {questions.map((q, i) => (
                <button
                  key={i}
                  className={`nav-box ${answers[q.id] ? "answered" : ""}`}
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ExamAttempt;