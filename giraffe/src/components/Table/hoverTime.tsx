import React, {FunctionComponent, useState} from 'react'

interface Props {
  children: JSX.Element | Element
}

export interface InjectedHoverProps {
  hoverTime: number | null
  onSetHoverTime: (hoverTime: number | null) => void
}
const {Provider, Consumer} = React.createContext<InjectedHoverProps>(null)

export const HoverTimeProvider: FunctionComponent<Props> = (props: Props) => {
  const [hoverTime, setHoverTime] = useState(null)
  const [hoverTimeState] = useState({
    hoverTime,
    onSetHoverTime: (ht: number | null) => setHoverTime(ht),
  })
  return <Provider value={hoverTimeState}>{props.children}</Provider>
}

export const withHoverTime = <P extends {}>(
  Component: React.ComponentType<P & InjectedHoverProps>
) => (props: P) => (
  <Consumer>
    {hoverTimeProps => <Component {...props} {...hoverTimeProps} />}
  </Consumer>
)
