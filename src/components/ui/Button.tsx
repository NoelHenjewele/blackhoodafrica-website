import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'outline' | 'outline-light' | 'gold'

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  outline: 'btn btn-outline',
  'outline-light': 'btn btn-outline-light',
  gold: 'btn btn-gold',
}

interface BaseProps {
  variant?: Variant
  icon?: ReactNode
  className?: string
  children: ReactNode
}

interface AsLink extends BaseProps {
  to: string
  onClick?: never
  type?: never
}

interface AsAnchor extends BaseProps {
  href: string
  target?: string
  rel?: string
  onClick?: never
}

interface AsButton extends BaseProps {
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button(props: AsLink | AsAnchor | AsButton) {
  const { variant = 'primary', icon, className = '', children } = props
  const classes = `${variantClass[variant]} ${className}`.trim()

  if ('to' in props) {
    return (
      <Link to={props.to} className={classes}>
        {children}
        {icon}
      </Link>
    )
  }

  if ('href' in props) {
    return (
      <a href={props.href} target={props.target} rel={props.rel} className={classes}>
        {children}
        {icon}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
    >
      {children}
      {icon}
    </button>
  )
}
