import classes from '../styles/styles.module.scss'
import { type typeContainerProps } from '../types/types'
import clsx from 'clsx'

export const UIContainer: React.FC<typeContainerProps> = ({
  className,
  title,
  description,
  components,
  props,
  componentsClassName,
  ...otherProps
}) => {
  return (
    <div className={clsx(classes.container, className)} {...otherProps}>
      <h2>{title}</h2>
      {description && <div className={classes.description}>{description}</div>}
      {props && (
        <div className={classes.props}>
          {props.map(prop => (
            <div key={prop.key}>
              <pre>{prop.key}</pre> - {prop.value}
            </div>
          ))}
        </div>
      )}
      {components && <div className={clsx(classes.components, componentsClassName)}>{components}</div>}
    </div>
  )
}
