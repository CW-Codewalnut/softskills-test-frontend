import { useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'
import './HrDashboardPage.css'
import { inviteCandidate } from '../services/accessService'

const evaluationOptions = [
  {
    id: 'listening',
    title: 'Listening Test',
    description: 'Review answers, provide qualitative feedback, and assign a score.',
    action: '/listening-test',
  },
  {
    id: 'behaviour',
    title: 'Behaviour Test',
    description: 'Walk through each behaviour dimension and record evaluations.',
    action: '/behaviour-test',
  },
]

const generateAccessCode = () =>
  Array.from({ length: 8 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(
      Math.floor(Math.random() * 36),
    ),
  ).join('')

const HrDashboardPage = ({ user }) => {
  const navigate = useNavigate()
  const displayName = user?.fullName || user?.email || 'HR'
  const [email, setEmail] = useState('')
  const [accessCode, setAccessCode] = useState(generateAccessCode())
  const [audioFile, setAudioFile] = useState(null)
  const [questionSetFile, setQuestionSetFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const audioInputRef = useRef(null)
  const questionInputRef = useRef(null)

  const handleNavigate = (path) => {
    navigate(path)
  }

  const handleGenerateCode = () => {
    setAccessCode(generateAccessCode())
  }

  const handleAudioSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const handleQuestionSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setQuestionSetFile(file)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setError('Please provide a candidate email.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccessMessage('')

      await inviteCandidate({
        email,
        accessCode,
        audioFile,
        questionSetFile,
      })

      setSuccessMessage('Invitation sent. Candidate will receive an email shortly.')
      setAudioFile(null)
      setQuestionSetFile(null)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const accessCodeDisplay = useMemo(() => accessCode, [accessCode])

  return (
    <section className="hr-dashboard">
      <header className="hr-dashboard__header">
        <div>
          <p className="hr-dashboard__eyebrow">HR Evaluation Suite</p>
          <h1>Welcome back, {displayName}</h1>
          <p className="hr-dashboard__subcopy">
            Invite candidates to the assessments and manage your evaluation tasks.
          </p>
        </div>
      </header>

      <div className="hr-dashboard__grid">
        <form className="hr-invite" onSubmit={handleSubmit}>
          <div className="hr-invite__row">
            <label>
              Candidate email
              <input
                type="email"
                value={email}
                placeholder="candidate@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="hr-invite__row">
            <label>
              Access code
              <div className="access-code-input">
                <input type="text" value={accessCodeDisplay} readOnly />
                <button
                  type="button"
                  className="access-code-generate"
                  onClick={handleGenerateCode}
                  aria-label="Generate access code"
                >
                  ↻
                </button>
              </div>
            </label>
          </div>

          <div className="hr-invite__row hr-invite__actions">
            <div className="upload-buttons">
              <button
                type="button"
                className="upload-btn"
                onClick={() => audioInputRef.current?.click()}
              >
                Add Audio clip
              </button>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleAudioSelect}
              />
              {audioFile && <p className="file-chip">{audioFile.name}</p>}

              <button
                type="button"
                className="upload-btn"
                onClick={() => questionInputRef.current?.click()}
              >
                Question set
              </button>
              <input
                ref={questionInputRef}
                type="file"
                accept=".json,.csv"
                style={{ display: 'none' }}
                onChange={handleQuestionSelect}
              />
              {questionSetFile && <p className="file-chip">{questionSetFile.name}</p>}
            </div>
          </div>

          {error && (
            <p className="hr-invite__message hr-invite__message--error">{error}</p>
          )}
          {successMessage && (
            <p className="hr-invite__message hr-invite__message--success">
              {successMessage}
            </p>
          )}

          <button type="submit" className="hr-invite__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending invite...' : 'Submit'}
          </button>
        </form>

        <div className="hr-dashboard__cards">
          {evaluationOptions.map((option) => (
            <article key={option.id} className="hr-dashboard__card">
              <div>
                <h2>{option.title}</h2>
                <p>{option.description}</p>
              </div>
              <button onClick={() => handleNavigate(option.action)}>
                Open {option.title}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HrDashboardPage

