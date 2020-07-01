import React from 'react'

export interface InjectedHoverProps {
  hoverTime: number | null
  onSetHoverTime: (hoverTime: number | null) => void
}
const {Consumer} = React.createContext<InjectedHoverProps>(null)

export const withHoverTime = <P extends {}>(
  Component: React.ComponentType<P & InjectedHoverProps>
) => (props: P) => (
  <Consumer>
    {hoverTimeProps => <Component {...props} {...hoverTimeProps} />}
  </Consumer>
)
