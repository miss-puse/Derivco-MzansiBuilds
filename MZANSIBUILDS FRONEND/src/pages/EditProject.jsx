import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'

const EditProject = () => {
  const { id } = useParams()
  const { projects, updateProject, addMilestone } = useProjects()
  const navigate = useNavigate()
  
  const project = projects.find(p => p.id === id)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    supportRequired: false,
    tags: ''
  })
  
  const [milestone, setMilestone] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        supportRequired: project.supportRequired,
        tags: project.tags?.join(', ') || ''
      })
    }
  }, [project])

  if (!project) {
    return <div className="text-center py-12">Project not found</div>
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const projectData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    try {
      await updateProject(id, projectData)
      navigate('/my-projects')
    } catch (err) {
      setError(err?.message || 'Failed to update project. Please try again.')
    }
  }

  const handleAddMilestone = async (e) => {
    e.preventDefault()
    setError('')
    if (milestone.trim()) {
      try {
        await addMilestone(id, { description: milestone })
        setMilestone('')
      } catch (err) {
        setError(err?.message || 'Failed to add milestone. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-black mb-8">Edit Project</h1>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-lg p-8 mb-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
            rows="5"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Current Stage</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="supportRequired"
              checked={formData.supportRequired}
              onChange={handleChange}
              className="mr-2 w-5 h-5"
            />
            <span className="text-gray-700 font-semibold">Looking for collaboration/support</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary-dark transition"
        >
          Update Project
        </button>
      </form>

      <div className="bg-white border-2 border-black rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Milestones</h2>
        
        <form onSubmit={handleAddMilestone} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Add a new milestone..."
              className="flex-1 px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {project.milestones?.length === 0 ? (
            <p className="text-gray-600">No milestones yet</p>
          ) : (
            project.milestones?.map((m, index) => (
              <div key={m.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <span className="text-primary font-bold">{index + 1}.</span>
                <div className="flex-1">
                  <p>{m.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default EditProject
