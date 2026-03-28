import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendrier - Focus Guide',
  description: 'View your tasks and schedule in calendar view',
  openGraph: {
    title: 'Calendrier - Focus Guide',
    description: 'View your tasks and schedule in calendar view',
    type: 'website',
  },
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
