import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setResetToken('')
    setIsSubmitting(true)

    try {
      const data = await authService.forgotPassword(email.trim().toLowerCase())
      setSuccess(data.message || 'Check your email for the reset token.')
      // In dev mode the backend returns the token directly
      if (data.resetToken) {
        setResetToken(data.resetToken)
      }
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
        <h2 className="text-3xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Enter your email address and we'll generate a reset token for you.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {resetToken && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 text-sm">
            <p className="font-semibold mb-1">Your reset token (dev mode):</p>
            <p className="break-all font-mono text-xs">{resetToken}</p>
            <Link
              to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="mt-2 inline-block text-primary font-semibold hover:underline"
            >
              Reset your password now &rarr;
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:border-primary"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-primary-dark transition disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
