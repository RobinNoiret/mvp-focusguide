'use client'

import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'
import { useProjects } from '@/hooks/use-projects'
import { useTodayStore } from '@/stores/today-store'

export function ProjectSelectorDropdown() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { data: projects, isLoading } = useProjects() // AC 1
  const { selectedProjectId, setSelectedProjectId } = useTodayStore() // AC 3

  // Find selected project name
  const selectedProject = projects?.find((p) => p.id === selectedProjectId)
  const selectedProjectName = selectedProject?.title

  // AC 2: Sort projects alphabetically
  const sortedProjects = projects
    ?.slice()
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'))

  const handleSelect = (projectId: string | null) => {
    // AC 3: Update store
    setSelectedProjectId(projectId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={t.common.projects}
          className="w-full justify-between font-medium text-dark hover:border-gray-300 focus:border-chartreuse focus:ring-2 focus:ring-chartreuse"
        >
          {/* AC 5: Show current project name */}
          <span className="truncate">
            {selectedProjectName
              ? `${t.common.projects} - ${selectedProjectName}`
              : t.common.projects}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* AC 9: Click outside closes */}
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder={t.common.projects}
            className="h-9"
          />
          <CommandList>
            {/* AC 7: Loading state */}
            {isLoading && (
              <div className="py-6 text-center text-sm text-gray-500">
                {t.common.loading}
              </div>
            )}

            {/* AC 8: Empty state */}
            {!isLoading && (!sortedProjects || sortedProjects.length === 0) && (
              <CommandEmpty>{t.projects.empty}</CommandEmpty>
            )}

            {!isLoading && sortedProjects && sortedProjects.length > 0 && (
              <CommandGroup>
                {/* AC 6: Clear selection option */}
                <CommandItem
                  value="none"
                  onSelect={() => handleSelect(null)}
                  className="cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{t.projects.empty}</span>
                  {!selectedProjectId && (
                    <Check className="ml-auto h-4 w-4 text-chartreuse" />
                  )}
                </CommandItem>

                {/* AC 2: Project list (alphabetical) */}
                {sortedProjects.map((project) => {
                  // Count only actionable tasks (backlog, todo, in_progress)
                  const actionableCount = (project.taskCounts?.backlog || 0) +
                    (project.taskCounts?.todo || 0) +
                    (project.taskCounts?.inProgress || 0)

                  return (
                    <CommandItem
                      key={project.id}
                      value={project.title}
                      onSelect={() => handleSelect(project.id)}
                      className={`cursor-pointer rounded-md transition-colors ${
                        selectedProjectId === project.id
                          ? 'bg-chartreuse/10 border border-chartreuse/20'
                          : ''
                      }`}
                    >
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex-1 truncate">
                          <div className="font-medium text-dark">
                            {project.title}
                          </div>
                        </div>
                        {/* Task count */}
                        <span className="ml-2 text-xs text-gray-500">
                          {actionableCount}
                        </span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
