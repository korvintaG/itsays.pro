import React, {  useRef } from 'react'
import styles from '../styles/styles.module.scss'
import clsx from 'clsx'
import type { InputProps } from '../types/types'


const Input: React.FC<InputProps> = ({
  error = false,
  value,
  label,
  onChange,
  name,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const [inputValue, setInputValue] = React.useState(value ?? '')

  const isMultiline=('multiline' in props && props.multiline);

  React.useEffect(() => {
    if (typeof value === 'string') setInputValue(value)
  }, [value])

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value)
    if (e.target instanceof HTMLTextAreaElement) {
      autoResize(e.target)
    }
    // @ts-expect-error union handled by props type
    if (onChange) onChange(e)
  }

  React.useEffect(() => {
    if (isMultiline) {
      const el = inputRef.current
      if (el && el instanceof HTMLTextAreaElement) {
        autoResize(el)
      }
    }
  }, [])


  return (
    <div className={isMultiline ? styles.inputWrapperMultiline : styles.inputWrapper }>
      {value && (
        <label className={styles.inputLabel} >
          {label}
        </label>
      )}
        {isMultiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={clsx(styles.textField, error && styles.error, inputValue && !error && styles.valid)}
            name={name}
            value={inputValue}
            placeholder={label}
            onChange={handleChange}
            rows={1}
            style={{ overflow: 'hidden', resize: 'none', minHeight: 0 }}
            {...(props as any)}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={clsx(styles.inputField, error && styles.error, inputValue && !error && styles.valid)}
            type={(props as any)?.type ?? 'text'}
            name={name}
            value={inputValue}
            placeholder={label}
            onChange={handleChange}
            {...(props as any)}
          />
        )}
      </div>
  )
}

export { Input }
