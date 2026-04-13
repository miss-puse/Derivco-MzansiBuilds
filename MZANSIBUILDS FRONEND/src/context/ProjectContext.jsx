import { createContext, useContext, useState, useEffect } from 'react'
import { useOptionalAuth } from './AuthContext'
import { projectService } from '../services/projectService'
import { commentService } from '../services/commentService'
import { progressService } from '../services/progressService'

const ProjectContext = createContext()

const normalizeMilestone = (milestone, index) => ({
  id: milestone?.id || milestone?.updateId || milestone?.update_id || milestone?.progressId || `M-${index}`,
  description: milestone?.description || milestone?.message || '',
  createdAt: milestone?.createdAt || milestone?.date || new Date().toISOString()
})

const normalizeComment = (comment, index) => ({
  id: comment?.id || comment?.commentId || comment?.comment_id || `C-${index}`,
  text: comment?.text || comment?.message || '',
  userName: comment?.userName || comment?.developer?.name || 'Developer',
  createdAt: comment?.createdAt || comment?.date || new Date().toISOString()
})

const normalizeProject = (project) => {
  const id = project?.id || project?.projectId
  const stageValue = project?.status || project?.stage || 'planning'
  const supportRaw = project?.supportRequired ?? project?.supportNeeded ?? project?.support_needed

  return {
    ...project,
    id,
    projectId: project?.projectId || id,
    status: stageValue,
    stage: stageValue,
    supportRequired: Boolean(supportRaw),
    supportNeeded: project?.supportNeeded || project?.support_needed || '',
    userId: project?.userId || project?.developer?.developerId || project?.developerId,
    userName: project?.userName || project?.developer?.name || 'Unknown Developer',
    tags: Array.isArray(project?.tags) ? project.tags : [],
    milestones: (project?.milestones || project?.progressUpdates || []).map(normalizeMilestone),
    comments: (project?.comments || project?.commentList || []).map(normalizeComment)
  }
}

const getProjectErrorMessage = (error) => {
  if (!error?.response) {
    return 'Cannot connect to the backend server. Ensure the API is running on http://localhost:8080.'
  }

  const data = error.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (typeof data?.message === 'string' && data.message.trim()) return data.message
  if (typeof data?.error === 'string' && data.error.trim()) return data.error

  if (error.response?.status >= 500) {
    return 'The server encountered an error. Please try again shortly.'
  }

  return 'Failed to load project data.'
}

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (!context) throw new Error('useProjects must be used within ProjectProvider')
  return context
}

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [projectError, setProjectError] = useState('')
  const auth = useOptionalAuth()
  const user = auth?.user || null

  useEffect(() => {
    loadProjects()
  }, [])

  const hydrateProjects = async (projectList) => {
    const normalizedProjects = projectList.map(normalizeProject)

    const hydratedProjects = await Promise.all(
      normalizedProjects.map(async (project) => {
        const projectKey = project.projectId || project.id

        try {
          const [commentsData, progressData] = await Promise.all([
            commentService.getCommentsByProject(projectKey),
            progressService.getProgressByProject(projectKey)
          ])

          return {
            ...project,
            comments: Array.isArray(commentsData) ? commentsData.map(normalizeComment) : [],
            milestones: Array.isArray(progressData) ? progressData.map(normalizeMilestone) : []
          }
        } catch (_) {
          // Keep project visible even if comment/progress lookups fail for one record.
          return project
        }
      })
    )

    return hydratedProjects
  }

  const loadProjects = async () => {
    try {
      setLoading(true)
      setProjectError('')
      const data = await projectService.getAllProjects()
      if (!Array.isArray(data)) {
        setProjects([])
        return
      }

      const hydrated = await hydrateProjects(data)
      setProjects(hydrated)
    } catch (error) {
      setProjectError(getProjectErrorMessage(error))
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    try {
      const backendProjectId = `PRJ-${Date.now()}`
      const newProject = await projectService.createProject({
        projectId: backendProjectId,
        title: projectData.title,
        description: projectData.description,
        stage: projectData.status || projectData.stage || 'planning',
        supportNeeded: projectData.supportRequired ? (projectData.supportNeeded || 'Collaboration requested') : '',
        tags: projectData.tags || [],
        developer: {
          developerId: user.id,
          name: user.name,
          email: user.email
        }
      })

      const normalizedProject = normalizeProject(newProject)
      setProjects(prev => [...prev, normalizedProject])
      return normalizedProject
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create project')
    }
  }

  const updateProject = async (projectId, updates) => {
    try {
      const currentProject = projects.find(p => p.id === projectId || p.projectId === projectId)
      const backendProjectId = currentProject?.projectId || projectId
      const payload = {
        ...updates,
        stage: updates.status || updates.stage,
        supportNeeded: updates.supportRequired ? (updates.supportNeeded || 'Collaboration requested') : ''
      }

      const updated = await projectService.updateProject(backendProjectId, payload)
      const normalizedUpdated = normalizeProject(updated)
      setProjects(prev => prev.map(p => (p.id === projectId || p.projectId === backendProjectId) ? normalizedUpdated : p))
      return normalizedUpdated
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update project')
    }
  }

  const deleteProject = async (projectId) => {
    try {
      const currentProject = projects.find(p => p.id === projectId || p.projectId === projectId)
      const backendProjectId = currentProject?.projectId || projectId
      await projectService.deleteProject(backendProjectId)
      setProjects(prev => prev.filter(p => p.id !== projectId && p.projectId !== backendProjectId))
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete project')
    }
  }

  const addMilestone = async (projectId, milestone) => {
    try {
      const currentProject = projects.find(p => p.id === projectId || p.projectId === projectId)
      const backendProjectId = currentProject?.projectId || projectId

      await progressService.createProgress({
        updateId: `UPD-${Date.now()}`,
        progressId: `PROG-${Date.now()}`,
        message: milestone.description,
        description: milestone.description,
        date: new Date().toISOString(),
        status: milestone.status || 'in-progress',
        project: { projectId: backendProjectId }
      })
      await loadProjects()
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add milestone')
    }
  }

  const addComment = async (projectId, commentText) => {
    try {
      const currentProject = projects.find(p => p.id === projectId || p.projectId === projectId)
      const backendProjectId = currentProject?.projectId || projectId

      await commentService.createComment({
        commentId: `CMT-${Date.now()}`,
        message: commentText,
        text: commentText,
        developer: {
          developerId: user.id,
          name: user.name
        },
        project: { projectId: backendProjectId }
      })
      await loadProjects()
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add comment')
    }
  }

  const requestCollaboration = async (projectId) => {
    if (!user) {
      throw new Error('You need to be logged in to request collaboration.')
    }

    await addComment(projectId, `${user.name} requested to collaborate on this project.`)
  }

  const getMyProjects = () => {
    return user ? projects.filter(p => p.userId === user.id) : []
  }

  const getCompletedProjects = () => {
    return projects.filter(p => p.status === 'completed')
  }

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      projectError,
      createProject,
      updateProject,
      deleteProject,
      addMilestone,
      addComment,
      requestCollaboration,
      getMyProjects,
      getCompletedProjects,
      loadProjects
    }}>
      {children}
    </ProjectContext.Provider>
  )
}
