export type typeContainerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  title: string
  description?: React.ReactNode
  props?: Record<string, string>[]
  components?: React.ReactNode
  componentsClassName?: string
}
