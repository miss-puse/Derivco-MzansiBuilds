import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProjects } from '../context/ProjectContext'

const Dashboard = () => {
  const { user } = useAuth()
  const { getMyProjects, projectError } = useProjects()
  const myProjects = getMyProjects()

  const activeProjects = myProjects.filter(p => p.status !== 'completed')
  const completedProjects = myProjects.filter(p => p.status === 'completed')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Keep building and sharing your journey</p>
      </div>

      {projectError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {projectError}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="text-3xl font-bold text-primary">{myProjects.length}</div>
          <div className="text-gray-700">Total Projects</div>
        </div>
        
        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="text-3xl font-bold text-primary">{activeProjects.length}</div>
          <div className="text-gray-700">Active Projects</div>
        </div>
        
        <div className="bg-white border-2 border-black rounded-lg p-6">
          <div className="text-3xl font-bold text-primary">{completedProjects.length}</div>
          <div className="text-gray-700">Completed</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/create-project"
          className="bg-primary text-white p-8 rounded-lg hover:bg-primary-dark transition text-center"
        >
          <div className="text-4xl mb-2">+</div>
          <div className="text-xl font-semibold">Start New Project</div>
        </Link>
        
        <Link
          to="/my-projects"
          className="bg-black text-white p-8 rounded-lg hover:bg-gray-800 transition text-center"
        >
          <div className="text-4xl mb-2">Projects</div>
          <div className="text-xl font-semibold">View My Projects</div>
        </Link>
        
        <Link
          to="/feed"
          className="bg-white border-2 border-black p-8 rounded-lg hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-2">Feed</div>
          <div className="text-xl font-semibold">Explore Feed</div>
        </Link>
        
        <Link
          to="/celebration"
          className="bg-white border-2 border-black p-8 rounded-lg hover:shadow-lg transition text-center"
        >
          <div className="text-4xl mb-2">Wall</div>
          <div className="text-xl font-semibold">Celebration Wall</div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
