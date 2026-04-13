import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md text-black shadow-sm border-b border-black/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent">
              MzansiBuilds
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/feed" className="text-black/70 hover:text-black transition font-medium">Feed</Link>
              <Link to="/celebration" className="text-black/70 hover:text-black transition font-medium">Celebration</Link>
              {user && (
                <>
                  <Link to="/dashboard" className="text-black/70 hover:text-black transition font-medium">Dashboard</Link>
                  <Link to="/my-projects" className="text-black/70 hover:text-black transition font-medium">My Projects</Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="text-black/70 hover:text-black transition font-medium">
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary-dark to-primary text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-black/70 hover:text-black transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-dark to-primary text-white px-6 py-2 rounded-lg hover:shadow-lg transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
