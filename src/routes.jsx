import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ListeningTestPage from './pages/ListeningTestPage'
import BehaviourTestPage from './pages/BehaviourTestPage'
import HrDashboardPage from './pages/HrDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

const AppRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listening-test" element={<ListeningTestPage user={user} />} />
      <Route path="/behaviour-test" element={<BehaviourTestPage />} />
      <Route path="/hr-dashboard" element={<HrDashboardPage user={user} />} />
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
    </Routes>
  )
}

export default AppRoutes

