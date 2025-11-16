import React, { type InputHTMLAttributes, } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
  }
  