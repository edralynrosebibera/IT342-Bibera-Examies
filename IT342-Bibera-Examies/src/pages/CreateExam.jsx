import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../assets/styles/CreateExam.css";
import "../assets/styles/StudentDashboard.css";

const CreateExam = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      image: null,
      type: '',
      options: [],
      answer: '',
      points: 0
    }
  ]);

  const [activeQuestion, setActiveQuestion] = useState(1);
  const navigate = useNavigate();

  const activeQ = questions.find(q => q.id === activeQuestion);

  const addQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([
      ...questions,
      { id: newId, text: '', image: null, type: '', options: [], answer: '', points: 0 }
    ]);
    setActiveQuestion(newId);
  };

  const updateQuestion = (field, value) => {
    const updated = questions.map(q =>
      q.id === activeQuestion ? { ...q, [field]: value } : q
    );
    setQuestions(updated);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateQuestion("image", url);
    }
  };

  const handleAnswerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateQuestion("answer", url);
    }
  };

  const setType = (type) => {
    const updated = questions.map(q => {
      if (q.id === activeQuestion) {
        if (type === "mcq") {
          return {
            ...q,
            type: "mcq",
            options: q.options.length ? q.options : ["Option 1"],
            answer: ""
          };
        } else if (type === "identification") {
          return {
            ...q,
            type: "identification",
            options: [],
            answer: ""
          };
        } else {
          return {
            ...q,
            type: "attachment",
            options: [],
            answer: ""
          };
        }
      }
      return q;
    });

    setQuestions(updated);
  };

  const addOption = () => {
    updateQuestion("options", [
      ...activeQ.options,
      `Option ${activeQ.options.length + 1}`
    ]);
  };

  const deleteOption = (index) => {
    const updatedOptions = activeQ.options.filter((_, i) => i !== index);
    updateQuestion("options", updatedOptions);

    if (activeQ.answer === activeQ.options[index]) {
      updateQuestion("answer", "");
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...activeQ.options];
    updatedOptions[index] = value;
    updateQuestion("options", updatedOptions);
  };

  const toggleCorrectAnswer = (optionText) => {
    updateQuestion("answer", optionText);
  };

  const handlePostExam = () => {
    console.log("POST EXAM:", questions);
  };

  const handleBack = () => {
    navigate("/teacher-dashboard");
  };

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">🎓</div>
          <span className="nav-brand">ExamHub</span>
        </div>

        <div className="nav-right">
          <button className="header-btn secondary" onClick={handleBack}>
            ← Back
          </button>

          <button className="header-btn primary" onClick={handlePostExam}>
            Post Exam
          </button>
        </div>
      </nav>

      <div className="dashboard-content">

        <header className="welcome-section">
          <h1>Create Exam</h1>
        </header>

        <div className="main-content">

          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="card-box">
              <h3>Exam Details</h3>

              <div className="input-group">
                <label>Exam Title</label>
                <input type="text" />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea rows="2"></textarea>
              </div>

              <div className="input-group">
                <label>Time Limit</label>
                <input type="number" />
              </div>
            </div>

            <div className="card-box">
              <h3>Questions</h3>

              {questions.map(q => (
                <div
                  key={q.id}
                  className={`question-item ${activeQuestion === q.id ? 'active' : ''}`}
                  onClick={() => setActiveQuestion(q.id)}
                >
                  Question {q.id}
                </div>
              ))}

              <button className="add-btn" onClick={addQuestion}>
                + Add Question
              </button>

              <button className="post-btn" onClick={handlePostExam}>
                Post Exam
              </button>
            </div>
          </aside>

          {/* EDITOR */}
          <main className="editor-area">
            <div className="editor-card">

              <div className="editor-header">
                <h3>Question {activeQuestion}</h3>

                <div className="points-input">
                  <input
                    type="number"
                    value={activeQ?.points || 0}
                    onChange={(e) => updateQuestion("points", e.target.value)}
                  />
                  <span>Points</span>
                </div>
              </div>

              {/* ✅ FIXED QUESTION INPUT */}
              <div className="input-group">
                <label>Type Question</label>
                <input
                  type="text"
                  value={activeQ?.text || ""}
                  onChange={(e) => updateQuestion("text", e.target.value)}
                  placeholder="Enter your question..."
                />
              </div>

              {/* IMAGE */}
              <div className="input-group">
                <label>Attach Image</label>
                <input type="file" id="img" hidden onChange={handleImageUpload} />
                <button className="upload-btn" onClick={() => document.getElementById("img").click()}>
                  Upload Image
                </button>
                {activeQ?.image && <img src={activeQ.image} className="image-preview" />}
              </div>

              {/* ANSWER TYPE */}
              <div className="answer-section">
                <label>Answer Type</label>

                <div className="button-group">
                  <button className={activeQ?.type === 'mcq' ? 'active-type' : ''} onClick={() => setType("mcq")}>
                    Multiple Choice
                  </button>

                  <button className={activeQ?.type === 'identification' ? 'active-type' : ''} onClick={() => setType("identification")}>
                    Identification
                  </button>

                  <button className={activeQ?.type === 'attachment' ? 'active-type' : ''} onClick={() => setType("attachment")}>
                    Attachment
                  </button>
                </div>
              </div>

              {/* MCQ */}
              {activeQ?.type === "mcq" && (
                <div className="mcq-section">
                  {activeQ.options.map((opt, i) => (
                    <div key={i} className="option-row">
                      <button
                        className={`check-btn ${activeQ.answer === opt ? 'checked' : ''}`}
                        onClick={() => toggleCorrectAnswer(opt)}
                      >
                        {activeQ.answer === opt ? '✔' : ''}
                      </button>

                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                      />

                      <button className="delete-opt-btn" onClick={() => deleteOption(i)}>
                        🗑️
                      </button>
                    </div>
                  ))}

                  <button className="add-option-btn" onClick={addOption}>
                    + Add Option
                  </button>
                </div>
              )}

              {/* IDENTIFICATION */}
              {activeQ?.type === "identification" && (
                <div className="input-group identification-box">
                  <label>Correct Answer</label>
                  <input
                    type="text"
                    value={activeQ.answer}
                    onChange={(e) => updateQuestion("answer", e.target.value)}
                  />
                </div>
              )}

              {/* ATTACHMENT */}
              {activeQ?.type === "attachment" && (
                <div className="input-group identification-box">
                  <label>Upload Answer File</label>

                  <input type="file" id="answerUpload" hidden onChange={handleAnswerUpload} />

                  <button className="upload-btn" onClick={() => document.getElementById("answerUpload").click()}>
                    Upload File
                  </button>

                  {activeQ.answer && <p>File attached ✔</p>}
                </div>
              )}

            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default CreateExam;