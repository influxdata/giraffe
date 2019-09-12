import React, {FC, MouseEvent} from 'react'

import './Button.css'

interface Props {
  kind?: 'default' | 'primary'
  className?: string
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => any
}

export const Button: FC<Props> = ({
  kind = 'default',
  className = '',
  disabled,
  onClick,
  children,
}) => {
  return (
    <button
      className={`button ${className} button--${kind}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
