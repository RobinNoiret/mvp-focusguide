'use client'

export function ProjectCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-lg bg-white p-6 shadow-sm"
      data-testid="skeleton"
    >
      {/* Title skeleton */}
      <div className="mb-3 h-6 w-3/4 rounded bg-gray-200" />

      {/* Description skeleton */}
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>

      {/* Deadline skeleton */}
      <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />

      {/* Tags skeleton */}
      <div className="mb-3 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-gray-200" />
        <div className="h-6 w-20 rounded-full bg-gray-200" />
      </div>

      {/* Task count skeleton */}
      <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />

      {/* Progress bar skeleton */}
      <div className="h-2 w-full rounded-full bg-gray-200" />
    </div>
  )
}
