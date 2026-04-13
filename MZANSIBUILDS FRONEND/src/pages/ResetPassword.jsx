import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authService } from '../services/authService'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [token, setToken] = useState(searchParams.get('token') || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Keep token field in sync if the URL query changes
  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) setToken(urlToken)
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      const data = await authService.resetPassword(token.trim(), newPassword)
      setSuccess(data.message || 'Password reset successfully.')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white border-2 border-black rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Enter your reset token and choose a new password.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success} Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Reset Token</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary font-mono text-xs"
              rows={3}
              placeholder="Paste your reset token here"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
              placeholder="Minimum 8 characters"
              required
              minLength={8}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
              placeholder="Repeat new password"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Boolean(success)}
            className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary-dark transition disabled:opacity-60"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
            Request a new token
          </Link>
          {' · '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
