# Giraffe

[![Slack Status](https://img.shields.io/badge/slack-join_chat-white.svg?logo=slack&style=social)](https://www.influxdata.com/slack)

A React-based visualization library powering the data visualizations in [InfluxDB 2.0](https://github.com/influxdata/influxdb/) UI.

<img src="https://influxdata.github.io/branding/img/mascots/mascot-chronograf--white_png.png" height="100" alt="giraffe"/>

## Demos

[See the visualizations in action using Storybook](https://influxdata.github.io/giraffe)

## Quick Start
Giraffe can be used in a simple index.html page without any advanced configuration. Even though Giraffe is designed to work with React apps, you won't need React or Node.js to do the quickstart below.

In this quickstart, we're going to build a simple line graph using Giraffe in a single index file. All you'll need is a text editor.

1. Set up your `index.html` file:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Giraffe</title>
    </head>

    <body id="home">
      <main id="root"></main>
    </body>
    </html>
    ```
    Save this file as `index.html`.

1. Add script imports of React, React-DOM, and Giraffe to the bottom of the `head` section.
    ```html
      <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
      <script crossorigin src="https://unpkg.com/@influxdata/giraffe"></script>
    </head>
    ```
1. Wire up a simple React element. Add a script tag under `main` in the `body` of the html document, and then render a simple element onto the page using React.
    ```html
      <main id="root"></main>
      <script type="text/javascript">
        ReactDOM.render(
          React.createElement('h1', null, 'Hello World'),
          document.getElementById('root')
        );
      </script>
    </body>
    ```

1. Open `index.html` in a browser. You should see a header with Hello World as the text.

1. Create a wrapper element for the Giraffe `Plot` we'll be rendering into. Add it to the script tag under `root`:
    ```html
    <main id="root"></main>
      <script type="text/javascript">
        class PlotRenderer extends React.Component {
          render() {
            const style = {
              width: "calc(70vw - 20px)",
              height: "calc(70vh - 20px)",
              margin: "40px",
            };
            return React.createElement('div', {style}, 'Giraffe Plot Goes Here');
          }
        }
      <script>
    ```

1. And have React render that element. Change the `ReactDOM.render` call to:
    ```js
    ReactDOM.render(
      React.createElement(PlotRenderer, null, null),
      document.getElementById('root')
    );
    ```
    Open up `index.html`. You should see Giraffe Plot Goes Here where it used to say Hello World.

1. Our last step is to create some fake data and then draw that fake data into a plot. First, we'll create a configuration object that tells Giraffe to render a line graph. In the render method of `PlotRenderer`, add the following code:
    ```js
    const lineLayer = {
      type: "line",
      x: "_time",
      y: "_value"
    };
    ```

1. Let's create the fake data. After the `lineLayer` code, add the following:
    ```js
    const table = Giraffe.newTable(3)
      .addColumn('_time', 'dateTime:RFC3339', 'time', [1589838401244, 1589838461244, 1589838521244])
      .addColumn('_value', 'double', 'number', [2.58, 7.11, 4.79]);
    ```

1. Now we'll combine them into a `config` object. Add this after the line that creates `table`:
    ```js
    const config = {
      table,
      layers: [lineLayer]
    };
    ```

1. Finally, let's create a `Plot` with this configuration and render it. Below the line that creates `config` in the `render` method, add the following code:
    ```js
    const SimplePlot = React.createElement(Giraffe.Plot, {config}, null);
    return React.createElement('div', {style}, SimplePlot);
    ```
    And there you have it.

1. Here is the full `index.html` file:
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Giraffe</title>
      <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
      <script crossorigin src="https://unpkg.com/@influxdata/giraffe"></script>
    </head>

    <body id="home">
      <main id="root"></main>
      <script type="text/javascript">
        class PlotRenderer extends React.Component {
          render() {
            const style = {
              width: "calc(70vw - 20px)",
              height: "calc(70vh - 20px)",
              margin: "40px",
            };

            const lineLayer = {
              type: "line",
              x: "_time",
              y: "_value"
            };

            const table = Giraffe.newTable(3)
              .addColumn('_time', 'dateTime:RFC3339', 'time', [1589838401244, 1589838461244, 1589838521244])
              .addColumn('_value', 'double', 'number', [2.58, 7.11, 4.79]);

            const config = {
              table,
              layers: [lineLayer]
            };

            const SimplePlot = React.createElement(Giraffe.Plot, {config}, null);
            return React.createElement('div', {style}, SimplePlot);
          }
        }

        ReactDOM.render(
          React.createElement(PlotRenderer),
          document.getElementById('root')
        );
      </script>
    </body>
    </html>

    ```


#### Examples Using Flux [](#example-using-flux)

##### 1. Generating the table through a Flux result

When generating the table through a Flux result:

- call the `fromFlux` utility function on the CSV generated by Flux
- get the table in the returned object from calling `fromFlux`

Here is an example of turning a result in comma separate values (CSV) from Flux into a table and rendering it without optional properties:

  <pre>
  import {Plot, fromFlux} from '@influxdata/giraffe'

  // ...

  const fluxResultCSV = `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,true,true,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,example,location
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:31:33.95Z,29.9,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:55:23.863Z,28.7,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:50:52.357Z,15,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:37.198Z,24.8,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:53.033Z,23,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T20:19:21.88Z,20.1,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-10T22:20:40.776Z,28.7,value,temperature,index.html,browser
`

  const dataFromFlux = fromFlux(fluxResultCSV)

  const lineLayer = {
    type: "line",
    x: "_time",
    y: "_value",
  }

  const config = {
    table: dataFromFlux.table,
    layers: [lineLayer],
  }

  // ...

  // return this element in your React rendering code:

  &#60;div
    style={{
      width: "calc(70vw - 20px)",
      height: "calc(70vh - 20px)",
      margin: "40px",
    }}
  &#62;
    &#60;Plot config={config} /&#62;
  &#60;/div&#62;
  </pre>

##### 2. Using CSV from a Flux query

When using the comma separated values (CSV) from the Flux query as the `fluxResponse` property:

  <pre>
  import {Plot} from '@influxdata/giraffe'

  // ...

  const fluxResponse = `#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#group,false,false,true,true,false,false,true,true,true,true
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,example,location
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:31:33.95Z,29.9,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T18:55:23.863Z,28.7,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:50:52.357Z,15,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:37.198Z,24.8,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T19:53:53.033Z,23,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-03T20:19:21.88Z,20.1,value,temperature,index.html,browser
,,0,2020-03-25T20:58:15.731129Z,2020-04-24T20:58:15.731129Z,2020-04-10T22:20:40.776Z,28.7,value,temperature,index.html,browser
`

  const lineLayer = {
    type: "line",
    x: "_time",
    y: "_value",
  }

  const config = {
    fluxResponse,
    layers: [lineLayer],
  }

  // ...

  // return this element in your React rendering code:

  &#60;div
    style={{
      width: "calc(70vw - 20px)",
      height: "calc(70vh - 20px)",
      margin: "40px",
    }}
  &#62;
    &#60;Plot config={config} /&#62;
  &#60;/div&#62;
  </pre>

## Config

`<Plot>` requires a `config` prop which is an object with properties that serve three purposes:

- [appearance](#appearance-properties) customization for sizing and framing
- [data](#data-properties) store, getters and setters, and plot-type specific options
- [legend (tooltip)](#legend-tooltip-properties) customization

<pre>
  const config = {
    <b><i>property</i></b>: <b><i>value</i></b>,
    <b><i>...</i></b>
  }
</pre>

### Appearance properties

- **width**: _number. Optional._ The width in _CSS px_ of the Plot. Includes the space to the left of the axes surrounding the ticks, tick labels, and axis labels. When not specified, the width of `<Plot>`'s parent element will determine the width.

- **height**: _number. Optional._ The height in _CSS px_ of the Plot. Includes the space below the axes surrounding the ticks, tick labels, and axis labels. When not specified, the height of `<Plot>`'s parent element will determine the height.

- **gridColor**: _string. Optional._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the grid lines. Applies to the inner horizontal and vertical rule lines. Excludes the axes and the border around the graph.

- **cursor**: _string. Optional. Defaults to "crosshair" when excluded._ The [_CSS cursor_](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) property when the cursor is inside the rendered area of `<Plot>`.

- **gridOpacity**: _number. Optional. Recommendation: do not include. Defaults to 1 when excluded._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the grid lines. Applies to the inner horizontal and vertical rule lines. Excludes the axes and the border around the graph.

- **showAxes**: _boolean. Optional. Recommendation: do not include. Defaults to true when excluded. Exception: not configurable and always false for Gauge, RawFluxDataTable, TableGraph._ Indicates whether Plot axes should be visible. Applies to both x-axis and y-axis simultaneously.

- **axisColor**: _string. Optional._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the axes and the border around the graph. Excludes the inner horizontal and vertical rule lines.

- **axisOpacity**: _number. Optional. Recommendation: do not include. Defaults to 1 when excluded._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the axes and the border around the graph. Excludes the inner horizontal and vertical rule lines.

- **xTicks**: _array[number, ...]. Optional._ An array of values representing tick marks on the x-axis. Actual data values and axis scaling may cause Plot to not render all of the given ticks, or Plot rendering may extend beyond all of the rendered ticks. When this option is included, **xTotalTicks**, **xTickStep**, **xTickStart** are ignored.

- **xTotalTicks**: _number. Optional. **Ignored when xTicks is specified**._ A number representing the maximum possible number of ticks to generate on the x-axis. Uses the **xTickStep** as the tick interval if also included. Otherwise the tick interval is taken from dividing the length of the rendered domain by this number. The actual number of rendered ticks may be less than this number due to the size of the tick interval.

- **xTickStep**: _number. Optional. **Ignored when xTicks is specified**._ A number representing the tick interval for the x-axis. May be negative.

- **xTickStart**: _number. Optional. **Ignored when xTicks is specified**._ A number representing a value less than or equal to the first tick on the x-axis. This number will determine the placement of all subsequent ticks. It and any subsequent ticks will be rendered only if they fall within the domain. This number _is_ the value of the first tick when it is in the domain, and at least one of **xTickStep** or **xTotalTicks** is included.

- **yTicks**: _array[number, ...]. Optional._ An array of values representing tick marks on the y-axis. Actual data values and axis scaling may cause Plot to not render all of the given ticks, or Plot rendering may extend beyond all of the rendered ticks. When this option is included, **yTotalTicks**, **yTickStep**, **yTickStart** are ignored.

- **yTotalTicks**: _number. Optional. **Ignored when yTicks is specified**._ A number representing the maximum possible number of ticks to generate on the y-axis. Uses the **yTickStep** as the tick interval if also included. Otherwise the tick interval is taken from dividing the length of the rendered domain by this number. The actual number of rendered ticks may be less than this number due to the size of the tick interval.

- **yTickStep**: _number. Optional. **Ignored when yTicks is specified**._ A number representing the tick interval for the y-axis. May be negative.

- **yTickStart**: _number. Optional. **Ignored when yTicks is specified**._ A number representing a value less than or equal to the first tick on the y-axis. This number will determine the placement of all subsequent ticks. It and any subsequent ticks will be rendered only if they fall within the domain. This number _is_ the value of the first tick when it is in the domain, and at least one of **yTickStep** or **yTotalTicks** is included.

- **tickFont**: _string. Optional._ The [_CSS font_](https://developer.mozilla.org/en-US/docs/Web/CSS/font) value for the styling of the tick labels and axis labels.

- **tickFontColor**: _string. Optional._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the tick labels and axis labels.

- **valueFormatters**: _object. Optional._ An object containing column keys and their corresponding functions that format data for that column type. Each function takes a data value as the first argument, and an optional second argument as an options object. Returns a formatted string for that data value. For example:

  <pre>
  const config = {
    // ...

    valueFormatters: {
      _time: (t) => new Date(t).toLocaleTimeString(),  // ECMAScript time to human-readable time stamp
      _value: (num) => num.toFixed(2),                 // values fixed to 2 decimal places
    },

    // ...
  }
  </pre>

- **xAxisLabel**: _string. Optional._ Uses **tickFont**, **tickFontColor**. Name to display below the x-axis.

- **yAxisLabel**: _string. Optional._ Uses **tickFont**, **tickFontColor**. Name to display to the left of the y-axis.

### Data properties

- **table**: _Object. Optional. When missing, `config` will look for **fluxResponse** to create the **table**. When both are missing, `config` will create an empty **table**._ A data object produced by [Giraffe's utility functions](#utility-functions). Houses the data and getters and setters for that data, for the `<Plot>`.

  - the `table` property of the return value from the `fromFlux` utility function.
  - the return value from the `fromRows` utility function.
  - the return value from the `newTable` utility function.

- **fluxResponse**: _String. Optional. Ignored when **table** is present; **table** takes precendence. When both are missing, `config` will create an empty **table**._ [A string of comma separated values returned from a Flux query representing the data to be visualized](https://github.com/influxdata/flux/blob/master/docs/SPEC.md#csv).

- **layers**: _array[Object, ...]. **Required**._ An array of [LayerConfig objects](#layerconfig). These objects are customizations specific to a type of `<Plot>`. Currently, Giraffe supports only one pre-defined `<Plot>` type per graph with any number of "custom layers". Custom layers are not pre-defined in Giraffe, but created through a callback render function in the configuration.

- **xScale**: _"linear" | "log". Optional._ Sets the scaling function to be used on the x-axis internally by Giraffe to generate values for resources, such as tick marks.

  - "linear" scaling means the same distance between ticks represents the same increase in value.
  - "log" (logarithmic) scaling means the same distance between ticks can represent an exponential increase in value, used as a way to display data with a very wide range of values in a compact space.

- **yScale**: _"linear" | "log". Optional._ Sets the scaling function to be used on the y-axis internally by Giraffe to generate values for resources, such as tick marks.

  - "linear" scaling means the same distance between ticks represents the same increase in value.
  - "log" (logarithmic) scaling means the same distance between ticks can represent an exponential increase in value, used as a way to display data with a very wide range of values in a compact space.

- **xDomain**: _array[min, max]. Optional._ The x domain of the plot can be explicitly set with numbers denoting a minimum and a maximum value for the x-axis. If this option is passed, both _min_ and _max_ are required to be numbers, making the `<Plot>` operate in a "controlled" mode, where it always uses the passed x domain to set the minimum and maximum value of the x-axis. Any brush interaction with the `<Plot>` that should change the x domain will call the `onSetXDomain` option when the component is in controlled mode. Double clicking the plot will call `onResetXDomain`. If the `xDomain` option is not passed, then the component is "uncontrolled". It will compute, set, and reset the `xDomain` automatically.

- **onSetXDomain**: _function(array[min, max]). Optional._ See above regarding **xDomain**.

- **onResetXDomain**: _function(). Optional._ See above regarding **xDomain**.

- **yDomain**: _array[min, max]. Optional._ The y domain of the plot can be explicitly set with numbers denoting a minimum and a maximum value for the y-axis. If this option is passed, both _min_ and _max_ are required to be numbers, making the `<Plot>` operate in a "controlled" mode, where it always uses the passed y domain. Any brush interaction with the `<Plot>` that should change the y domain will call the `onSetYDomain` option when the component is in controlled mode. Double clicking the plot will call `onResetYDomain`. If the `yDomain` option is not passed, then the component is "uncontrolled". It will compute, set, and reset the `yDomain` automatically.

- **onSetYDomain**: _function(array[min, max]). Optional._ See above regarding **yDomain**.

- **onResetYDomain**: _function(). Optional._ See above regarding **yDomain**.

### Legend Tooltip properties

- **legendFont**: _string. Optional. Defaults to '10px monospace' when excluded._ The [_CSS font_](https://developer.mozilla.org/en-US/docs/Web/CSS/font) value for the styling of the legend (tooltip).

- **legendFontColor**: _string. Optional. Defaults to #bec2cc when excluded._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the column headers in the legend (tooltip). The rest of the legend will use the color scheme set by the `LayerConfig`'s `colors` options.

- **legendFontBrightColor**: _string. Optional. Defaults to #f6f6f8 when excluded._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of any text that is not a column header or in a row inside the legend (tooltip).

- **legendBackgroundColor**: _string. Optional. Defaults to #0f0e15 when excluded._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the background in the legend (tooltip).

- **legendColorizeRows**: _boolean. Optional. Defaults to true when excluded._ Toggles the use of colors for the rows in the legend (tooltip). When _true_ the rows will use colors from the color scheme in the rendered graph. When _false_ the rows will use the **legendFontBrightColor** and include small dots of color in the color scheme of the rendered graph.

- **legendBorder**: _string. Optional._ The [_CSS border_](https://developer.mozilla.org/en-US/docs/Web/CSS/border) value for the styling of the border around the legend (tooltip).

- **legendCrosshairColor**: _string | Object. Optional._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) or styling of the vertical crosshair line through the Plot at where the mouse is hovering, defined as a [_CanvasRenderingContext2D strokeStyle_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle).

- **legendColumns**: _array[string, ...]. Optional._ When included, this array will determine which column key names that should be included in the legend (tooltip). If this option is included as an empty array, the legend will be empty.

- **legendOpacity**: _number. Optional. Defaults to 1.0 when excluded._ The [_CSS opacity_](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity) of the legend (tooltip). 0 means the legend is invisible, while 1.0 means the legend covers anything underneath.

- **legendOrientationThreshold**: _number. Optional. Defaults to undefined when excluded._ The number of columns in the legend that will determine the direction of columns in the legend. When _undefined_ or when the total number of columns is less than or equal to it, the columns in the tooltip will display horizontally. When the total number of columns is greater, the columns will display vertically.

## Utility Functions

Giraffe comes with utility functions.

- **fromFlux**: _function(string)._ Takes a Flux CSV, converts it, and returns a `Table` used in the [table property](#data-properties) of the config.

- **fromRows**: _function([Object, ...], Object)._ The first argument is an array of objects, each representing a row of data. The optional second argument describes the schema for the data. Returns a `Table` used in the [table property](#data-properties) of the config.

- **newTable**: _function(number)._ The argument is a length for a newly created `Table` with no initial data that allows only columns equal to that length to be added. Returns the created `Table`.

## LayerConfig

- **LineLayerConfig**: _Object._ Maximum one per `<Plot>`. Properties are:

  - **type**: _"line". **Required**._ Specifies that this LayerConfig and `<Plot>` is a line graph.

  - **x**: _string. **Required**._ The column key name of the column that should be visualized on the x-axis.

  - **y**: _string. **Required**._ The column key name of the column that should be visualized on the y-axis.

  - **fill**: _array[string, ...]. Optional._ An array of column key names of column filters that should be visualized. If this option is not included, the data in the graph will be interpreted as belonging to a single column.

  - **position**: _"overlaid" | "stacked". Optional._ Indicates whether the line graph's lines have no bearing on other lines (overlaid), or the lines are cumulatives of every line below it, ie [stacked](https://help.infragistics.com/Help/Doc/Silverlight/2011.1/CLR4.0/html/xamWebChart_Stacked_Line_Chart.html).

  - **hoverDimension**: _"x" | "y" | "xy" | "auto". Optional. Defaults to "auto" when not included._ Indicates whether the legend (tooltip) should display all data points along an entire axis during mouse hover.

    - "x" means the legend will display all data points along the y-axis that have the same x-axis value
    - "y" means the legend will display all data points along the x-axis that have the same y-axis value
    - "xy" means the legend will display for a single data point nearest the mouse
    - "auto" means "xy" if the legend has more than **maxTooltipRows** otherwise "auto" means "x"

  - **maxTooltipRows**: _number. Optional. Defaults to 24 when not included._ The maximum number of data rows to display in the legend (tooltip). Subject to screen size limitations and is not responsive or adaptive. Scrolling not implemented.

  - **interpolation**: _string. Optional. Defaults to "linear" when not included._ The style of the path between two data points on the same line. For example, "linear" is a straight path between two data points. The options are [linear](https://github.com/d3/d3-shape#curveLinear), [natural](https://github.com/d3/d3-shape#curveNatural), [monotoneX](https://github.com/d3/d3-shape#curveMonotoneX), [monotoneY](https://github.com/d3/d3-shape#curveMonotoneY), [cubic](https://github.com/d3/d3-shape#curveBasis), [step](https://github.com/d3/d3-shape#curveStep), [stepBefore](https://github.com/d3/d3-shape#curveStepBefore), and [stepAfter](https://github.com/d3/d3-shape#curveStepAfter).

  - **lineWidth**: _number. Optional._ The [CanvasRenderingContext2D lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) of each graph line.

  - **colors**: _array[string, ...]. Optional._ An array of _CSS color values_ used as a gradient to give multiple lines in the graph different colors based on the **fill** columns.

  - **shadeBelow**: _boolean. Optional._ Uses **colors**. Indicates whether the area below each line should be shaded.

  - **shadeBelowOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the shaded color below each line. No effect when **shadeBelow** is false or not included.

- **BandLayerConfig**: _Object._ Maximum one per `<Plot>`. Properties are:

  - **type**: _"band". **Required**._ Specifies that this LayerConfig and `<Plot>` is a band chart.

  - **x**: _string. **Required**._ The column key name of the column that should be visualized on the x-axis.

  - **y**: _string. **Required**._ The column key name of the column that should be visualized on the y-axis.

  - **fill**: _array[string, ...]. **Required**._ An array of column key names of column filters that should be visualized.

  - **hoverDimension**: _"x" | "y" | "xy" | "auto". Optional. Defaults to "xy" when not included._ Indicates whether the legend (tooltip) should display all data points along an entire axis during mouse hover.

    - "x" means the legend will display all data points along the y-axis that have the same x-axis value
    - "y" means the legend will display all data points along the x-axis that have the same y-axis value
    - "xy" means the legend will display for a single data point nearest the mouse
    - "auto" means "xy" if the legend has more than **maxTooltipRows** otherwise "auto" means "x"

  - **maxTooltipRows**: _number. Optional. Defaults to 24 when not included._ The maximum number of data rows to display in the legend (tooltip). Subject to screen size limitations and is not responsive or adaptive. Scrolling not implemented.

  - **interpolation**: _string. Optional. Defaults to "linear" when not included._ The style of the path between two data points on the same line. For example, "linear" is a straight path between two data points. The options are [linear](https://github.com/d3/d3-shape#curveLinear), [natural](https://github.com/d3/d3-shape#curveNatural), [monotoneX](https://github.com/d3/d3-shape#curveMonotoneX), [monotoneY](https://github.com/d3/d3-shape#curveMonotoneY), [cubic](https://github.com/d3/d3-shape#curveBasis), [step](https://github.com/d3/d3-shape#curveStep), [stepBefore](https://github.com/d3/d3-shape#curveStepBefore), and [stepAfter](https://github.com/d3/d3-shape#curveStepAfter).

  - **lineWidth**: _number. Optional._ The [CanvasRenderingContext2D lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) of the middle part of each band as identified by the **name** option.

  - **colors**: _array[string, ...]. Optional._ An array of _CSS color values_ used as a gradient to give multiple lines in the graph different colors based on the **fill** columns.

  - **lineOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the middle part of each band as identified by the **name** option.

  - **shadeOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the shaded sections of each band.

  - **mainColumnName**: _string. **Required**._ A string indicating the yield name of the line for the middle part of each band. This **mainColumnName** must match the result in the data. If no matching name within the data is found, that result will not be rendered. Only one yield name can be the **mainColumnName** per `<Plot>`.

  - **upperColumnName**: _string. Optional._ A string indicating the shaded portion of each band that extends above the **mainColumnName** line.

  - **lowerColumnName**: _string. Optional._ A string indicating the shaded portion of each band that extends below the **mainColumnName** line.

- **ScatterLayerConfig**: _Object._ Maximum one per `<Plot>`. Properties are:

  - **type**: _"scatter". **Required**._ Specifies that this LayerConfig and `<Plot>` is a scatter plot.

  - **x**: _string. **Required**._ The column key name of the column that should be visualized on the x-axis.

  - **y**: _string. **Required**._ The column key name of the column that should be visualized on the y-axis.

  - **fill**: _array[string, ...]. Optional._ An array of column key names of column filters that should be visualized. If this option is not included, the data in the graph will be interpreted as belonging to a single column.

  - **colors**: _array[string, ...]. Optional._ An array of _CSS color values_ used as a gradient to give dots in the graph different colors based on the **fill** columns.

  - **symbol**: _array[string, ...]. Optional._ An array of columm key names of column filters that should be visualized. Acts like a secondary **fill** using different symbols for the dots rather than **colors**. Limited to 6 different symbols. Symbols will repeat above limit.

* **HistogramLayerConfig**: _Object._ Maximum one per `<Plot>`. Properties are:

  - **type**: _"histogram". **Required**._ Specifies that this LayerConfig and `<Plot>` is a [histogram](https://en.wikipedia.org/wiki/Histogram).

  - **x**: _string. **Required**._ The column key name of the column that should be visualized on the x-axis. Note: the y-axis is always the count.

  - **binCount**: _number. Optional. Defaults to using [Sturges' Formula](https://en.wikipedia.org/wiki/Histogram#Sturges) when not included._ The number of buckets or bins on the x-axis. The range of values that fall into each bin depends on the scale and domain of the x-axis.

  - **fill**: _array[string, ...]. Optional._ An array of column key names of column filters that should be visualized. If this option is not included, the data in the graph will be interpreted as belonging to a single column.

  - **position**: _"overlaid" | "stacked". Optional._ Indicates whether the fill columns of different colors for the same bin should cover each other ("overlaid") or be "stacked" upon each other touching only at the borders. When "overlaid" the covering order follows the same order as found in each column of the data, with the lower indexed values covered by the higher indexed values.

  - **colors**: _array[string, ...]. Optional._ An array of _CSS color values_ used as a gradient to give bars in each bin different colors based on the **fill** columns.

  - **fillOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the shading inside the bins.

  - **strokeOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the border of the bins. This is very hard to observe with human eyes unless the **fillOpacity** is near 0.

  - **strokeWidth**: _number. Optional._ The [_CanvasRenderingContext2D lineWidth_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) of the border of the bins. This is very hard to observe with human eyes unless the **fillOpacity** is near 0. A high value for **strokeWidth** will completely fill the bin with border color at an opacity indicated by **strokeOpacity**.

  - **strokePadding**: _number. Optional._ The space around all four sides of each fill column or bin. The amount of spacing is the _width_ and _height_ used in the [_CanvasRenderingContext2D rect_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect) function.

- **HeatmapLayerConfig**: _Object._ Maximum one per `<Plot>`. Properties are:

  - **type**: _"heatmap". **Required**._ Specifies that this LayerConfig and `<Plot>` is a heatmap.

  - **x**: _string. **Required**._ The column key name of the column that should be visualized on the x-axis.

  - **y**: _string. **Required**._ The column key name of the column that should be visualized on the y-axis.

  - **binSize**: _number. Optional._ The _CSS px_ size of each heat bin. [config's width](#appearance-properties) divided by **binSize** will determine the total number of heat bins along the x-axis. [config's height](#appearance-properties) divided by **binSize** will determine the total number of heat bins along the y-axis.

  - **colors**: _array[string, ...]. Optional._ An array of _CSS color values_ used as the color scheme in the heatmap. The color in index 0 is used to represent the "cold" area or background of the heatmap. The higher the index, the "hotter" the color will represent on the heatmap.

  - **fillOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the shading inside the heat bins. Warning: low opacity is difficult to see visually and may be counterproductive for heatmaps.

  - **strokeOpacity**: _number. Optional._ A value between 0 and 1 inclusive for the [_CanvasRenderingContext2D globalAlpha_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha) of the border of the heat bins. This is very hard to observe with human eyes unless the **fillOpacity** is near 0.

  - **strokeWidth**: _number. Optional._ The [_CanvasRenderingContext2D lineWidth_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) of the border of the bins. This is very hard to observe with human eyes unless the **fillOpacity** is near 0. A high value for **strokeWidth** will completely fill the heat bin with border color at an opacity indicated by **strokeOpacity**.

  - **strokePadding**: _number. Optional._ The space around all four sides of each heat bin. The amount of spacing is the _width_ and _height_ used in the [_CanvasRenderingContext2D rect_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rect) function.

- **RawFluxDataTableLayerConfig**: _Object._ Maximum one per `<Plot>`. Uses its own property called **files** as the data to be rendered. Ignores both **tables** and **fluxResponse** from `config`. Properties are:

  - **type**: _'flux data table'. **Required**._ Specifies that this LayerConfig is a flux data table.

  - **files**: _array[string, ...]. **Required. The data to be rendered**._ An array of strings of comma separated values (CSV). Each CSV string can be taken from a Flux response or manually created. At least one string is required. The string cannot not be an empty string nor a string of only empty space(s).

  - **disableVerticalScrolling**: _boolean. **Optional**. Recommendation: do not include. Defaults to false when excluded._ Disables the vertical scrollbar for the rendered table.

  - **parseObjects**: _boolean. **Optional**. Defaults to false when excluded._ Enables the parsing of JSON objects in the CSV of **files** so that JSON objects are correctly interpreted when there are commas in the object, and prevents all data from being combined into a single column.

- **TableGraphLayerConfig**: _Object._ Maximum one per `<Plot>`. Requires the use of a **`<HoverTimeProvider>`** component around the `<Plot>` and its parent. For example, here is how to properly wrap `<Plot>` to use render a table:

  <pre>
  <b>&#60;HoverTimeProvider&#62;</b>
    &#60;div
      style={{
        width: "calc(70vw - 20px)",
        height: "calc(70vh - 20px)",
        margin: "40px",
      }}
    &#62;
      &#60;Plot config={config} /&#62;
    &#60;/div&#62;
  <b>&#60;/HoverTimeProvider&#62;</b>
  </pre>

TableGraphLayerConfig uses the `fluxResponse` property from `config` as the data to be rendered. Properties are:

- **type**: _'table'. **Required**._ Specifies that this LayerConfig is a table graph.

- **timeZone**: _string. **Required**._ A string representing the desired time zone. Must be an [_official IANA time zone_](https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript).

- **tableTheme**: _string. **Optional**. Defaults to 'dark' when excluded._ The visual theme for the table graph. Currently, the choices are 'dark' and 'light'.

- **properties**: _Object. **Required**._ An object specifying additional options for the table graph. The properties are:

  - **colors**: _array[string, ...]. **Required**._ An array of _CSS color values_ used as a gradient to give rows in the table different colors based on their value. Low values will use colors in the lower indexes while higher values will use colors in the higher indexes.

  - **tableOptions**: _Object. **Required**._ Customizations for the table.

    - **fixFirstColumn**: _boolean. Optional. Defaults to `true` when excluded._ Determines whether the first column in the table should be hidden.

    - **verticalTimeAxis**: _boolean. Optional. Defaults to `true` when excluded._ `true` sets the columns for time values to display vertically with column headings at the top in a horizontal row. `false` will display columns horizontally as rows, with column headings at the left in a vertical column. Warning: when using `false`, any time-like values may cause the entire table to display incorrectly if they are not set to `visible: false` in `fieldOptions`.

    - **sortBy**: _Object. Optional._ An object that represents a column in the table that will be sorted in ascending order upon first rendering of the table. User actions may change the sort order and/or the selected column. The object contains the following properties:

      - **internalName**: _string. **Required**. Read only._ The name of the column as referenced internally by Giraffe code.

      - **displayName**: _string. **Required**._ The name of the column to display.

      - **visible**: _boolean. **Required**._ Determine whether to show the column in the table or not. **true** has no effect, as by default all columns are shown even when not represented in **fieldOptions**. **false** will hide the column.

  - **fieldOptions**: _array[Object, ...]. **Required**._ An array of objects that represent the columns in the table. By default all columns are shown with the internal name unless modified in this array. Each object contains the following properties:

    - **internalName**: _string. **Required**. Read only._ The name of the column as referenced internally by Giraffe code.

    - **displayName**: _string. **Required**._ The name of the column to display.

    - **visible**: _boolean. **Required**._ Determine whether to show the column in the table or not. **true** has no effect, as by default all columns are shown even when not represented in **fieldOptions**. **false** will hide the column.

  - **timeFormat**: _string. **Required**._ A string representing the date and time format for time values. The underlying formatter is [_intl-dateformat_](https://www.npmjs.com/package/intl-dateformat) which supports a subset of the ISO 8601 formats.

  - **decimalPlaces**: _Object. **Required**._

    - **isEnforced**: _boolean. Optional. Defaults to false when not included._ Indicates whether the number of decimal places ("**digits**") will be enforced. When **isEnforced** is falsy or omitted, **digits** will be locked to 2 for stat values with a decimal and 0 for stat values that are integers, and the **digits** option will be ignored.
    - **digits**: _number. Optional. Defaults to 0 when not included. Maximum 10._ When **digits** is a non-integer number, the decimal portion is ignored. Represents the number of decimal places to display in the stat value. Displayed stat value is subject to rounding.

- **GaugeLayerConfig**: _Object._ Maximum one per `<Plot>`. Properties are:

  - **type**: _'gauge'. **Required**._ Specifies that this LayerConfig is a gauge layer.

  - **prefix**: _string. Optional._ The text that appears before the gauge value. Use an empty string if no text is preferred.

  - **suffix**: _string. Optional._ The text that appears after the gauge value. Use an empty string if no text is preferred.

  - **tickPrefix**: _string. Optional._ The text that appears before each tick label. Use an empty string if no text is preferred.

  - **tickSuffix**: _string. Optional._ The text that appears after each tick label. Use an empty string if no text is preferred.

  - **decimalPlaces**: _Object. Optional._

    - **isEnforced**: _boolean. Optional. Defaults to false when not included._ Indicates whether the number of decimal places ("**digits**") will be enforced. When **isEnforced** is falsy or omitted, **digits** will be locked to 2 for stat values with a decimal and 0 for stat values that are integers, and the **digits** option will be ignored.
    - **digits**: _number. Optional. Defaults to 0 when not included. Maximum 10._ When **digits** is a non-integer number, the decimal portion is ignored. Represents the number of decimal places to display in the stat value. Displayed stat value is subject to rounding.

  - **gaugeSize**: _number. Optional. Defaults to &#960; and is **3.142** &#8804; gaugeSize &#8804; **6.283**._ The size of the Gauge as measured in [_radians_](https://www.mathsisfun.com/geometry/radians.html). Valid Gauge sizes range from a half circle to a full circle. Any size below &#960; is considered &#960; and any size above 2&#960; is considered 2&#960;. Rounded to 3 decimal places.

  - **gaugeColors**: _array[Object, ...]. **Required**._ An array of objects that defines the colors of the Gauge. Each object has the following properties.

    - **id**: _string. **Required**._ The id for this color. Should be unique within the **gaugeColors** array.

    - **type**: _'min' | 'max' | 'threshold'. **Required**._ The type of value associated with this color. _'min'_ type comes first, _'max'_ type comes last, and _'threshold'_ types are in between _'min'_ and _'max'_. **gaugeColors** must contain at least one _'min'_ type and one _'max'_ type for the Gauge to have color. Only the first _'min'_ and first _'max'_ in the array are recognized for each of their respective types. The color will change as a gradient if the **gaugeColors** array contains only _'min'_ and _'max'_. The color will be segmented if any _'threshold'_ types are included in the **gaugeColors** array. Segmented colors on a Gauge will not display the _'max'_ type's color. _Exception_: a full circle Gauge with only _'min'_ and _'max'_ types will be segmented and include both the _'min'_ and _'max'_ colors.

    - **hex**: _string. **Required**._ The [_color hex_](https://www.color-hex.com/) string for this color.

    - **name**: _string. **Required**._ For descriptive purposes only. The name given to this color.

    - **value**: _number. **Required**._ The starting gauge value associated with this color.

  - **gaugeTheme**: _Object. Optional._ An object controlling additional visual styling and details of the Gauge.

    - **lineCount**: _number. Optional. Defaults to 5 when excluded._ The total number of labeled gauge lines (large ticks) not counting the first.

    - **smallLineCount**: _number. Optional. Defaults to 10 when excluded._ The total number of unlabeled gauge lines (small ticks) between two labeled gauge lines excluding the starting label but including the ending label.

    - **lineColor**: _string. Optional. Defaults to dark grey (#545667) when excluded._ The [_color hex_](https://www.color-hex.com/) string for the color of the gauge lines (ticks).

    - **labelColor**: _string. Optional. Defaults to grey (#8e91a1) when excluded._ The [_color hex_](https://www.color-hex.com/) string for the color of the labels for the gauge lines.

    - **labelFontSize**: _number. Optional. Defaults to 13 when excluded._ The [_CanvasRenderingContext2D font_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) size of the gauge labels.

    - **lineStrokeSmall**: _number. Optional. Defaults to 1 when excluded._ The [_CanvasRenderingContext2D lineWidth_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) of the unlabeled gauge lines (small ticks).

    - **lineStrokeLarge**: _number. Optional. Defaults to 3 when excluded._ The [_CanvasRenderingContext2D lineWidth_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) of the labeled gauge lines (large ticks).

    - **tickSizeSmall**: _number. Optional. Defaults to 9 when excluded._ The [_CanvasRenderingContext2D lineTo_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo) coordinate length of the unlabeled gauge lines (small ticks). Use a different value than **tickSizeLarge** to visually distinguish the length of the gauge lines (ticks).

    - **tickSizeLarge**: _number. Optional. Defaults to 18 when excluded._ The [_CanvasRenderingContext2D lineTo_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo) coordinate length of the labeled gauge lines (large ticks). Use a different value than **tickSizeSmall** to visually distinguish the length of the gauge lines (ticks).

    - **minFontSize**: _number. Optional. Defaults to 22 when excluded._ The [_CanvasRenderingContext2D font_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) size of the Gauge's value. Values below a certain size will be ignored and defaulted to a size that is based on the current size of the Gauge.

    - **minLineWidth**: _number. Optional. Defaults to 24 when excluded._ The [_CanvasRenderingContext2D lineWidth_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth) or thickness of the Gauge's colors. Values below a certain size will be ignored and defaulted to a size that is based on the current size of the Gauge.

    - **valueColor**: _string. Optional. Defaults to white (#ffffff) when excluded._ The [_color hex_](https://www.color-hex.com/) string for the color of the Gauge's current value.

    - **valuePositionXOffset**: _number. Optional. Defaults to 0 when excluded._ The [_CanvasRenderingContext2D fillText_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText) coordinate offset for the horizontal dimension that the Gauge's value should be moved from its default position.

    - **valuePositionYOffset**: _number. Optional. Defaults to 0.5 when excluded._ The [_CanvasRenderingContext2D fillText_](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText) coordinate offset for the vertical dimension that the Gauge's value should be moved from its default position.

    - **needleColor0**: _string. Optional. Defaults to dark grey (#434453) when excluded._ The [_color hex_](https://www.color-hex.com/) string of the starting color for the color gradient of the Gauge's needle. **needleColor0** should be used in conjunction with **needleColor1**.

    - **needleColor1**: _string. Optional. Defaults to white (#ffffff) when excluded._ The [_color hex_](https://www.color-hex.com/) string of the ending color for the color gradient of the Gauge's needle. **needleColor1** should be used in conjunction with **needleColor0**.

    - **overflowDelta**: _number. Optional. Defaults to 0.03 when excluded._ This constant expresses how far past the gauge min or gauge max the needle should be drawn if the value for the needle is less than gauge min or greater than the gauge max. It is expressed as a fraction of the circumference of a circle, e.g. 0.5 means draw halfway around the gauge from the min or max value.

- **SingleStatLayerConfig**: _Object._ No limit but generally one per `<Plot>`. Using more than one requires additional styling through configuration and is not recommended.

  <br />A Single Stat layer is a pre-defined custom layer that displays a single value on top of any other plot type, or by itself, but usually displayed on top of (single) line graphs. The displayed value is the latest value by timestamp. If more than one value has the latest timestamp, then the first value in the [table](#data-properties) with the latest timestamp will be displayed. Currently, there is no guarantee which value will be considered the first value when there are multiple values with the same timestamp.

  - **type**: _'single stat'. **Required**._ Specifies that this LayerConfig is a single stat layer.

  - **prefix**: _string. **Required**._ The text that appears before the stat value. Use an empty string if no text is preferred.

  - **suffix**: _string. **Required**._ The text that appears after the stat value. Use an empty string if no text is preferred.

  - **decimalPlaces**: _Object. **Required**._

    - **isEnforced**: _boolean. Optional. Defaults to false when not included._ Indicates whether the number of decimal places ("**digits**") will be enforced. When **isEnforced** is falsy or omitted, **digits** will be locked to 2 for stat values with a decimal and 0 for stat values that are integers, and the **digits** option will be ignored.
    - **digits**: _number. Optional. Defaults to 0 when not included. Maximum 10._ When **digits** is a non-integer number, the decimal portion is ignored. Represents the number of decimal places to display in the stat value. Displayed stat value is subject to rounding.

  - **textColor**: _string. **Required**._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the entire Single Stat to display including prefix, the stat value, and suffix.

  - **textOpacity**: _number. Optional. Defaults to 1 when not included._ A value between 0 and 1 inclusive, specifying the [opacity](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/opacity) of the entire text for the Single Stat including prefix, the stat value, and suffix. 0 is fully transparent (invisible) while 1 is fully opaque.

  - **backgroundColor**: _string. Optional. Recommendation: do not include. Defaults to transparent when not included._ The [CSS background color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color) of the background, which covers the area surrounded by the axes and border (whether displayed or not) of the `<Plot>`.

  - **testID**: _string. Optional._ A string value for the `data-testid` prop on the element for the Single Stat. Primarily used for automated testing.

    <br /> The following optional properties affect element attributes in the DOM tree of the Single Stat. Its structure looks like this

    <pre>
      &#60;div class="giraffe-layer giraffe-layer-single-stat"&#62;
        &#60;div class="giraffe-single-stat--resizer"&#62;
          &#60;svg class="giraffe-single-stat--svg"&#62;
            &#60;text class="giraffe-single-stat--text"&#62;&#60;/text&#62;
          &#60;/svg&#62;
        &#60;/div&#62;
      &#60;/div&#62;
    </pre>

  - **style**: _Object. Optional. Recommendation: do not include._ An object containing the key-value pairs used for inline styling `.giraffe-layer-single-stat` by setting its [style property](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style). If used, please be aware of existing default styles that may need to be overridden. `backgroundColor` cannot be overridden and is controlled by the **backgroundColor** option (see above). See the `SINGLE_STAT_DEFAULT_STYLE` [here](./src/constants/singleStatStyles.ts).

  - **resizerStyle**: _Object. Optional. Recommendation: do not include._ An object containing the key-value pairs used for inline styling `.giraffe-single-stat--resizer` by setting its [style property](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style). If used, please be aware of existing default styles that may need to be overridden. See the `SINGLE_STAT_RESIZER_DEFAULT_STYLE` [here](./src/constants/singleStatStyles.ts).

  - **svgAttributes**: _Object. Optional. Recommendation: do not include._ An object containing the key-value pairs used for the element attributes of `.giraffe-single-stat--svg`. If used please be aware of the existing default attributes that may need to be overridden. See the `SINGLE_STAT_SVG_DEFAULT_ATTRIBUTES` [here](./src/constants/singleStatStyles.ts).

  - **svgStyle**: _Object. Optional. Recommendation: do not include._ An object containing the key-value pairs used for inline styling `.giraffe-single-stat--svg` by setting its [style property](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style). This element has no existing default styling.

  - **svgTextAttributes**: _Object. Optional. Recommendation: do not include._ An object containing the key-value pairs used for the element attributes of `.giraffe-single-stat--text`. If used please be aware of the existing default attributes that may need to be overridden. `opacity` cannot be overridden and is controlled by the **textOpacity** option (see above). See the `SINGLE_STAT_SVG_TEXT_DEFAULT_ATTRIBUTES` [here](./src/constants/singleStatStyles.ts).

  - **svgTextStyle**: _Object. Optional. Recommendation: do not include._ An object containing the key-value pairs used for inline styling `.giraffe-single-stat--text` by setting its [style property](https://developer.mozilla.org/en-US/docs/Web/API/ElementCSSInlineStyle/style). If used, please be aware of existing default styles that may need to be overridden. `fill` cannot be overridden and is controlled by the **textColor** option (see above). See the `SINGLE_STAT_SVG_TEXT_DEFAULT_STYLE` [here](./src/constants/singleStatStyles.ts).

- **AnnotationLayerConfig**: _Object._ No limit but generally one per `<Plot>`. Properties are:

  - **type**: _'annotation'. **Required**._ Specifies that this LayerConfig is an annotation layer.

  - **x**: _string. **Required**._ The column key name of the column that should be visualized on the x-axis. _Annotations must overlay another data set, ie another graph. Therefore, this column key name is from that data set. This should match the overlaid graph's same property._

  - **y**: _string. **Required**._ The column key name of the column that should be visualized on the y-axis. _Annotations must overlay another data set, ie another graph. Therefore, this column key name is from that data set. This should match the overlaid graph's same property._

  - **fill**: _array[string, ...]. **Required**._ An array of column key names of column filters that should be visualized. _Annotations must overlay another data set, ie another graph. Therefore, these column key names are from that data set. This should match the overlaid graph's same property. If the "fill" is not required in the overlaid graph, please explicitly use the overlaid graph's implicit value in AnnotationLayerConfig._

  - **annotations**: _array[Object, ...]. **Required**._ An array of objects that are the annotations. The array can be empty (no annotations rendered). Each object is an annotation and has the following properties:

    - **title**: _string. **Required**._ The title of the annotation.

    - **description**: _string. **Required**._ The description of the annotation.

    - **color**: _string. **Required**._ The [_CSS color value_](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) of the annotation.

    - **startValue**: _number. **Required**._ The starting value of the annotation. If the annotation is a point in time, then this value is in [_RFC3339 format_](https://tools.ietf.org/html/rfc3339). For example: 1610582880661 falls within _14 January 2021_ in UTC. This value may also be something other than time. When **startValue** is equal to **stopValue** the annotation is a single line. When they are not equal, the annotation is a range. (_Note: rendering an annotation range is not yet implemented._)

    - **stopValue**: _number. **Required**._ The stopping or ending value of the annotation. If the annotation is a point in time, then this value is in [_RFC3339 format_](https://tools.ietf.org/html/rfc3339). For example: 1610582880661 falls within _14 January 2021_ in UTC. This value may also be something other than time. When **stopValue** is equal to **startValue** the annotation is a single line. When they are not equal, the annotation is a range. (_Note: rendering an annotation range is not yet implemented._)

    - **dimension**: _'x' | 'y'. **Required**._ Indicates whether the annotation is vertical - **'x'** or horizontal - **'y'**.

  - **hoverDimension**?: _"x" | "y" | "xy" | "auto". Optional. Defaults to "xy" when not included._ Indicates how an annotation's legend (tooltip) should be triggered during mouse hover.

    - "x" means the legend will display for all annotations that cross or are within the **hoverMargin** of the mouse's x-axis value
    - "y" means the legend will display for all annotations that cross or are within the **hoverMargin** of the mouse's y-axis value
    - "xy" means the legend will display for all annotations within the **hoverMargin** of the mouse in any direction
    - "auto" means "xy" (see above)

  - **hoverMargin**: _number. Optional. Defaults to 20 when not included._ The hoverable area in pixel size around the annotation that will trigger the legend (tooltip). For 'x' annotations, the **hoverMargin** extends to the left and right. For 'y' annotations, the **hoverMargin** extends to the top and bottom.

  - **svgAttributes**: _Not used. Reserved for future implementation._

  - **svgStyle**: _Not used. Reserved for future implementation._


- **CustomLayerConfig**: _Object._ No limit per `<Plot>`.

  A custom layer is an overlay on the Plot that is not one of the above pre-defined plot types. A render callback function is passed in as the renderer for the custom layer. It has two properties:

  - **type**: _'custom'. **Required**._ Specifies that this LayerConfig is a custom layer.

  - **render**: _function(Object). **Required**._ A configuration-defined callback function called with a `CustomLayerRenderProps` and returns a JSX Element. The `CustomerLayerRenderProps` Object has the following properties available to use in the callback function:

    - **key**: _string | number._ As part of a [React list of rendered elements](https://reactjs.org/docs/lists-and-keys.html), a unique `key` prop is required on the JSX Element returned by the custom layer's render function. Use this **key** for the `key` prop in the JSX Element.

    - **xScale**: _function(number)._ The scaling function produced by the [config's xScale property](#data-properties). Can be used for scaling the JSX Element's x-dimension.

    - **yScale**: _function(number)._ The scaling function produced by the [config's yScale property](#data-properties). Can be used for scaling the JSX Element's y-dimension.

    - **xDomain**: _array[min, max]._ See the [config's xDomain property](#data-properties). Gives the JSX Element access to the `<Plot>`'s xDomain.

    - **yDomain**: _array[min, max]._ See the [config's yDomain property](#data-properties). Gives the JSX Element access to the `<Plot>`'s yDomain.

    - **width**: _number._ See the [config's width property](#appearance-properties). Gives the JSX Element access to the `<Plot>`'s width.

    - **innerWidth**: _number._ The **width** (see above) without the size of the area to the left of the y-axis.

    - **height**: _number._ See the [config's width property](#appearance-properties). Gives the JSX Element access to the `<Plot>`'s height.

    - **innerHeight**: _number._ The **height** (see above) without the size of the area below the x-axis.

    - **columnFormatter**: _function(string)._ A function that takes a column key and returns a function that can format values for that type of column. When **columnFormatter** is called with "\_time", it returns a function that takes ECMAScript time values and returns the human-readable time stamp for that value.
