import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

export function MagneticLink({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const base = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`
  return (
    <a className={`${base} ${className}`} {...rest}>
      {children}
    </a>
  )
}

export function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-ghost'}`
  return (
    <button type="button" className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  )
}
