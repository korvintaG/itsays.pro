import { UIButton } from '../../button'
import { UIFonts } from '../../fonts'
import { UIInput } from '../../input'
import classes from '../styles/styles.module.scss'

import React from 'react'

export const UIList: React.FC = () => {
  return (
    <div className={classes.container}>
        <UIFonts />
        <UIButton />
        <UIInput />
    </div>
  )
}
