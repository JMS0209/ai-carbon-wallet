import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Carbon Wallet - zkLogin Authentication',
  description: 'Secure Web3 Authentication with Zero Knowledge Login technology',
  keywords: ['Web3', 'zkLogin', 'Sui', 'Blockchain', 'Authentication', 'Zero Knowledge'],
  authors: [{ name: 'AI Carbon Wallet Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
