'use client'

export function ProjectDetailSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Kanban skeleton */}
      <div className="flex gap-6">
        {/* 3 horizontal columns */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-lg bg-white p-4 shadow-sm"
          >
            {/* Column header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="h-6 w-24 rounded bg-gray-200" />
              <div className="h-6 w-6 rounded bg-gray-200" />
            </div>

            {/* Task cards skeleton */}
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-24 rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
        ))}

        {/* Vertical Done column */}
        <div className="w-64 animate-pulse rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-16 rounded bg-gray-200" />
            <div className="h-6 w-6 rounded bg-gray-200" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
