**Work-in-progress prototype**

Worldmap component for location-based visualization. Demo storybook 'worldmap.stories' with 1-day NYC taxi rides location-aggregated dataset.

## 🦒 TODO

- fix rendering issues & interaction with React
  - use React wrapper for OpenLayers???, or
  - check Leaflet maps library (simpler API, may not support features we may need in the distant future?) 
  - tooltip breaks heatmap (looks like featureLayer is not rendered)
- configurable sources (Mapbox, OSM, etc)?
- support other geometries eg. lines for showing tracks (fleet mgmt use case) - 'linemap' variant
