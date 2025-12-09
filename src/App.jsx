import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import StartupDialog from './components/StartupDialog'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AppRoutes from './routes'
import { requestAccess } from './services/accessService'

function App() {
  const navigate = useNavigate()
  const [hasAccess, setHasAccess] = useState(false)
  const [formValues, setFormValues] = useState({ email: '', code: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    document.body.style.overflow = hasAccess ? 'auto' : 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [hasAccess])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleStartupSubmit = async (event) => {
    event.preventDefault()
    if (!formValues.email.trim() || !formValues.code.trim()) {
      setError('Please provide both your email and access code.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const authenticatedUser = await requestAccess(formValues)
      const role = authenticatedUser?.role?.toUpperCase()

      setUser(authenticatedUser)
      setHasAccess(true)

      if (role === 'HR') {
        navigate('/hr-dashboard')
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard')
      } else {
        navigate('/')
      }
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-wrapper">
      <Header />
      <AppRoutes user={user} />
      <Footer />
      {!hasAccess && (
        <StartupDialog
          values={formValues}
          error={error}
          onChange={handleInputChange}
          onSubmit={handleStartupSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

export default App
