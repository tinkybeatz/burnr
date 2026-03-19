'use client'

import Image from 'next/image'
import Link from 'next/link'

const tools = [
  {
    href: '/treadmill',
    tag: 'Calculator',
    name: 'Treadmill',
    description: 'Estimate calories burned and steps for flat treadmill runs or walks. Automatically switches between ACSM walking and running formulas based on speed.',
    stats: ['Calories', 'Steps', 'Duration', 'Speed'],
  },
  {
    href: '/treadmill-incline',
    tag: 'Calculator',
    name: 'Incline Treadmill',
    description: 'Estimate calories burned and steps for incline treadmill sessions. Supports walking and running with ACSM 2021 formulas.',
    stats: ['Calories', 'Steps', 'Duration', 'Speed'],
  },
]

export default function Home() {
  return (
    <main
      style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
      className="min-h-screen flex flex-col items-center px-4 py-10 pb-20"
    >
      {/* Logo + intro */}
      <header className="flex flex-col items-center mb-14" style={{ maxWidth: 520, textAlign: 'center' }}>
        <Image
          src="/burnr-logo.svg"
          alt="burnr"
          width={160}
          height={48}
          priority
          style={{ display: 'block' }}
        />
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            marginTop: 12,
          }}
        >
          Fitness calculators
        </p>
        <p
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.8,
            letterSpacing: '0.03em',
            marginTop: 20,
            borderTop: '1px solid var(--border)',
            paddingTop: 20,
          }}
        >
          No accounts. No ads. Just numbers.
          <br />
          Burnr is a collection of simple, accurate fitness calculators
          for people who want fast answers without the fluff.
        </p>
      </header>

      {/* Tool grid */}
      <div
        style={{
          width: '100%',
          maxWidth: 800,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 1,
          background: 'var(--border)',
        }}
      >
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </main>
  )
}

function ToolCard({
  href,
  tag,
  name,
  description,
  stats,
}: {
  href: string
  tag: string
  name: string
  description: string
  stats: string[]
}) {
  return (
    <Link
      href={href}
      style={{
        background: 'var(--panel)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        textDecoration: 'none',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = '#1a1a1a'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--panel)'
      }}
    >
      {/* Tag + arrow */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            background: 'var(--accent-dim)',
            padding: '3px 8px',
            border: '1px solid rgba(200,241,53,0.2)',
          }}
        >
          {tag}
        </span>
        <span style={{ fontSize: 18, color: 'var(--muted)' }}>→</span>
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 36,
          letterSpacing: '0.04em',
          color: 'var(--text)',
          lineHeight: 0.95,
        }}
      >
        {name}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 11,
          color: 'var(--muted)',
          lineHeight: 1.7,
          letterSpacing: '0.03em',
          margin: 0,
        }}
      >
        {description}
      </p>

      {/* Stats chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
        {stats.map((s) => (
          <span
            key={s}
            style={{
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              padding: '3px 7px',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </Link>
  )
}
