import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProjects } from '../context/ProjectContext'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'

const ProjectDetail = () => {
  const { id } = useParams()
  const { projects, addComment, requestCollaboration } = useProjects()
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [localProject, setLocalProject] = useState(null)
  const [isLoadingProject, setIsLoadingProject] = useState(false)
  
  const project = projects.find(p => p.id === id) || localProject

  useEffect(() => {
    let isMounted = true

    const loadProjectById = async () => {
      if (project) return
      if (!id) return

      try {
        setIsLoadingProject(true)
        const data = await projectService.getProject(id)
        if (!isMounted || !data) return

        const stageValue = data?.status || data?.stage || 'planning'
        const supportRaw = data?.supportRequired ?? data?.supportNeeded ?? data?.support_needed
        setLocalProject({
          ...data,
          id: data?.id || data?.projectId || id,
          projectId: data?.projectId || data?.id || id,
          status: stageValue,
          stage: stageValue,
          supportRequired: Boolean(supportRaw),
          supportNeeded: data?.supportNeeded || data?.support_needed || '',
          userId: data?.userId || data?.developer?.developerId || data?.developerId,
          userName: data?.userName || data?.developer?.name || 'Unknown Developer',
          tags: Array.isArray(data?.tags) ? data.tags : [],
          milestones: [],
          comments: []
        })
      } catch (_) {
        // Keep existing not-found view if backend lookup fails.
      } finally {
        if (isMounted) setIsLoadingProject(false)
      }
    }

    loadProjectById()
    return () => {
      isMounted = false
    }
  }, [id, project])

  if (isLoadingProject && !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xl">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-xl">Project not found</p>
      </div>
    )
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    setError('')
    if (comment.trim() && user) {
      try {
        await addComment(id, comment)
        setComment('')
      } catch (err) {
        setError(err?.message || 'Failed to post comment. Please try again.')
      }
    }
  }

  const handleCollaborationRequest = async () => {
    setError('')
    if (user) {
      try {
        await requestCollaboration(id)
        alert('Collaboration request sent!')
      } catch (err) {
        setError(err?.message || 'Failed to send collaboration request.')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-gray-500'
      case 'in-progress': return 'bg-primary'
      case 'completed': return 'bg-primary'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white border-2 border-black rounded-lg p-8 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-black">{project.title}</h1>
          <span className={`${getStatusColor(project.status)} text-white px-4 py-2 rounded`}>
            {project.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">By {project.userName}</p>
        <p className="text-gray-700 mb-6">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags?.map((tag, index) => (
            <span key={index} className="bg-primary text-white px-3 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {project.supportRequired && user && user.id !== project.userId && (
          <button
            onClick={handleCollaborationRequest}
            className="bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-primary-dark transition"
          >
            Raise Hand for Collaboration
          </button>
        )}

        {user && user.id === project.userId && (
          <Link
            to={`/edit-project/${project.id}`}
            className="inline-block bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Edit Project
          </Link>
        )}
      </div>

      <div className="bg-white border-2 border-black rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Milestones ({project.milestones?.length || 0})</h2>
        
        {project.milestones?.length === 0 ? (
          <p className="text-gray-600">No milestones yet</p>
        ) : (
          <div className="space-y-4">
            {project.milestones?.map((milestone, index) => (
              <div key={milestone.id} className="flex gap-4 p-4 bg-gray-50 rounded">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{milestone.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(milestone.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border-2 border-black rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({project.comments?.length || 0})</h2>

        {user && (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary mb-2"
              rows="3"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-primary-dark transition"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {project.comments?.length === 0 ? (
            <p className="text-gray-600">No comments yet</p>
          ) : (
            project.comments?.map(c => (
              <div key={c.id} className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{c.userName}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
