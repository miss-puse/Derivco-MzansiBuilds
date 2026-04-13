import { useState } from 'react'
import { useProjects } from '../context/ProjectContext'
import ProjectCard from '../components/ProjectCard'

const Feed = () => {
  const { projects, projectError } = useProjects()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = projects
    .filter(p => {
      if (filter === 'all') return true
      if (filter === 'collaboration') return p.supportRequired
      return p.status === filter
    })
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-black mb-8">Project Feed</h1>

      {projectError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {projectError}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-white border-2 border-black'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('planning')}
            className={`px-4 py-2 rounded ${filter === 'planning' ? 'bg-primary text-white' : 'bg-white border-2 border-black'}`}
          >
            Planning
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded ${filter === 'in-progress' ? 'bg-primary text-white' : 'bg-white border-2 border-black'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('collaboration')}
            className={`px-4 py-2 rounded ${filter === 'collaboration' ? 'bg-primary text-white' : 'bg-white border-2 border-black'}`}
          >
            Seeking Help
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p className="text-xl">No projects found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Feed
