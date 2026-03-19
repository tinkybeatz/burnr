'use client'

import { useState, useCallback } from 'react'

type WeightUnit = 'kg' | 'lbs'
type HeightUnit = 'cm' | 'ft'
type Sex = 'male' | 'female'

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary',         sub: 'desk job, no exercise',          multiplier: 1.2   },
  { key: 'light',     label: 'Lightly Active',    sub: '1–3 days/week',                  multiplier: 1.375 },
  { key: 'moderate',  label: 'Moderately Active', sub: '3–5 days/week',                  multiplier: 1.55  },
  { key: 'very',      label: 'Very Active',        sub: '6–7 days/week',                  multiplier: 1.725 },
  { key: 'extreme',   label: 'Extremely Active',   sub: 'physical job + hard training',   multiplier: 1.9   },
] as const

type ActivityKey = typeof ACTIVITY_LEVELS[number]['key']

interface Results {
  bmr: number
  tdee: number
  cut: number
  bulk: number
}

export default function Page() {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg')
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm')
  const [sex, setSex] = useState<Sex>('male')
  const [activity, setActivity] = useState<ActivityKey>('moderate')
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [calcKey, setCalcKey] = useState(0)

  // Form field values
  const [weight, setWeight] = useState('')
  const [heightCmVal, setHeightCmVal] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [age, setAge] = useState('')

  const calculate = useCallback(() => {
    setError(null)

    let weightKg = parseFloat(weight)
    let heightCm: number
    const ageVal = parseFloat(age)

    if (!weightKg || !ageVal) {
      setError('Please enter weight and age.')
      return
    }

    if (weightUnit === 'lbs') weightKg *= 0.453592

    if (heightUnit === 'cm') {
      heightCm = parseFloat(heightCmVal)
      if (!heightCm) {
        setError('Please enter height.')
        return
      }
    } else {
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      if (!ft && !inches) {
        setError('Please enter height.')
        return
      }
      heightCm = ft * 30.48 + inches * 2.54
    }

    // Mifflin-St Jeor (1990)
    const bmr = Math.round(
      10 * weightKg + 6.25 * heightCm - 5 * ageVal + (sex === 'male' ? 5 : -161)
    )

    const multiplier = ACTIVITY_LEVELS.find((a) => a.key === activity)!.multiplier
    const tdee = Math.round(bmr * multiplier)

    setResults({
      bmr,
      tdee,
      cut: tdee - 500,
      bulk: tdee + 300,
    })
    setCalcKey((k) => k + 1)
  }, [weight, heightCmVal, heightFt, heightIn, age, weightUnit, heightUnit, sex, activity])

  return (
    <main
      style={{ fontFamily: 'var(--font-dm-mono), monospace' }}
      className="min-h-screen flex flex-col items-center px-4 py-10 pb-16"
    >
      {/* Header */}
      <header className="text-center mb-10">
        <h1
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(48px, 10vw, 88px)',
            letterSpacing: '0.04em',
            color: 'var(--accent)',
            lineHeight: 0.9,
            textShadow: '0 0 40px rgba(200,241,53,0.3)',
          }}
        >
          BMR &amp;<br />TDEE
        </h1>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            marginTop: 8,
          }}
        >
          Calorie Estimator
        </p>
      </header>

      {/* Card */}
      <div
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          width: '100%',
          maxWidth: 520,
        }}
      >
        {/* Body section */}
        <SectionLabel>// Body</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            background: 'var(--border)',
          }}
        >
          {/* Weight */}
          <InputCell>
            <FieldLabel>Weight</FieldLabel>
            <div className="flex items-center gap-2">
              <NumberInput
                value={weight}
                onChange={setWeight}
                placeholder="75"
                min={30}
                max={300}
              />
              <UnitSpan>{weightUnit}</UnitSpan>
            </div>
            <ToggleRow>
              <ToggleBtn active={weightUnit === 'kg'} onClick={() => setWeightUnit('kg')}>KG</ToggleBtn>
              <ToggleBtn active={weightUnit === 'lbs'} onClick={() => setWeightUnit('lbs')}>LBS</ToggleBtn>
            </ToggleRow>
          </InputCell>

          {/* Height */}
          <InputCell>
            <FieldLabel>Height</FieldLabel>
            {heightUnit === 'cm' ? (
              <div className="flex items-center gap-2">
                <NumberInput
                  value={heightCmVal}
                  onChange={setHeightCmVal}
                  placeholder="175"
                  min={100}
                  max={250}
                />
                <UnitSpan>cm</UnitSpan>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NumberInput
                  value={heightFt}
                  onChange={setHeightFt}
                  placeholder="5"
                  min={3}
                  max={8}
                />
                <UnitSpan>ft</UnitSpan>
                <NumberInput
                  value={heightIn}
                  onChange={setHeightIn}
                  placeholder="9"
                  min={0}
                  max={11}
                />
                <UnitSpan>in</UnitSpan>
              </div>
            )}
            <ToggleRow>
              <ToggleBtn active={heightUnit === 'cm'} onClick={() => setHeightUnit('cm')}>CM</ToggleBtn>
              <ToggleBtn active={heightUnit === 'ft'} onClick={() => setHeightUnit('ft')}>FT+IN</ToggleBtn>
            </ToggleRow>
          </InputCell>

          {/* Age */}
          <InputCell>
            <FieldLabel>Age</FieldLabel>
            <div className="flex items-center gap-2">
              <NumberInput
                value={age}
                onChange={setAge}
                placeholder="30"
                min={15}
                max={100}
              />
              <UnitSpan>yrs</UnitSpan>
            </div>
          </InputCell>

          {/* Sex */}
          <InputCell>
            <FieldLabel>Sex</FieldLabel>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <ToggleRow>
                <ToggleBtn active={sex === 'male'} onClick={() => setSex('male')}>Male</ToggleBtn>
                <ToggleBtn active={sex === 'female'} onClick={() => setSex('female')}>Female</ToggleBtn>
              </ToggleRow>
            </div>
          </InputCell>
        </div>

        {/* Activity section */}
        <SectionLabel>// Activity Level</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
          {ACTIVITY_LEVELS.map((level) => (
            <ActivityBtn
              key={level.key}
              label={level.label}
              sub={level.sub}
              active={activity === level.key}
              onClick={() => setActivity(level.key)}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              color: '#ff4d4d',
              fontSize: 11,
              letterSpacing: '0.1em',
              padding: '10px 20px 0',
            }}
          >
            {error}
          </p>
        )}

        {/* Calculate button */}
        <button
          onClick={calculate}
          style={{
            width: 'calc(100% - 40px)',
            margin: '20px',
            padding: '16px',
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 22,
            letterSpacing: '0.15em',
            background: 'var(--accent)',
            color: '#0d0d0d',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            display: 'block',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = '#d9ff3f'
            el.style.transform = 'translateY(-1px)'
            el.style.boxShadow = '0 6px 20px rgba(200,241,53,0.25)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'var(--accent)'
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          CALCULATE
        </button>
      </div>

      {/* Results */}
      {results && (
        <div
          key={calcKey}
          style={{ width: '100%', maxWidth: 520, marginTop: 1 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              background: 'var(--border)',
            }}
          >
            {/* BMR — full width, accent */}
            <div
              className="animate-fade-up delay-1"
              style={{
                gridColumn: '1 / -1',
                background: 'var(--accent-dim)',
                border: '1px solid rgba(200,241,53,0.2)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <ResultLabel>Basal Metabolic Rate</ResultLabel>
              <div
                style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: 64,
                  letterSpacing: '0.03em',
                  color: 'var(--accent)',
                  lineHeight: 1,
                  textShadow: '0 0 30px rgba(200,241,53,0.4)',
                }}
              >
                {results.bmr.toLocaleString()}
              </div>
              <ResultSub>kcal/day at rest (Mifflin-St Jeor)</ResultSub>
            </div>

            {/* TDEE — full width */}
            <ResultCell delay={2} fullWidth>
              <ResultLabel>Total Daily Energy Expenditure</ResultLabel>
              <ResultValue>{results.tdee.toLocaleString()}</ResultValue>
              <ResultSub>kcal/day · maintenance</ResultSub>
            </ResultCell>

            {/* Goals — 3 cells across 2 columns */}
            <div
              className="animate-fade-up delay-3"
              style={{
                gridColumn: '1 / -1',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 1,
                background: 'var(--border)',
              }}
            >
              <GoalCell label="Maintenance" value={results.tdee} tag="= TDEE" delay={3} />
              <GoalCell label="Cut" value={results.cut} tag="−500 kcal" delay={4} />
              <GoalCell label="Bulk" value={results.bulk} tag="+300 kcal" delay={5} />
            </div>
          </div>

          <p
            style={{
              fontSize: 10,
              color: 'var(--muted)',
              textAlign: 'center',
              padding: '16px 20px',
              letterSpacing: '0.05em',
              lineHeight: 1.6,
              background: 'var(--panel)',
              border: '1px solid var(--border)',
            }}
          >
            These are estimates based on population averages — not a substitute for clinical testing.<br />
            For accurate results, consult a dietitian or get a metabolic rate test (e.g. indirect calorimetry).<br />
            <span style={{ opacity: 0.6 }}>BMR: Mifflin-St Jeor (1990) · TDEE: Harris-Benedict multipliers</span>
          </p>
        </div>
      )}
    </main>
  )
}

