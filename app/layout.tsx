import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://spearpointstudio.com'),
  title: 'Spearpoint Studio',
  description: 'Spearpoint Studio designs, builds, and runs experiences on Roblox.',
  openGraph: {
    title: 'Spearpoint Studio',
    description: 'Spearpoint Studio designs, builds, and runs experiences on Roblox.',
    url: 'https://spearpointstudio.com',
    siteName: 'Spearpoint Studio',
    images: ['/brand/og.jpg'],
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
