## Development

Common development workflows are codified via `Makefile`s.

### Developing with the docs app

This repository contains a [Storybook](https://storybook.js.org/), which is convenient place to test changes in development.
To run the Storybook during development:

```
make run-docs
```

Then visit [http://localhost:50000](http://localhost:50000).
Changes made either in the library source or in the Storybook stories will be reflected automatically at that URL.

### Developing with an external app

To test changes in this repository without publishing a new version, use the `make run` target, which will start a development server that rebuilds the `dist` folder you make changes to source files.
Typically you would be able to use `npm link` to see this development version in an external app, but attempting to do so with this library will throw a [confusing error](https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react).

As a workaround:

1. Set a `GIRAFFE_DIR` environment variable in your shell for the absolute path of your local giraffe repository, and an `APP_DIR` variable for the absolute path of the external app you wish to test the library with.
   For me that looks like:
   ```
   export GIRAFFE_DIR=/Users/chris/Dev/giraffe
   export APP_DIR=/Users/chris/Dev/influxdb/ui
   ```

2. Run
   ```
   mv $APP_DIR/node_modules/@influxdata/giraffe/dist $APP_DIR/node_modules/@influxdata/giraffe/_dist && \
   ln -s $GIRAFFE_DIR/dist $APP_DIR/node_modules/@influxdata/giraffe/dist
   ```

When you're done developing the giraffe, make sure to undo this:

```
rm $APP_DIR/node_modules/@influxdata/giraffe/dist && \
mv $APP_DIR/node_modules/@influxdata/giraffe/_dist $APP_DIR/node_modules/@influxdata/giraffe/dist
```

### Running tests

```
make test
```

### Publishing a new version

Ensure that you have administrator access to this repo and to the [influxdata](https://www.npmjs.com/org/influxdata) organization on npm.
Then run:

```
make publish
```
