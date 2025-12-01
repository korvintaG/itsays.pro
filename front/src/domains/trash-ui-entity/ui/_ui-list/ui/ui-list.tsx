import { UIButton } from '../../button'
import { UIFonts } from '../../fonts'
import { UIInput } from '../../input'
import { UITakePhoto } from '../../take-photo'
import { UIQRCode } from '../../qr-code'
import classes from '../styles/styles.module.scss'

import React from 'react'
import { UIAppHeader } from '../../app-header'
import { UIModalWindow } from '../../modal-window'
import { UILoginForm } from '../../login-form'

export const UIList: React.FC = () => {
  return (
    <div className={classes.container}>
        <UIFonts />
        <UIAppHeader />
        <UIModalWindow />
        <UIButton />
        <UIInput />
        <UITakePhoto />
        <UIQRCode />
        <UILoginForm />
    </div>
  )
}
