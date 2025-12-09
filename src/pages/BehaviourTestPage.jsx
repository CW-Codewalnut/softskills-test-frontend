import { useState } from 'react'
import { Link } from 'react-router-dom'
import './BehaviourTestPage.css'
import questions from '../data/behaviourQuestions.json'

const BehaviourTestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showSubmit, setShowSubmit] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / totalQuestions) * 100)

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [questionId]: value,
      }
      // Show submit button when all questions are answered
      if (Object.keys(updated).length === totalQuestions) {
        setShowSubmit(true)
      }
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted answers:', answers)
    setShowCompletionModal(true)
  }

  const handleCompletionOk = () => {
    setShowCompletionModal(false)
    window.location.href = '/'
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = answers[currentQ.id] !== undefined

  return (
    <div className="behaviour-page">
      <header className="behaviour-header">
        <div>
          <p className="eyebrow">Behavioural Assessment</p>
          <h1>Answer the following scenario-based questions</h1>
          <p className="subtitle">
            Demonstrate your decision-making and problem-solving abilities
          </p>
        </div>
        <Link className="ghost-link" to="/">
          ← Back to tests
        </Link>
      </header>

      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-text">
            {progress}% Complete ({answeredCount}/{totalQuestions})
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <form className="behaviour-form" onSubmit={handleSubmit}>
        <div className="question-section">
          <div className="question-header">
            <span className="question-number">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>

          <div className="question-content">
            <div className="scenario-box">
              <p className="scenario-label">Scenario:</p>
              <p className="scenario-text">{currentQ.scenario}</p>
            </div>

            <h2 className="question-prompt">{currentQ.prompt}</h2>

            <div className="options">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`option-row ${
                    answers[currentQ.id] === `option-${index}`
                      ? 'selected'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={currentQ.id}
                    value={`option-${index}`}
                    checked={answers[currentQ.id] === `option-${index}`}
                    onChange={(e) =>
                      handleAnswerChange(currentQ.id, e.target.value)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="navigation-buttons">
            <button
              type="button"
              className="nav-button"
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            {currentQuestion < totalQuestions - 1 ? (
              <button
                type="button"
                className="nav-button primary"
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(totalQuestions - 1, prev + 1)
                  )
                }
                disabled={!isAnswered}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="nav-button primary submit-button"
                disabled={!showSubmit || answeredCount < totalQuestions}
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </form>

      {showCompletionModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <p className="eyebrow">Behavioural Assessment</p>
            <h2>Thank you!</h2>
            <p className="subtitle">
              Your responses have been submitted. You may now return to the test
              list.
            </p>
            <button type="button" onClick={handleCompletionOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BehaviourTestPage

