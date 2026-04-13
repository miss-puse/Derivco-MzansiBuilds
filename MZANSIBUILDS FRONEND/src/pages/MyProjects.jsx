import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'
import ProjectCard from '../components/ProjectCard'

const MyProjects = () => {
  const { getMyProjects, deleteProject, projectError } = useProjects()
  const myProjects = getMyProjects()
  const [actionError, setActionError] = useState('')

  const handleDelete = async (projectId) => {
    setActionError('')
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId)
      } catch (err) {
        setActionError(err?.message || 'Failed to delete project. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black">My Projects</h1>
        <Link
          to="/create-project"
          className="bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-primary-dark transition"
        >
          + New Project
        </Link>
      </div>

      {projectError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {projectError}
        </div>
      )}

      {actionError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {actionError}
        </div>
      )}

      {myProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">You haven't created any projects yet</p>
          <Link
            to="/create-project"
            className="inline-block bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-primary-dark transition"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map(project => (
            <div key={project.id} className="relative">
              <ProjectCard project={project} />
              <div className="mt-2 flex gap-2">
                <Link
                  to={`/edit-project/${project.id}`}
                  className="flex-1 text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProjects
