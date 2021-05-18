import React, {FunctionComponent} from 'react'
import BingLayer from './Bing'
import {LayersControl} from 'react-leaflet'

interface Props {
  bingKey: string
  mapStyle?: string
}

export const BingMap: FunctionComponent<Props> = ({bingKey, mapStyle}) => {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer
        checked={!mapStyle || mapStyle === 'Roads'}
        name="Roads"
      >
        <BingLayer minNativeZoom={3} bingkey={bingKey} type="Road" />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer
        checked={mapStyle === 'Satellite (plain)'}
        name="Satellite (Plain)"
      >
        <BingLayer minNativeZoom={3} bingkey={bingKey} />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer
        checked={mapStyle === 'Satellite'}
        name="Satellite (Labels)"
      >
        <BingLayer
          minNativeZoom={3}
          bingkey={bingKey}
          type="AerialWithLabels"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer checked={mapStyle === 'Dark'} name="Dark mode">
        <BingLayer minNativeZoom={3} bingkey={bingKey} type="CanvasDark" />
      </LayersControl.BaseLayer>
    </LayersControl>
  )
}
