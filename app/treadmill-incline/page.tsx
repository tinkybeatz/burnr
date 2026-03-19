'use client'

import { useState, useCallback } from 'react'

type WeightUnit = 'kg' | 'lbs'
type HeightUnit = 'cm' | 'in'
type DistUnit = 'km' | 'mi'
type SpeedUnit = 'kmh' | 'ms'
type Mode = 'distance' | 'time'

const WALK_THRESHOLD_KMH = 8

interface Results {
  calories: number
  steps: number
  durationMin: number
  speedKmh: number
  speedMs: number
  displayDist: string
  distUnit: DistUnit
  gait: 'WALKING' | 'RUNNING'
}

function toKmh(val: number, unit: SpeedUnit): number {
  return unit === 'ms' ? val * 3.6 : val
}

export default function Page() {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg')
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm')
  const [distUnit, setDistUnit] = useState<DistUnit>('km')
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh')
  const [speedTimeUnit, setSpeedTimeUnit] = useState<SpeedUnit>('kmh')
  const [mode, setMode] = useState<Mode>('distance')
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [calcKey, setCalcKey] = useState(0)

  // Form field values
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [incline, setIncline] = useState('')
  const [distance, setDistance] = useState('')
  const [speed, setSpeed] = useState('')
  const [timeMins, setTimeMins] = useState('')
  const [speedTime, setSpeedTime] = useState('')

  // Live gait indicator — derived from whatever speed field is active
  const activeSpeedRaw = mode === 'distance' ? speed : speedTime
  const activeSpeedUnit = mode === 'distance' ? speedUnit : speedTimeUnit
  const previewKmh = parseFloat(activeSpeedRaw)
    ? toKmh(parseFloat(activeSpeedRaw), activeSpeedUnit)
    : null
  const gaitMode: 'WALKING' | 'RUNNING' | null =
    previewKmh !== null
      ? previewKmh < WALK_THRESHOLD_KMH
        ? 'WALKING'
        : 'RUNNING'
      : null

  const calculate = useCallback(() => {
    setError(null)
    let weightKg = parseFloat(weight)
    let heightCm = parseFloat(height)
    const inclineVal = parseFloat(incline) || 0

    if (!weightKg || !heightCm) {
      setError('Please enter weight and height.')
      return
    }

    if (weightUnit === 'lbs') weightKg *= 0.453592
    if (heightUnit === 'in') heightCm *= 2.54

    let distanceKm: number
    let durationMin: number
    let speedKmh: number

    if (mode === 'distance') {
      let dist = parseFloat(distance)
      const spd = parseFloat(speed)
      if (!dist || !spd) {
        setError('Please enter distance and speed.')
        return
      }
      if (distUnit === 'mi') dist *= 1.60934
      speedKmh = toKmh(spd, speedUnit)
      distanceKm = dist
      durationMin = (distanceKm / speedKmh) * 60
    } else {
      durationMin = parseFloat(timeMins)
      const spd = parseFloat(speedTime)
      if (!durationMin || !spd) {
        setError('Please enter duration and speed.')
        return
      }
      speedKmh = toKmh(spd, speedTimeUnit)
      distanceKm = (speedKmh * durationMin) / 60
    }

    // ACSM 2021 metabolic equations with incline
    const speedMmin = (speedKmh * 1000) / 60
    const grade = inclineVal / 100
    const vo2 =
      speedKmh < WALK_THRESHOLD_KMH
        ? 0.1 * speedMmin + 1.8 * speedMmin * grade + 3.5   // walking
        : 0.2 * speedMmin + 0.9 * speedMmin * grade + 3.5   // running
    const MET = Math.max(2.5, vo2 / 3.5)
    const calories = Math.round(MET * weightKg * (durationMin / 60))

    // Lindberg (2003) step length, incline-adjusted
    const heightM = heightCm / 100
    const inclineFactor = 1 - inclineVal * 0.004
    const stepLengthM =
      speedKmh < WALK_THRESHOLD_KMH
        ? 0.413 * heightM * inclineFactor   // walking
        : 0.72 * heightM * inclineFactor    // running
    const steps = Math.round((distanceKm * 1000) / stepLengthM)

    const gait: 'WALKING' | 'RUNNING' =
      speedKmh < WALK_THRESHOLD_KMH ? 'WALKING' : 'RUNNING'

    const displayDist =
      distUnit === 'mi'
        ? (distanceKm / 1.60934).toFixed(2)
        : distanceKm.toFixed(2)

    setResults({
      calories,
      steps,
      durationMin: Math.round(durationMin),
      speedKmh,
      speedMs: speedKmh / 3.6,
      displayDist,
      distUnit,
      gait,
    })
    setCalcKey((k) => k + 1)
  }, [
    weight, height, incline, distance, speed, timeMins, speedTime,
    weightUnit, heightUnit, distUnit, speedUnit, speedTimeUnit, mode,
  ])

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
          INCLINE<br />TREADMILL
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
          Incline Speed Calculator
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
            <div className="flex items-center gap-2">
              <NumberInput
                value={height}
                onChange={setHeight}
                placeholder="175"
                min={100}
                max={250}
              />
              <UnitSpan>{heightUnit}</UnitSpan>
            </div>
            <ToggleRow>
              <ToggleBtn active={heightUnit === 'cm'} onClick={() => setHeightUnit('cm')}>CM</ToggleBtn>
              <ToggleBtn active={heightUnit === 'in'} onClick={() => setHeightUnit('in')}>IN</ToggleBtn>
            </ToggleRow>
          </InputCell>
        </div>

        {/* Workout section */}
        <SectionLabel gaitBadge={gaitMode}>// Workout</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            background: 'var(--border)',
          }}
        >
          {/* Incline — full width */}
          <InputCell fullWidth>
            <FieldLabel>Incline</FieldLabel>
            <div className="flex items-center gap-2">
              <NumberInput
                value={incline}
                onChange={setIncline}
                placeholder="8"
                min={0}
                max={30}
                step={0.5}
              />
              <UnitSpan>% grade</UnitSpan>
            </div>
          </InputCell>

          {/* Mode toggle — full width */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 1, background: 'var(--border)' }}>
            <ModeBtn active={mode === 'distance'} onClick={() => setMode('distance')}>
              By Distance
            </ModeBtn>
            <ModeBtn active={mode === 'time'} onClick={() => setMode('time')}>
              By Time
            </ModeBtn>
          </div>

          {/* Distance mode inputs */}
          {mode === 'distance' && (
            <>
              <InputCell>
                <FieldLabel>Distance</FieldLabel>
                <div className="flex items-center gap-2">
                  <NumberInput
                    value={distance}
                    onChange={setDistance}
                    placeholder="3"
                    min={0.1}
                    max={100}
                    step={0.1}
                  />
                  <UnitSpan>{distUnit}</UnitSpan>
                </div>
                <ToggleRow>
                  <ToggleBtn active={distUnit === 'km'} onClick={() => setDistUnit('km')}>KM</ToggleBtn>
                  <ToggleBtn active={distUnit === 'mi'} onClick={() => setDistUnit('mi')}>MI</ToggleBtn>
                </ToggleRow>
              </InputCell>

              <InputCell>
                <FieldLabel>Speed</FieldLabel>
                <div className="flex items-center gap-2">
                  <NumberInput
                    value={speed}
                    onChange={setSpeed}
                    placeholder="5.5"
                    min={0.1}
                    max={50}
                    step={0.1}
                  />
                  <UnitSpan>{speedUnit === 'kmh' ? 'km/h' : 'm/s'}</UnitSpan>
                </div>
                <ToggleRow>
                  <ToggleBtn active={speedUnit === 'kmh'} onClick={() => setSpeedUnit('kmh')}>KM/H</ToggleBtn>
                  <ToggleBtn active={speedUnit === 'ms'} onClick={() => setSpeedUnit('ms')}>M/S</ToggleBtn>
                </ToggleRow>
              </InputCell>
            </>
          )}

          {/* Time mode inputs */}
          {mode === 'time' && (
            <>
              <InputCell fullWidth>
                <FieldLabel>Duration</FieldLabel>
                <div className="flex items-center gap-2">
                  <NumberInput
                    value={timeMins}
                    onChange={setTimeMins}
                    placeholder="45"
                    min={1}
                    max={600}
                  />
                  <UnitSpan>min</UnitSpan>
                </div>
              </InputCell>

              <InputCell fullWidth>
                <FieldLabel>Speed</FieldLabel>
                <div className="flex items-center gap-2">
                  <NumberInput
                    value={speedTime}
                    onChange={setSpeedTime}
                    placeholder="5.5"
                    min={0.1}
                    max={50}
                    step={0.1}
                  />
                  <UnitSpan>{speedTimeUnit === 'kmh' ? 'km/h' : 'm/s'}</UnitSpan>
                </div>
                <ToggleRow>
                  <ToggleBtn active={speedTimeUnit === 'kmh'} onClick={() => setSpeedTimeUnit('kmh')}>KM/H</ToggleBtn>
                  <ToggleBtn active={speedTimeUnit === 'ms'} onClick={() => setSpeedTimeUnit('ms')}>M/S</ToggleBtn>
                </ToggleRow>
              </InputCell>
            </>
          )}
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
          style={{
            width: '100%',
            maxWidth: 520,
            marginTop: 1,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              background: 'var(--border)',
            }}
          >
            {/* Calories — highlight, full width */}
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
              <div className="flex items-center gap-2" style={{ justifyContent: 'space-between' }}>
                <ResultLabel>Calories Burned</ResultLabel>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: results.gait === 'RUNNING' ? 'var(--accent)' : 'var(--muted)',
                    border: results.gait === 'RUNNING'
                      ? '1px solid rgba(200,241,53,0.3)'
                      : '1px solid var(--border)',
                    background: results.gait === 'RUNNING' ? 'var(--accent-dim)' : 'transparent',
                    padding: '2px 7px',
                  }}
                >
                  {results.gait}
                </span>
              </div>
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
                {results.calories.toLocaleString()}
              </div>
              <ResultSub>kcal (estimated)</ResultSub>
            </div>

            <ResultCell delay={2}>
              <ResultLabel>Steps</ResultLabel>
              <ResultValue>{results.steps.toLocaleString()}</ResultValue>
              <ResultSub>approx.</ResultSub>
            </ResultCell>

            <ResultCell delay={3}>
              <ResultLabel>Duration</ResultLabel>
              <ResultValue>{results.durationMin}</ResultValue>
              <ResultSub>min</ResultSub>
            </ResultCell>

            <ResultCell delay={4}>
              <ResultLabel>Speed</ResultLabel>
              <ResultValue>{results.speedKmh.toFixed(1)}</ResultValue>
              <ResultSub>
                km/h &nbsp;·&nbsp; {results.speedMs.toFixed(2)} m/s
              </ResultSub>
            </ResultCell>

            <ResultCell delay={5}>
              <ResultLabel>Distance</ResultLabel>
              <ResultValue>{results.displayDist}</ResultValue>
              <ResultSub>{results.distUnit}</ResultSub>
            </ResultCell>
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
            Estimates use ACSM 2021 metabolic equations (Lindberg 2003 stride length).<br />
            Actual results vary by fitness level, terrain, and gait.
          </p>
        </div>
      )}
    </main>
  )
}

/* ─── Small reusable components ─────────────────────────────────────────── */

function SectionLabel({
  children,
  gaitBadge,
}: {
  children: React.ReactNode
  gaitBadge?: 'WALKING' | 'RUNNING' | null
}) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        padding: '14px 20px 10px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {children}
      {gaitBadge && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.25em',
            color: gaitBadge === 'RUNNING' ? 'var(--accent)' : 'var(--muted)',
            border: gaitBadge === 'RUNNING'
              ? '1px solid rgba(200,241,53,0.3)'
              : '1px solid var(--border)',
            background: gaitBadge === 'RUNNING' ? 'var(--accent-dim)' : 'transparent',
            padding: '2px 7px',
            transition: 'all 0.2s',
          }}
        >
          {gaitBadge}
        </span>
      )}
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
        padding: '5px 0',
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

function ModeBtn({
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
        padding: '10px',
        fontFamily: 'var(--font-dm-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        border: 'none',
        background: active ? 'var(--accent-dim)' : 'var(--panel)',
        color: active ? 'var(--accent)' : 'var(--muted)',
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
}: {
  children: React.ReactNode
  delay: number
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
