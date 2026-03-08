/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { ProjectTaskList } from '../ProjectTaskList'
import { useProject } from '@/hooks/use-project'
import { useTodayStore } from '@/stores/today-store'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => children,
  DragOverlay: ({ children }: any) => children,
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}))

// Mock utilities
vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: () => 'none',
    },
  },
}))

// Mock AddToTodayModal (has QueryClient dependency)
vi.mock('../AddToTodayModal', () => ({
  AddToTodayModal: () => null,
}))

// Mock project task hooks
vi.mock('@/hooks/use-project-tasks', () => ({
  useUpdateProjectTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteProjectTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

// Mock edit and delete modals
vi.mock('@/components/modals/EditTaskModal', () => ({
  EditTaskModal: () => null,
}))

vi.mock('@/components/modals/DeleteConfirmationDialog', () => ({
  DeleteConfirmationDialog: () => null,
}))

vi.mock('@/hooks/use-project')
vi.mock('@/stores/today-store')

describe('ProjectTaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: null,
      setSelectedProjectId: vi.fn(),
    } as any)

    vi.mocked(useProject).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any)
  })

  it('shows placeholder when no project selected', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: null,
      setSelectedProjectId: vi.fn(),
    } as any)

    render(<ProjectTaskList />)

    expect(screen.getByText(/Sélectionnez un projet/)).toBeInTheDocument()
  })

  it('shows loading skeletons while fetching', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: 'p1',
      setSelectedProjectId: vi.fn(),
    } as any)

    vi.mocked(useProject).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    const { container } = render(<ProjectTaskList />)

    // Look for skeleton divs (they have animate-pulse and bg-primary/10 classes)
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBe(5) // Should show 5 skeletons as per code
  })

  it('shows empty state when project has no tasks', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: 'p1',
      setSelectedProjectId: vi.fn(),
    } as any)

    vi.mocked(useProject).mockReturnValue({
      data: { id: 'p1', tasks: [], taskCount: 0 },
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectTaskList />)

    // AC 7: Empty state
    expect(screen.getByText(/Aucune tâche dans ce projet/)).toBeInTheDocument()
  })

  it('displays tasks grouped by status, excluding done tasks', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: 'p1',
      setSelectedProjectId: vi.fn(),
    } as any)

    const mockProject = {
      id: 'p1',
      taskCount: 4,
      tasks: [
        {
          id: 't1',
          title: 'Task 1',
          projectStatus: 'todo',
          todayStatus: null, // Not in Today - should show
          deletedAt: null,
        },
        {
          id: 't2',
          title: 'Task 2',
          projectStatus: 'in_progress',
          todayStatus: null, // Not in Today - should show
          deletedAt: null,
        },
        {
          id: 't3',
          title: 'Task 3',
          projectStatus: 'done',
          todayStatus: null, // Excluded - should NOT show
          deletedAt: null,
        },
        {
          id: 't4',
          title: 'Task 4',
          projectStatus: 'todo',
          todayStatus: null, // Not in Today - should show
          deletedAt: null,
        },
      ],
    }

    vi.mocked(useProject).mockReturnValue({
      data: mockProject,
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectTaskList />)

    // AC 6: Task count shows only actionable tasks (3 out of 4)
    expect(screen.getByText(/3 tâches à faire/)).toBeInTheDocument()

    // AC 4: Status headers (done tasks are not displayed)
    expect(screen.getAllByText(/À faire/)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/En cours/)[0]).toBeInTheDocument()
    expect(screen.queryByText(/Terminées/)).not.toBeInTheDocument()

    // AC 3: Only non-done task titles are displayed
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument() // Done task excluded
    expect(screen.getByText('Task 4')).toBeInTheDocument()
  })

  it('excludes deleted tasks from grouping', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: 'p1',
      setSelectedProjectId: vi.fn(),
    } as any)

    const mockProject = {
      id: 'p1',
      taskCount: 2,
      tasks: [
        {
          id: 't1',
          title: 'Task 1',
          projectStatus: 'todo',
          todayStatus: null,
          deletedAt: null,
        },
        {
          id: 't2',
          title: 'Task 2',
          projectStatus: 'todo',
          todayStatus: null,
          deletedAt: '2026-01-19T10:00:00Z', // Deleted
        },
      ],
    }

    vi.mocked(useProject).mockReturnValue({
      data: mockProject,
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectTaskList />)

    // Only Task 1 should be displayed
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
  })

  it('hides tasks that are already in Today (todayStatus !== null)', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: 'p1',
      setSelectedProjectId: vi.fn(),
    } as any)

    const mockProject = {
      id: 'p1',
      taskCount: 3,
      tasks: [
        {
          id: 't1',
          title: 'Task 1 - In Project',
          projectStatus: 'todo',
          todayStatus: null, // Not in Today - should show
          deletedAt: null,
        },
        {
          id: 't2',
          title: 'Task 2 - Already in Today',
          projectStatus: 'todo',
          todayStatus: 'backlog', // In Today - should NOT show
          deletedAt: null,
        },
        {
          id: 't3',
          title: 'Task 3 - In Project',
          projectStatus: 'in_progress',
          todayStatus: null, // Not in Today - should show
          deletedAt: null,
        },
      ],
    }

    vi.mocked(useProject).mockReturnValue({
      data: mockProject,
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectTaskList />)

    // Task 1 and 3 should be visible
    expect(screen.getByText('Task 1 - In Project')).toBeInTheDocument()
    expect(screen.getByText('Task 3 - In Project')).toBeInTheDocument()

    // Task 2 should NOT be visible (it's already in Today)
    expect(screen.queryByText('Task 2 - Already in Today')).not.toBeInTheDocument()
  })

  it('shows empty state when all tasks are done', () => {
    vi.mocked(useTodayStore).mockReturnValue({
      selectedProjectId: 'p1',
      setSelectedProjectId: vi.fn(),
    } as any)

    const mockProject = {
      id: 'p1',
      taskCount: 3,
      tasks: [
        {
          id: 't1',
          title: 'Task 1',
          projectStatus: 'done',
          todayStatus: null,
          deletedAt: null,
        },
        {
          id: 't2',
          title: 'Task 2',
          projectStatus: 'done',
          todayStatus: null,
          deletedAt: null,
        },
        {
          id: 't3',
          title: 'Task 3',
          projectStatus: 'done',
          todayStatus: null,
          deletedAt: null,
        },
      ],
    }

    vi.mocked(useProject).mockReturnValue({
      data: mockProject,
      isLoading: false,
      error: null,
    } as any)

    render(<ProjectTaskList />)

    // When all tasks are done, show empty state
    expect(screen.getByText(/Aucune tâche à faire ou en cours/)).toBeInTheDocument()
  })
})
