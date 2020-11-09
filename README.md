# Giraffe

[![Slack Status](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://www.influxdata.com/slack)

A React-based visualization library powering the data visualizations in the [InfluxDB 2.0](https://github.com/influxdata/influxdb/) UI.

<img src="https://influxdata.github.io/branding/img/mascots/mascot-chronograf--white_png.png" height="100" alt="giraffe"/>

## Features

There are plenty of terrific visualization libraries in the JavaScript ecosystem.
Giraffe aims to distinguish itself with several features:

- Support for the [Flux](https://www.influxdata.com/products/flux) language
- Easy reactivity and extensibility via React
- Support for mapping groupings of columns to a single visual aesthetic
- A high-level [Grammar of Graphics](http://vita.had.co.nz/papers/layered-grammar.pdf)–style API that can specify a wide variety of visualizations with a few simple concepts
- A [columnar](https://observablehq.com/@mbostock/manipulating-flat-arrays) interface for input data that enables efficient interoperability with Web Workers and [Apache Arrow](https://arrow.apache.org/)
- Self-contained configurations in the style of [Vega-Lite](https://vega.github.io/vega-lite/)

## Demos

[See the visualizations in action using Storybook.](https://influxdata.github.io/giraffe)

## Getting Started [](#getting-started)

#### Installation

Install [Giraffe](https://www.npmjs.com/package/@influxdata/giraffe) with your package manager:

```
yarn add @influxdata/giraffe
```

or

```
npm install @influxdata/giraffe
```

#### Example

See the [Quick Start Guide](./giraffe/README.md#quick-start) for an example.

## Development

To contribute to Giraffe, see the [contributing guide](./CONTRIBUTING.md).

Looking for details on the configuration? See the [configuration guide](./giraffe/README.md#config).
