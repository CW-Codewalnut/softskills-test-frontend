import './Home.css'
import BehaviourTestCard from '../components/behaviourtest/BehaviourTestCard'
import ListeningTestCard from '../components/listeningtest/ListeningTestCard'

const Home = () => (
  <main className="app-shell">
    <header>
      <p className="eyebrow">Welcome to Walnut Sense</p>
      <h1>Skill Tests</h1>
      <p className="subtitle">
        Choose the assessment you would like to do today.
      </p>
    </header>

    <section className="cards">
      <ListeningTestCard />
      <BehaviourTestCard />
    </section>
  </main>
)

export default Home

