import React, {  useRef } from 'react'
import styles from '../styles/styles.module.scss'
import clsx from 'clsx'
import type { InputProps } from '../types/types'


const Input: React.FC<InputProps> = ({
  error = false,
  value,
  label,
  type = 'text',
  onChange,
  name,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState(value ?? '')

  React.useEffect(() => {
    if (typeof value === 'string') setInputValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (onChange) onChange(e)
  }


  return (
    <div className={styles.inputWrapper}>
      {value && (
        <label className={styles.inputLabel} >
          {label}
        </label>
      )}
        <input
          ref={inputRef}
          className={clsx(styles.inputField, error && styles.error, inputValue && !error && styles.valid)}
          type={type}
          name={name}
          value={inputValue}
          placeholder={label}
          onChange={handleChange}
          {...props}
        />
      </div>
  )
}

export { Input }
