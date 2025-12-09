import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './ListeningTestPage.css'
import listeningQuestions from '../data/listeningQuestions.json'
import { submitListeningResponses } from '../services/accessService'

const ListeningTestPage = ({ user }) => {
  const [showInstructions, setShowInstructions] = useState(true)
  const [playsRemaining, setPlaysRemaining] = useState(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasCompletedAudio, setHasCompletedAudio] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const audioRef = useRef(null)
  const maxTimeRef = useRef(0)

  const handleAudioPlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playsRemaining === 0) {
      audio.pause()
      audio.currentTime = 0
      return
    }

    if (audio.currentTime < 0.05) {
      maxTimeRef.current = 0
    }

    setIsPlaying(true)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.currentTime > maxTimeRef.current) {
      maxTimeRef.current = audio.currentTime
    }
  }

  const handleSeeking = () => {
    const audio = audioRef.current
    if (!audio) return

    const allowedTime = maxTimeRef.current
    if (audio.currentTime + 0.1 < allowedTime) {
      audio.currentTime = allowedTime
    }
  }

  const handleEnded = () => {
    maxTimeRef.current = 0
    setIsPlaying(false)
    setPlaysRemaining((prev) => Math.max(prev - 1, 0))
    setHasCompletedAudio(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const handleWrittenChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }))
  }

  const playbackLimitReached = playsRemaining === 0 && !isPlaying
  const canShowQuestions = hasCompletedAudio && !isPlaying

  const handleSubmitResponses = async () => {
    // Optional: ensure all MCQs are answered before submitting
    const totalMcq = listeningQuestions.mcq.length
    const answeredMcq = listeningQuestions.mcq.filter(q => answers[q.id]).length

    if (answeredMcq < totalMcq) {
      setSubmitError('Please answer all multiple choice questions before submitting.')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const mcqAnswers = listeningQuestions.mcq.map((question) => {
        const selected = answers[question.id] || ''
        const trimmed = selected.trim()
        const choiceLetter =
          trimmed && trimmed.includes('.') ? trimmed.charAt(0) : null

        return {
          id: question.id,
          answer: choiceLetter,
        }
      })

      const writtenAnswers = listeningQuestions.written.map((question) => ({
        id: question.id,
        answer: answers[question.id] || '',
      }))

      const payload = {
        userId: user?.id || 1,
        mcq: mcqAnswers,
        written: writtenAnswers,
      }

      await submitListeningResponses(payload)
      setShowCompletionModal(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompletionOk = () => {
    setShowCompletionModal(false)
    window.location.href = '/'
  }

  return (
    <div className="listening-page">
      {showInstructions && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <p className="eyebrow">Before you begin</p>
            <h2>Listening Test Instructions</h2>
            <ol className="modal-list">
              <li>Listen to the audio carefully before selecting answers.</li>
              <li>The audio can only be played twice, so plan your listens.</li>
              <li>Take quick notes while listening for key details.</li>
              <li>Answer every question before submitting your responses.</li>
            </ol>
            <button type="button" onClick={() => setShowInstructions(false)}>
              I understand, start test
            </button>
          </div>
        </div>
      )}
      {showCompletionModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <p className="eyebrow">Active Listening</p>
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

      <header className="listening-header">
        <div className="listening-header-content">
          <h1>Active Listening</h1>
          <p className="subtitle">
            Hear the audio briefing and respond to the follow-up questions based
            on what you understood.
          </p>
        </div>
        <Link className="ghost-link" to="/">
          ← Back to tests
        </Link>
      </header>

      <div className="listening-layout">
        <nav className="listening-nav" aria-label="Listening test sections">
          <div>
            <p className="nav-label">Sections</p>
            <a href="#audio-section">Audio briefing</a>
            <a href="#questions-section">Comprehension questions</a>
          </div>
        </nav>

        <section className="listening-content">
          <article id="audio-section" className="listening-panel">
            <div className="panel-title-row">
              <h2>Audio briefing</h2>
              <div className="play-count" aria-live="polite">
                {playsRemaining}
              </div>
            </div>
            <p>
              Play the clip. You can replay it, but twice.
            </p>
            <div className="audio-wrapper">
              <audio
                ref={audioRef}
                controls
                preload="none"
                src="/listening-audio.mp3"
                onPlay={handleAudioPlay}
                onTimeUpdate={handleTimeUpdate}
                onSeeking={handleSeeking}
                onEnded={handleEnded}
                onPause={handlePause}
                aria-disabled={playsRemaining === 0}
              >
                Your browser does not support the audio element.
              </audio>
              {playbackLimitReached && (
                <div className="audio-disabled">Playback limit reached</div>
              )}
            </div>
          </article>

          {canShowQuestions && (
            <article id="questions-section" className="listening-panel">
              <h2>Comprehension questions</h2>
              <p className="panel-subtitle">
                Answer based on the information you heard in the audio briefing.
              </p>
              <ol className="questions-list">
                {listeningQuestions.mcq.map((question) => (
                  <li key={question.id}>
                    <span className="question-text">{question.prompt}</span>
                    <div className="options">
                      {question.options.map((option) => (
                        <label key={option} className="option-row">
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={() =>
                              handleOptionChange(question.id, option)
                            }
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>

              {listeningQuestions.written.map((question) => (
                <label key={question.id} className="text-question">
                  <span>{question.prompt}</span>
                  <textarea
                    rows="4"
                    placeholder="Type your response here..."
                    value={answers[question.id] || ''}
                    onChange={(e) => handleWrittenChange(question.id, e.target.value)}
                  />
                </label>
              ))}
              {submitError && (
                <p className="form-error" role="alert">
                  {submitError}
                </p>
              )}
              <button
                type="button"
                onClick={handleSubmitResponses}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit responses'}
              </button>
            </article>
          )}
        </section>
      </div>
    </div>
  )
}

export default ListeningTestPage

