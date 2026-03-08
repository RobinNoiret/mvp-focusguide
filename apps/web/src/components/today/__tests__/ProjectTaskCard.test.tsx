/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { ProjectTaskCard } from '../ProjectTaskCard'
import { describe, it, expect, vi } from 'vitest'

// Mock dnd-kit
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => 'none',
    },
  },
}))

// Mock hooks
vi.mock('@/hooks/use-project-tasks', () => ({
  useUpdateProjectTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteProjectTask: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}))

// Mock modals
vi.mock('@/components/modals/EditTaskModal', () => ({
  EditTaskModal: () => null,
}))

vi.mock('@/components/modals/DeleteConfirmationDialog', () => ({
  DeleteConfirmationDialog: () => null,
}))

vi.mock('../AddToTodayModal', () => ({
  AddToTodayModal: () => null,
}))

describe('ProjectTaskCard', () => {
  it('renders task title', () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      projectStatus: 'todo',
    } as any

    render(<ProjectTaskCard task={task} projectId="p1" />)

    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('shows "Dans Today" badge when task has todayStatus', () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      projectStatus: 'todo',
      todayStatus: 'backlog',
    } as any

    render(<ProjectTaskCard task={task} projectId="p1" />)

    expect(screen.getByText(/Dans Today/)).toBeInTheDocument()
  })

  it('does not show "Dans Today" badge when todayStatus is null', () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      projectStatus: 'todo',
      todayStatus: null,
    } as any

    render(<ProjectTaskCard task={task} projectId="p1" />)

    expect(screen.queryByText(/Dans Today/)).not.toBeInTheDocument()
  })

  it('applies done styling when projectStatus is done', () => {
    const task = {
      id: 't1',
      title: 'Done Task',
      projectStatus: 'done',
    } as any

    render(<ProjectTaskCard task={task} projectId="p1" />)

    const titleElement = screen.getByText('Done Task')
    expect(titleElement).toHaveClass('line-through')
    expect(titleElement).toHaveClass('text-gray-400')
  })

  it('renders with data-testid for integration tests', () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      projectStatus: 'todo',
    } as any

    const { container } = render(<ProjectTaskCard task={task} projectId="p1" />)

    const card = container.querySelector('[data-testid="project-task-card"]')
    expect(card).toBeInTheDocument()
  })

  it('renders checkbox button for toggling complete status', () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      projectStatus: 'todo',
    } as any

    render(<ProjectTaskCard task={task} projectId="p1" />)

    const checkbox = screen.getByRole('button', { name: /Marquer comme fait/ })
    expect(checkbox).toBeInTheDocument()
  })

  it('displays task notes when present', () => {
    const task = {
      id: 't1',
      title: 'Test Task',
      projectStatus: 'todo',
      notes: 'This is a test note',
    } as any

    render(<ProjectTaskCard task={task} projectId="p1" />)

    expect(screen.getByText('This is a test note')).toBeInTheDocument()
  })
})