/* ─── GoalCell ───────────────────────────────────────────────────────────── */

function GoalCell({
  label,
  value,
  tag,
  delay,
}: {
  label: string
  value: number
  tag: string
  delay: number
}) {
  return (
    <div
      className={`animate-fade-up delay-${delay}`}
      style={{
        background: 'var(--panel)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 32,
          letterSpacing: '0.03em',
          color: 'var(--text)',
          lineHeight: 1,
        }}
      >
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.1em' }}>
        {tag}
      </div>
    </div>
  )
}

/* ─── ActivityBtn ────────────────────────────────────────────────────────── */

function ActivityBtn({
  label,
  sub,
  active,
  onClick,
}: {
  label: string
  sub: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 20px',
        fontFamily: 'var(--font-dm-mono), monospace',
        cursor: 'pointer',
        border: 'none',
        background: active ? 'var(--accent-dim)' : 'var(--panel)',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 0.15s',
        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: active ? 'var(--accent)' : 'var(--text)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 10,
          color: 'var(--muted)',
          letterSpacing: '0.05em',
        }}
      >
        {sub}
      </span>
    </button>
  )
}

/* ─── Small reusable components ─────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        padding: '14px 20px 10px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {children}
    </div>
  )
}

function InputCell({
  children,
  fullWidth,
}: {
  children: React.ReactNode
  fullWidth?: boolean
}) {
  return (
    <div
      style={{
        background: 'var(--panel)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: 10,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
      }}
    >
      {children}
    </label>
  )
}

function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  min?: number
  max?: number
  step?: number
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        color: 'var(--text)',
        fontFamily: 'var(--font-dm-mono), monospace',
        fontSize: 22,
        fontWeight: 500,
        width: '100%',
        padding: '4px 0',
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = 'var(--accent)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = 'var(--border)'
      }}
    />
  )
}

function UnitSpan({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  )
}

function ToggleRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>{children}</div>
  )
}

function ToggleBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '5px 10px',
        fontFamily: 'var(--font-dm-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
        background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#0d0d0d' : 'var(--muted)',
        fontWeight: active ? 500 : 400,
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function ResultCell({
  children,
  delay,
  fullWidth,
}: {
  children: React.ReactNode
  delay: number
  fullWidth?: boolean
}) {
  return (
    <div
      className={`animate-fade-up delay-${delay}`}
      style={{
        background: 'var(--panel)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      {children}
    </div>
  )
}

function ResultLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
      }}
    >
      {children}
    </div>
  )
}

function ResultValue({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-bebas), sans-serif',
        fontSize: 48,
        letterSpacing: '0.03em',
        color: 'var(--text)',
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  )
}

function ResultSub({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
      {children}
    </div>
  )
}
