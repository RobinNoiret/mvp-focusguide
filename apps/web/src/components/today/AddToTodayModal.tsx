'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUpdateTask } from '@/hooks/use-today-tasks'
import { useTranslation } from '@/hooks/use-translation'
import type { Task, TaskStatus } from '@focus-guide/shared'

interface AddToTodayModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task
}

export function AddToTodayModal({ isOpen, onClose, task }: AddToTodayModalProps) {
  const { t } = useTranslation()
  const updateTask = useUpdateTask()

  const handleAddToColumn = async (column: TaskStatus) => {
    updateTask.mutate(
      {
        id: task.id,
        data: { todayStatus: column },
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter &quot;{task.title}&quot; à Today</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <p className="text-sm text-gray-600">
            Dans quelle colonne souhaitez-vous ajouter cette tâche ?
          </p>

          {/* AC 2, 11: Only Backlog and À faire aujourd'hui */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddToColumn('backlog')}
              disabled={updateTask.isPending}
            >
              {t.today.kanban.backlog}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddToColumn('todo')}
              disabled={updateTask.isPending}
            >
              {t.today.kanban.todo}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={updateTask.isPending}>
            {t.common.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
