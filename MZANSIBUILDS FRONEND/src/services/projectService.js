import api from './api'

export const projectService = {
  async createProject(projectData) {
    const response = await api.post('/mzansi/projects/create', projectData)
    return response.data
  },

  async getAllProjects() {
    const response = await api.get('/mzansi/projects/all')
    return response.data
  },

  async getProject(projectId) {
    const response = await api.get(`/mzansi/projects/find/${projectId}`)
    return response.data
  },

  async updateProject(projectId, updates) {
    const response = await api.put(`/mzansi/projects/update/${projectId}`, updates)
    return response.data
  },

  async deleteProject(projectId) {
    await api.delete(`/mzansi/projects/delete/${projectId}`)
  },

  async getProjectsByDeveloper(developerId) {
    const response = await api.get(`/mzansi/projects/developer/${developerId}`)
    return response.data
  },

  async getCompletedProjects() {
    const response = await api.get('/mzansi/projects/completed')
    return response.data
  }
}
