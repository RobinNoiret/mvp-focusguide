'use client'

import { KanbanColumn, ColumnStatus } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import type { Task } from '@focus-guide/shared'

interface Column {
  id: ColumnStatus
  title: string
}

const columns: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'À faire aujourd\'hui' },
  { id: 'in_progress', title: 'En cours' },
  { id: 'done', title: 'Done' },
]

interface KanbanBoardProps {
  tasks?: Task[]
  onAddTask?: (columnId: ColumnStatus) => void
}

export function KanbanBoard({
  tasks = [],
  onAddTask,
}: KanbanBoardProps) {
  const getTasksForColumn = (columnId: ColumnStatus) => {
    return tasks.filter((task) => task.todayStatus === columnId)
  }

  return (
    <div
      className="flex gap-6 overflow-x-auto snap-x snap-mandatory md:snap-none h-full"
      data-tour="kanban-board"
    >
      {columns.map((column) => {
        const columnTasks = getTasksForColumn(column.id)
        const tourId =
          column.id === 'todo'
            ? 'column-todo'
            : column.id === 'in_progress'
              ? 'column-in-progress'
              : column.id === 'done'
                ? 'column-done'
                : undefined
        return (
          <div
            key={column.id}
            className="flex-shrink-0 snap-center md:flex-1 h-full"
            style={{ minWidth: '280px' }}
            data-tour={tourId}
          >
            <KanbanColumn
              id={column.id}
              title={column.title}
              count={columnTasks.length}
              onAddTask={() => onAddTask?.(column.id)}
            >
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </KanbanColumn>
          </div>
        )
      })}
    </div>
  )
}
