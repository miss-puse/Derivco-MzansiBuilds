import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../../context/AuthContext'

function AuthProbe() {
  const { user, loading, logout } = useAuth()

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="user-name">{user?.name || 'anonymous'}</div>
      <button type="button" onClick={logout}>
        Trigger Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('hydrates the authenticated user from localStorage on mount', async () => {
    localStorage.setItem('mzansi_user', JSON.stringify({
      id: 'DEV-1',
      name: 'Aphiwe',
      email: 'aphiwe@example.com',
      token: 'jwt-token',
    }))

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user-name')).toHaveTextContent('Aphiwe')
  })

  it('clears local storage and user state on logout', async () => {
    const user = userEvent.setup()
    localStorage.setItem('mzansi_user', JSON.stringify({
      id: 'DEV-9',
      name: 'Lerato',
      email: 'lerato@example.com',
      token: 'jwt-123',
    }))

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Lerato')
    })

    await user.click(screen.getByRole('button', { name: 'Trigger Logout' }))

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('anonymous')
    })

    expect(localStorage.getItem('mzansi_user')).toBeNull()
  })
})