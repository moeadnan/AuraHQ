import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AURA HQ — Build your AI system around you',
  description: 'A personal AI organization — built by one person, around one person, commanded by one person.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AURA HQ',
    description: 'Build your AI system around you.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
