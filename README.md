This repository contains Giraffe, a React-based visualization library used to implement the [InfluxDB 2.0](https://github.com/influxdata/influxdb/) UI.

**This library is currently in a pre-alpha state.**
Docs will follow as soon as the API has a chance to stabilize.

## Features

There exist plenty of terrific visualization libraries in the JavaScript ecosystem.
Giraffe aims to distinguish itself with several features:

- A high-level [_Grammar of Graphics_](http://vita.had.co.nz/papers/layered-grammar.pdf) style API that can specify a wide variety of visualizations with a few simple concepts
- A [columnar](https://observablehq.com/@mbostock/manipulating-flat-arrays) interface for input data that enables efficient interop with Web Workers and [Apache Arrow](https://arrow.apache.org/)
- Easy reactivity and extensibility via React
- Self-contained configs in the style of [Vega-Lite](https://vega.github.io/vega-lite/)
- Support for mapping groupings of columns to a single visual aesthetic

## Development

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Thanks

<a href="https://www.chromaticqa.com/">
  <img src="https://cdn-images-1.medium.com/letterbox/147/36/50/50/1*oHHjTjInDOBxIuYHDY2gFA.png?source=logoAvatar-d7276495b101---37816ec27d7a" width="120"/>
</a>

Thanks to [Chromatic](https://www.chromaticqa.com/) for providing us with a snapshot testing platform.
