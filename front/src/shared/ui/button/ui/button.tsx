import React from 'react'
import classes from '../styles/styles.module.scss'
import { type typeButtonProps } from '../types/types'

export const Button: React.FC<typeButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  disabled,
  onClick,
  children,
  ...otherProps
}) => (
  <button
    className={classes.button}
    disabled={disabled}
    onClick={onClick}
    {...otherProps}
  >
    
    {children}
    
  </button>
)
