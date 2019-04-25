## Development

Common development workflows are codified via `Makefile`s.

### Developing with the docs app

This repository contains a React-based documentation site, which is convenient place to test changes in development.
The docs app lives in the [`docs`](./docs) directory.
To run the docs app during development:

```
cd docs
make run
```

Then visit [http://localhost:1234/vis](http://localhost:1234/vis).
Changes made either in the library source or in the documentation source will be reflected automatically at that URL.

### Developing with an external app

To test changes in this repository without publishing a new version, use the `make run` target.
This target will execute `npm link` and build the library in watch/development mode.
Running `npm link @influxdata/vis` in an external app directory will then use the development version of this library instead of the version specified in the external app's `package.json` file.

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
