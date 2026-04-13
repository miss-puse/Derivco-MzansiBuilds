import { useProjects } from '../context/ProjectContext'
import { Link } from 'react-router-dom'

const CelebrationWall = () => {
  const { getCompletedProjects } = useProjects()
  const completedProjects = getCompletedProjects()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">Celebration Wall</h1>
          <p className="text-xl text-gray-700">
            Celebrating developers who built in public and completed their projects!
          </p>
        </div>

        {completedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No completed projects yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map(project => (
              <div
                key={project.id}
                className="bg-white border-4 border-primary rounded-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 text-center font-bold">COMPLETED</div>
                
                <h3 className="text-2xl font-bold text-black mb-2 text-center">
                  {project.title}
                </h3>
                
                <p className="text-center text-primary font-semibold mb-4">
                  by {project.userName}
                </p>
                
                <p className="text-gray-700 mb-4 text-center">
                  {project.description.substring(0, 100)}...
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {project.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-primary text-white px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-center text-sm text-gray-600 mb-4">
                  {project.milestones?.length || 0} milestones achieved
                </div>
                
                <Link
                  to={`/project/${project.id}`}
                  className="block text-center bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition"
                >
                  View Project
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Complete your project to join the celebration wall!
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CelebrationWall
