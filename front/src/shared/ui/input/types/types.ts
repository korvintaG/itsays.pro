import React, { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

type BaseProps = {
  error?: boolean
  label: string
  value: string
  name?: string
}

export type SingleLineInputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }

export type MultiLineInputProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  }

export type InputProps = SingleLineInputProps | MultiLineInputProps
  