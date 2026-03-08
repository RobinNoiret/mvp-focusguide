import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Today - Focus Guide',
  description: 'Manage your daily tasks with the kanban board',
  openGraph: {
    title: 'Today - Focus Guide',
    description: 'Manage your daily tasks with the kanban board',
    type: 'website',
  },
}

export default function TodayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
