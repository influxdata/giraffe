This repository contains Giraffe, a React-based visualization library used in the [InfluxDB 2.0](https://github.com/influxdata/influxdb/) UI.

**This library is currently in pre-beta**

## 🦒 Features

There exist plenty of terrific visualization libraries in the JavaScript ecosystem.
Giraffe aims to distinguish itself with several features:

- A high-level [_Grammar of Graphics_](http://vita.had.co.nz/papers/layered-grammar.pdf) style API that can specify a wide variety of visualizations with a few simple concepts
- A [columnar](https://observablehq.com/@mbostock/manipulating-flat-arrays) interface for input data that enables efficient interop with Web Workers and [Apache Arrow](https://arrow.apache.org/)
- Easy reactivity and extensibility via React
- Support for mapping groupings of columns to a single visual aesthetic
- Supports [Flux](https://www.influxdata.com/products/flux)
- Self-contained configs in the style of [Vega-Lite](https://vega.github.io/vega-lite/)

## Getting Started [](#getting-started)

Install [giraffe](https://www.npmjs.com/package/@influxdata/giraffe)

Looking to render a graph? Do the following:

1. In your React component, import the `Plot` component

```
import {Plot} from '@influxdata/giraffe'
```

2. Build a config object

```
const config = {
  table,
  valueFormatters: {
    _time: timeFormatter({timeZone, format: timeFormat}),
    _value: val =>
      `${val.toFixed(2)}${
        valueAxisLabel ? ` ${valueAxisLabel}` : valueAxisLabel
      }`,
  },
  xScale,
  yScale,
  legendFont,
  tickFont,
  showAxes,
  layers: [
    {
      type: 'line',
      x,
      y,
      fill,
      position,
      interpolation,
      colors,
      lineWidth,
      hoverDimension,
      shadeBelow,
      shadeBelowOpacity,
    },
  ],
}
```

3. Render your component by passing the `confg` object as props to the `<Plot>` component and wrapping it with a sizer. For example, your function component or your class component's render method will return the following element:

```
  <div
    style={{
      width: "calc(70vw - 20px)",
      height: "calc(70vh - 20px)",
      margin: "40px",
    }}
  >
    <Plot config={config} />
  </div>
```

## Development

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Thanks

<a href="https://www.chromaticqa.com/">
  <img src="https://cdn-images-1.medium.com/letterbox/147/36/50/50/1*oHHjTjInDOBxIuYHDY2gFA.png?source=logoAvatar-d7276495b101---37816ec27d7a" width="120"/>
</a>

Thanks to [Chromatic](https://www.chromaticqa.com/) for providing us with a snapshot testing platform.
