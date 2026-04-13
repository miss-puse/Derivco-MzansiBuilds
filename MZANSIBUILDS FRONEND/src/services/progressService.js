import api from './api'

export const progressService = {
  async createProgress(progressData) {
    const response = await api.post('/mzansi/progress/create', progressData)
    return response.data
  },

  async getProgressByProject(projectId) {
    const response = await api.get(`/mzansi/progress/project/${projectId}`)
    return response.data
  }
}
