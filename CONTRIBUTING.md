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

To test your local development branch in an external React app, symlink the built `dist` output in the root of this repo to the corresponding `dist` folder within the external app's `node_modules` directory.
This can typically be achieved via `npm link`.

To build this library in watch mode, run
```
make run
```
in the root of the repo.

#### For external apps using Parcel

Using `npm link` with to test changes in external apps built with [Parcel](https://parceljs.org/) will [fail](https://reactjs.org/warnings/invalid-hook-call-warning.html), due to how Parcel builds symlinked external dependencies in development.

As a workaround, you can symlink the `dist` directory directly.
For example, if this repository has an absolute path of `$PROJECTDIR` and the external app has an absolute path of `$APPDIR`, run:

```
ln -sF $PROJECTDIR/dist $APPDIR/node_modules/@influxdata/vis/dist
```

Remember to run `npm install` or `yarn install` in `$PROJECTDIR` once you are done developing to reset the symlinked `dist` folder.

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
