import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Mono } from 'next/font/google'
import Nav from './components/Nav'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Burnr — Fitness Calculators',
  description: 'Simple, accurate fitness calculators. No accounts, no ads — just fast answers.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-mono), monospace' }}>
        <Nav />

        <div className="content-top-offset">
          {children}
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'var(--muted)',
              textTransform: 'uppercase',
            }}
          >
            © {new Date().getFullYear()} Burnr
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.15em',
              color: 'var(--muted)',
            }}
          >
            No accounts. No ads. Just numbers.
          </span>
        </footer>
      </body>
    </html>
  )
}
