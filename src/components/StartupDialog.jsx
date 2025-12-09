import './StartupDialog.css'

const StartupDialog = ({
  values,
  error,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className="startup-overlay">
      <div className="startup-modal">
        <p className="eyebrow">CodeWalnut Skill Hub</p>
        <h2>Unlock Skill Tests</h2>
        <p className="startup-copy">
          Enter your participant details to access the Listening and Behaviour
          assessments.
        </p>

        <form className="startup-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={onChange}
            />
          </label>
          <label>
            Access code
            <input
              type="text"
              name="code"
              placeholder="Access code"
              value={values.code}
              onChange={onChange}
            />
          </label>
          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying access...' : 'Continue to Skill Tests'}
          </button>
        </form>

        <p className="startup-footnote">
          Need help? Contact your CodeWalnut facilitator.
        </p>
      </div>
    </div>
  )
}

export default StartupDialog

