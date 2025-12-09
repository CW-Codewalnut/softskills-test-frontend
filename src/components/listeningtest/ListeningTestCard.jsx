import { useNavigate } from 'react-router-dom'

const ListeningTestCard = () => {
  const navigate = useNavigate()

  return (
    <article className="test-card">
      <h2>Listening Test</h2>
      <p>
        Measure how well you understand spoken prompts in various scenarios and
        contexts.
      </p>
      <button type="button" onClick={() => navigate('/listening-test')}>
        Start Listening Test
      </button>
    </article>
  )
}

export default ListeningTestCard

