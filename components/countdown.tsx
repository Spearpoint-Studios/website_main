'use client'

import { useSyncExternalStore } from 'react'

type CountdownProps = {
  at: string
  label: string
}

const UNITS = [
  ['days', 86_400_000],
  ['hours', 3_600_000],
  ['minutes', 60_000],
  ['seconds', 1_000],
] as const

function split(ms: number): number[] {
  let rest = Math.max(0, ms)
  return UNITS.map(([, size]) => {
    const value = Math.floor(rest / size)
    rest -= value * size
    return value
  })
}

// A one-second clock as an external store. Snapshots are floored to the
// second so React sees a stable value between ticks.
function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000)
  return () => window.clearInterval(id)
}

const clientNow = () => Math.floor(Date.now() / 1000) * 1000

// The server has no idea what time the viewer's clock says, so it renders
// placeholders (null) and the real numbers arrive after hydration.
const serverNow = () => null

export function Countdown({ at, label }: CountdownProps) {
  const target = Date.parse(at)
  const now = useSyncExternalStore<number | null>(subscribe, clientNow, serverNow)

  const live = now !== null && now >= target
  const values = now === null ? null : split(target - now)

  const localTime =
    now === null
      ? null
      : new Intl.DateTimeFormat(undefined, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        }).format(target)

  if (live) {
    return (
      <div className="countdown" role="status">
        <p className="countdown-live">We are live. Jump in!</p>
      </div>
    )
  }

  return (
    <div className="countdown">
      <p className="countdown-label">{label}</p>
      <div className="countdown-grid" role="timer" aria-live="off">
        {UNITS.map(([unit], i) => (
          <div className="countdown-cell" key={unit}>
            <span className="countdown-value">
              {values === null ? '--' : String(values[i]).padStart(2, '0')}
            </span>
            <span className="countdown-unit">{unit}</span>
          </div>
        ))}
      </div>
      {localTime ? <p className="countdown-local">That is {localTime} where you are.</p> : null}
    </div>
  )
}
