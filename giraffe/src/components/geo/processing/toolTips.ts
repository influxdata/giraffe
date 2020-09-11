// Types
import {Axis} from '../../../types/geo'

export const formatValue = (
  key: string,
  defaultLabel: string,
  value: number,
  dimension: Axis = {}
) => {
  const {label, prefix = '', suffix = ''} = dimension
  const formattedValue = `${prefix}${value}${suffix}`
  if (value !== undefined && value !== null)
    return {
      key: key,
      name: label ? label : defaultLabel,
      type: 'string',
      values: [formattedValue],
    }
}

export const defineToolTipEffect = (markerRefs, setToolTip) => {
  return () => {
    for (let i = 0; i < markerRefs.length; i++) {
      const {markerRef, rowInfo} = markerRefs[i]
      const marker = markerRef.current.leafletElement
      let mouseEntered = false
      marker.on('mouseover', () => {
        if (!mouseEntered) {
          setToolTip(rowInfo)
          mouseEntered = true
        }
      })
      marker.on('mouseout', () => {
        mouseEntered = false
        setToolTip(null)
      })
    }
  }
}
