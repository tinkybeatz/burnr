'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '/bmr',               label: 'BMR & TDEE' },
  { href: '/treadmill',         label: 'Treadmill'  },
  { href: '/treadmill-incline', label: 'Incline'    },
]

export default function Nav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header
        className="pt-safe"
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 24px',
          minHeight: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
          <Image src="/burnr-logo.svg" alt="burnr" width={80} height={24} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ gap: 24 }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: pathname === link.href ? 'var(--accent)' : 'var(--muted)',
                transition: 'color 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          className="flex md:hidden"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: 'var(--muted)',
          }}
        >
          {isOpen ? (
            // × close icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            // ≡ hamburger icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6"  x2="17" y2="6"  />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="14" x2="17" y2="14" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(52px + env(safe-area-inset-top))',
            left: 0,
            right: 0,
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                padding: '16px 24px',
                fontSize: 10,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: pathname === link.href ? 'var(--accent)' : 'var(--muted)',
                borderBottom: '1px solid var(--border)',
                borderLeft: pathname === link.href ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
