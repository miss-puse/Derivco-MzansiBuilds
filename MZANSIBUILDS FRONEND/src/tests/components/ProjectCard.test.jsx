import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectCard from '../../components/ProjectCard'

describe('ProjectCard', () => {
  it('renders project details, tags, and detail link', () => {
    const project = {
      id: 42,
      title: 'MzansiBuilds Platform',
      status: 'in-progress',
      description: 'A public build tracker for developers.',
      tags: ['React', 'Spring Boot'],
      userName: 'Aphiwe',
      milestones: [{ id: 1 }, { id: 2 }],
      supportRequired: true,
    }

    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>
    )

    expect(screen.getByText('MzansiBuilds Platform')).toBeInTheDocument()
    expect(screen.getByText('in-progress')).toBeInTheDocument()
    expect(screen.getByText('A public build tracker for developers.')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Spring Boot')).toBeInTheDocument()
    expect(screen.getByText('By Aphiwe')).toBeInTheDocument()
    expect(screen.getByText('2 milestones')).toBeInTheDocument()
    expect(screen.getByText('Looking for collaboration')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Details' })).toHaveAttribute('href', '/project/42')
  })

  it('falls back to zero milestones when no milestone data is present', () => {
    const project = {
      id: 7,
      title: 'Landing Page Refresh',
      status: 'planning',
      description: 'Refreshing the homepage visuals.',
      userName: 'Lerato',
    }

    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>
    )

    expect(screen.getByText('0 milestones')).toBeInTheDocument()
    expect(screen.queryByText('Looking for collaboration')).not.toBeInTheDocument()
  })
})
