import { Link } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-gray-500'
      case 'in-progress': return 'bg-primary'
      case 'completed': return 'bg-primary'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6 hover:shadow-xl transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-black">{project.title}</h3>
        <span className={`${getStatusColor(project.status)} text-white px-3 py-1 rounded text-sm`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags?.map((tag, index) => (
          <span key={index} className="bg-primary text-white px-2 py-1 rounded text-sm">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>By {project.userName}</span>
        <span>{project.milestones?.length || 0} milestones</span>
      </div>
      
      {project.supportRequired && (
        <div className="mt-4 text-sm text-primary font-semibold">
          Looking for collaboration
        </div>
      )}
      
      <Link
        to={`/project/${project.id}`}
        className="mt-4 block text-center bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        View Details
      </Link>
    </div>
  )
}

export default ProjectCard
