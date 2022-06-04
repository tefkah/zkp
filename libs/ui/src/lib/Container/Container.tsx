import { DetailedHTMLProps, HTMLAttributes } from 'react'

export interface ContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode
}

export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-7xl sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </div>
  )
}

export default Container
