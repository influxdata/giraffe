## Development

This repo contains multiple JavaScript packages linked together by [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) (i.e. it is a _monorepo_).
The source code for the library published to npm as `@influxdata/giraffe` is contained in the `giraffe` workspace.

### Developing Giraffe with Storybook

The **/stories** workspace in this repository contains a [Storybook](https://storybook.js.org/) application, which is convenient place to test changes to Giraffe.

To run the Storybook during development:

1. In a terminal, `cd` into the **/stories** workspace and run `yarn start`.
   This will start a Storybook development server.

1. Visit [http://localhost:50000](http://localhost:50000) to see the storybook.
   Changes made either in the library source or in the stories source will be reflected automatically at that URL.

_Just looking for how to render a graph in your UI?_ See **Getting Started** in the [`README.md`](./README.md#getting-started).

### Linting & Formatting

To run linting, `cd` into either **/giraffe** or **/stories** and run:

```
yarn lint
```

To run formatting, which uses [Prettier](https://www.npmjs.com/package/prettier), `cd` into either **/giraffe** or **/stories** and run:

```
yarn prettier --fix
```

To see the formatting issues without fixing, run the above without the `--fix` option

### Unit tests

To run unit tests, `cd` into the **/giraffe** or **/stories** and run:

```
yarn test
```

## Publishing a new version

Ensure that

- You have administrator access to this repo on GitHub
- You have permissions to publish to the [influxdata](https://www.npmjs.com/org/influxdata) organization on npm
- You are logged into Yarn (`yarn login`)
- You are on `master` and the working tree is clean

Then from the root of the repo, run the publish script:

```
./giraffe/publish
```

## Security Vulnerability Reporting

InfluxData takes security and our user's trust very seriously.
If you believe you have found a security issue in any of our open source projects, please responsibly disclose it by contacting security@influxdata.com.
More details about security vulnerability reporting, including our GPG key, [can be found here](https://www.influxdata.com/how-to-report-security-vulnerabilities/).
