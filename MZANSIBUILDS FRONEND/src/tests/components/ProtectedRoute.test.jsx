import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProtectedRoute from '../../components/ProtectedRoute'
import { AuthContext } from '../../context/AuthContext'

function renderWithAuth(authValue) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <div>Dashboard Content</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('ProtectedRoute', () => {
  it('renders a loading state while auth is resolving', () => {
    renderWithAuth({ user: null, loading: true })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login', () => {
    renderWithAuth({ user: null, loading: false })

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument()
  })

  it('renders the protected content for authenticated users', () => {
    renderWithAuth({ user: { id: 'DEV-1' }, loading: false })

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })
})