import React, { useState } from 'react'
import { UIContainer } from '../ui-container'
import styles from './styles.module.scss'
import { Input } from '../../../../shared/ui/input'

export const UIInput: React.FC = () => {
  const [value, setValue] = useState<string>('');
  return (
    <UIContainer
      title="Input"
      description="Input со всеми стандартными props и дополнительными:"
      props={[
        { key: 'label', value: 'Описание поля' }
      ]}
      components={
        <div className={styles.container}>
          <Input label="Email" value={value} onChange={(e)=>setValue(e.target.value)} />
          

        </div>
      }
    />
  )
}
