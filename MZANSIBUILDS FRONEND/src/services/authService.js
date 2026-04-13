import api from './api'

const generateDeveloperId = () => `DEV-${Date.now()}`

export const authService = {
  async register(userData) {
    const payload = {
      developerId: userData.developerId || generateDeveloperId(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phone?.trim(),
      role: userData.role || 'DEVELOPER'
    }

    if (!payload.phoneNumber) {
      delete payload.phoneNumber
    }

    const response = await api.post('/mzansi/developers/register', payload)
    return response.data
  },

  async login(email, password) {
    const response = await api.post('/mzansi/developers/login', {
      email,
      password
    })
    return response.data
  },

  async getProfile(developerId) {
    const response = await api.get(`/mzansi/developers/find/${developerId}`)
    return response.data
  },

  async updateProfile(developerId, updates) {
    const response = await api.put(`/mzansi/developers/update/${developerId}`, updates)
    return response.data
  },

  async getAllDevelopers() {
    const response = await api.get('/mzansi/developers/all')
    return response.data
  },

  async forgotPassword(email) {
    const response = await api.post('/mzansi/developers/forgot-password', { email })
    return response.data
  },

  async resetPassword(token, newPassword) {
    const response = await api.post('/mzansi/developers/reset-password', { token, newPassword })
    return response.data
  }
}
