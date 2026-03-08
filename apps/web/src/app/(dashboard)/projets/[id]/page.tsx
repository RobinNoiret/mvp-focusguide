'use client'

import { ProjectDetailView } from '@/components/projects/ProjectDetailView'

interface PageProps {
  params: { id: string }
}

export default function ProjectDetailPage({ params }: PageProps) {
  return <ProjectDetailView projectId={params.id} />
}
