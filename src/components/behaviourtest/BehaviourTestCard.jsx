import { useNavigate } from 'react-router-dom'

const BehaviourTestCard = () => {
  const navigate = useNavigate()

  return (
    <article className="test-card">
      <h2>Behaviour Test</h2>
      <p>
        Explore how you respond to dynamic workplace situations, cues, and
        decision-making prompts.
      </p>
      <button type="button" onClick={() => navigate('/behaviour-test')}>
        Start Behaviour Test
      </button>
    </article>
  )
}

export default BehaviourTestCard

