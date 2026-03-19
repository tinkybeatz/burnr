import type { Metadata } from 'next'
import { Bebas_Neue, DM_Mono } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 10,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-dm-mono), monospace' }}>
        {/* Header */}
        <header
          style={{
            borderBottom: '1px solid var(--border)',
            padding: '0 24px',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'var(--bg)',
            zIndex: 10,
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Image src="/burnr-logo.svg" alt="burnr" width={80} height={24} priority />
          </Link>
          <nav style={{ display: 'flex', gap: 24 }}>
            <NavLink href="/treadmill">Treadmill</NavLink>
            <NavLink href="/treadmill-incline">Incline</NavLink>
          </nav>
        </header>

        {children}

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
