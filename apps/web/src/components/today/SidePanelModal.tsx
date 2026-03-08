'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectSelectorDropdown } from './ProjectSelectorDropdown'
import { ProjectTaskList } from './ProjectTaskList'

interface SidePanelModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SidePanelModal({
  isOpen,
  onOpenChange,
}: SidePanelModalProps) {
  return (
    // AC 5: Sheet (modal) for tablet/mobile
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg md:hidden bg-chartreuse text-dark hover:bg-chartreuse/90 border-none"
          size="lg"
        >
          <FolderOpen className="h-5 w-5 mr-2" />
          Projets
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b border-gray-200 p-4">
            <SheetTitle className="text-left sr-only">
              Sélection de projet
            </SheetTitle>
            <ProjectSelectorDropdown />
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* AC 9: Scrollable task list */}
            <ProjectTaskList />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
