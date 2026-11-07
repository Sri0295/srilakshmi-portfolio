import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'

type Variant = 'primary' | 'ghost'

interface MagneticProps {
  children: ReactNode
  variant?: Variant
  className?: string
  cursor?: string
}

export function MagneticLink({
  children,
  variant = 'primary',
  className = '',
  cursor,
  ...rest
}: MagneticProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useMagnetic<HTMLAnchorElement>(0.3)
  const base = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`
  return (
    <a ref={ref} className={`${base} ${className}`} data-cursor={cursor} {...rest}>
      {children}
    </a>
  )
}

export function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  cursor,
  ...rest
}: MagneticProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>(0.3)
  const base = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`
  return (
    <button ref={ref} type="button" className={`${base} ${className}`} data-cursor={cursor} {...rest}>
      {children}
    </button>
  )
}
