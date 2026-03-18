import type { Metadata } from 'next'
import { Bebas_Neue, DM_Mono } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'Burnr — Fitness Calculators',
  description: 'Simple, accurate fitness calculators. No accounts, no ads — just fast answers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-mono), monospace' }}>
        {children}
      </body>
    </html>
  )
}
