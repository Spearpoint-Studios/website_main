'use client'

import { useEffect, useRef, useState } from 'react'

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Fades and rises its children into place the first time they enter the
 * viewport. Shared by every below-the-fold section so the observer wiring
 * lives in one place instead of being repeated per section.
 *
 * Reduced motion is handled in CSS (`.reveal` under
 * `prefers-reduced-motion: reduce` in globals.css), not here, so content is
 * guaranteed visible even if this effect never runs.
 */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const classes = ['reveal', visible ? 'is-visible' : '', className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  )
}
