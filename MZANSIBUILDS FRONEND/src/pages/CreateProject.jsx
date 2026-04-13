import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    supportRequired: false,
    tags: ''
  })
  const { createProject } = useProjects()
  const navigate = useNavigate()
  const [error, setError] = useState('')

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
      await createProject(projectData)
      navigate('/my-projects')
    } catch (err) {
      setError(err?.message || 'Failed to create project. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-black mb-8">Create New Project</h1>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-2 border-black rounded-lg p-8">
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
            placeholder="e.g. React, Node.js, API"
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

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded font-semibold hover:bg-primary-dark transition"
          >
            Create Project
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-white border-2 border-black py-3 rounded font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProject
