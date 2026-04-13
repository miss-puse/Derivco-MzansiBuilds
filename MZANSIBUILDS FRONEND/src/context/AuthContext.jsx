import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(undefined)

const getResponseMessage = (error) => {
  const data = error?.response?.data
  if (typeof data === 'string') return data
  if (typeof data?.message === 'string') return data.message
  if (typeof data?.error === 'string') return data.error
  if (Array.isArray(data?.errors)) {
    return data.errors
      .map((item) => item?.defaultMessage || item?.message || item?.field)
      .filter(Boolean)
      .join(', ')
  }
  if (data && typeof data === 'object') {
    const values = Object.values(data)
      .filter((value) => typeof value === 'string' && value.trim())
    if (values.length) return values.join(', ')
  }
  return ''
}

const normalizeAuthError = (error, action) => {
  const status = error?.response?.status
  const message = getResponseMessage(error).toLowerCase()

  if (!error?.response) {
    return 'Cannot reach the server. Please check your internet connection and try again.'
  }

  if (action === 'login') {
    if (status === 401 || status === 403 || /invalid|credential|unauthor|forbidden|password/.test(message)) {
      return 'Incorrect email or password.'
    }
    if (status >= 500) {
      return 'Login failed due to a server error. Please try again shortly.'
    }
    return 'Login failed. Please check your details and try again.'
  }

  if (action === 'register') {
    if (message) {
      return getResponseMessage(error)
    }
    if (status === 409 || /exist|already|duplicate|taken/.test(message)) {
      return 'An account with this email already exists.'
    }
    if (/password|weak|short|min/.test(message)) {
      return 'Password is too weak. Please use at least 8 characters.'
    }
    if (status >= 500) {
      return 'Registration failed due to a server error. Please try again shortly.'
    }
    return 'Registration failed. Please review your details and try again.'
  }

  if (action === 'updateProfile') {
    if (status >= 500) {
      return 'Profile update failed due to a server error. Please try again shortly.'
    }
    return 'Profile update failed. Please check your details and try again.'
  }

  return 'Something went wrong. Please try again.'
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const useOptionalAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('mzansi_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      throw new Error(normalizeAuthError(error, 'register'))
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const loggedInUser = {
        id: response.developerId,
        name: response.name,
        email: response.email,
        phone: response.phoneNumber,
        role: response.role,
        token: response.token
      }
      localStorage.setItem('mzansi_user', JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      return loggedInUser
    } catch (error) {
      throw new Error(normalizeAuthError(error, 'login'))
    }
  }

  const logout = () => {
    localStorage.removeItem('mzansi_user')
    setUser(null)
  }

  const updateProfile = async (updates) => {
    try {
      const response = await authService.updateProfile(user.id, updates)
      const updatedUser = {
        ...user,
        name: response.name,
        email: response.email,
        phone: response.phoneNumber,
        role: response.role
      }
      localStorage.setItem('mzansi_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      throw new Error(normalizeAuthError(error, 'updateProfile'))
    }
  }

  const forgotPassword = async (email) => {
    try {
      return await authService.forgotPassword(email)
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong. Please try again.'
      throw new Error(msg)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      return await authService.resetPassword(token, newPassword)
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Something went wrong. Please try again.'
      throw new Error(msg)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}
