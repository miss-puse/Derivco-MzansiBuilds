import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Feed from './pages/Feed'
import MyProjects from './pages/MyProjects'
import CreateProject from './pages/CreateProject'
import EditProject from './pages/EditProject'
import ProjectDetail from './pages/ProjectDetail'
import CelebrationWall from './pages/CelebrationWall'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="feed" element={<Feed />} />
              <Route path="celebration" element={<CelebrationWall />} />
              <Route path="project/:id" element={<ProjectDetail />} />
              
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
              <Route path="create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
              <Route path="edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
