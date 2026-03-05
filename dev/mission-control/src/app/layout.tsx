import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SOVEREIGN v4.0 // LUX PROOF',
  description: 'Aureum Void Protocol // Agent-Driven Materialization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Poppins:wght@300;600&family=JetBrains+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="silk-overlay font-['Poppins',_sans-serif]">
        {children}
      </body>
    </html>
  )
}
