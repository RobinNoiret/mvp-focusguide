import { Skeleton } from '@/components/ui/skeleton'

export function PomodoroTimerSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Circular skeleton */}
      <Skeleton className="h-80 w-80 rounded-full" />

      {/* Controls skeleton (Story 4.3) */}
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  )
}
