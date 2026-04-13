import api from './api'

export const commentService = {
  async createComment(commentData) {
    const response = await api.post('/comment/create', commentData)
    return response.data
  },

  async getCommentsByProject(projectId) {
    const response = await api.get(`/comment/project/${projectId}`)
    return response.data
  }
}
