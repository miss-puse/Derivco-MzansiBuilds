import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('mzansi_user') || 'null')
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ''
    const isAuthRequest = requestUrl.includes('/login') || requestUrl.includes('/register')
    const hasStoredUser = Boolean(localStorage.getItem('mzansi_user'))

    if (error.response?.status === 401 && hasStoredUser && !isAuthRequest) {
      localStorage.removeItem('mzansi_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
