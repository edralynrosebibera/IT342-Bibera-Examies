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
  const [exam, setExam] = useState(null);
  const [attemptStartTime, setAttemptStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getOptionText = (option) => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") return option.optionText ?? "";
    return "";
  };

  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 🔥 LOAD EXAM DETAILS
  useEffect(() => {
    const fetchExam = async () => {
      const res = await fetch(`http://localhost:8080/api/exams/${examId}`);
      const data = await res.json();
      setExam(data);
    };

    fetchExam();
  }, [examId]);

  // 🔥 LOAD QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(`http://localhost:8080/api/questions/exam/${examId}`);
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

      const res = await fetch(
        `http://localhost:8080/api/attempts/start?examId=${examId}&studentId=${user.id}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.status === "COMPLETED") {
        alert("You already submitted this exam");
        navigate("/student-dashboard");
        return;
      }

      setAttemptId(data.id);
      setAttemptStartTime(data.startTime || new Date().toISOString());
    };

    if (user?.email) startAttempt();
  }, [user, examId]);

  // 🔥 TIMER
  useEffect(() => {
    if (!exam?.timeLimit || !attemptStartTime) {
      return;
    }

    const updateTimer = () => {
      const startMillis = new Date(attemptStartTime).getTime();
      const limitSeconds = (exam.timeLimit || 0) * 60;
      const elapsedSeconds = Math.floor((Date.now() - startMillis) / 1000);
      const remaining = Math.max(limitSeconds - elapsedSeconds, 0);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [exam, attemptStartTime]);

  useEffect(() => {
    if (timeLeft === 0 && attemptId && !isSubmitting) {
      alert('Time is up! Submitting exam automatically.');
      handleSubmit();
    }
  }, [timeLeft, attemptId, isSubmitting]);

  // 🔥 LOAD SAVED ANSWERS
  useEffect(() => {
    const loadAnswers = async () => {
      const res = await fetch(
        `http://localhost:8080/api/attempts/${attemptId}`
      );
      const data = await res.json();

      let saved = {};
      data.forEach(a => {
        const selectedOptionValue =
          typeof a.selectedOption === "object"
            ? a.selectedOption?.optionText
            : a.selectedOption;

        saved[a.questionId] = a.textAnswer || selectedOptionValue || "";
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
    if (isSubmitting || !attemptId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(
        `http://localhost:8080/api/attempts/submit/${attemptId}`,
        { method: "PUT" }
      );

      alert("Exam submitted!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="timer-status">
            <div>
              <span className="timer-label">Time limit:</span>
              <strong>{exam?.timeLimit ? `${exam.timeLimit} min` : "No limit"}</strong>
            </div>
            <div>
              <span className="timer-label">Time left:</span>
              <strong>{timeLeft !== null ? formatTime(timeLeft) : "--:--"}</strong>
            </div>
          </div>

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
                    {currentQ.options?.map((opt, i) => {
                      const optionText = getOptionText(opt);

                      return (
                        <button
                          key={opt?.id ?? i}
                          className={`option ${answers[currentQ.id] === optionText ? "selected" : ""}`}
                          onClick={() => handleAnswer(currentQ.id, optionText)}
                        >
                          {optionText || `Option ${i + 1}`}
                        </button>
                      );
                    })}
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