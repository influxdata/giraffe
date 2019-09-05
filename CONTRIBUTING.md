## Development

This repo contains several JavaScript packages linked together by [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) (i.e. it is a _monorepo_).
The source code for the library published to npm as `@influxdata/giraffe` is contained in the `giraffe` workspace. 

### Developing Giraffe with Storybook

The `stories` workspace in this repository contains a [Storybook](https://storybook.js.org/) application, which is convenient place to test changes to Giraffe.

To run the Storybook during development:

1. In one terminal, change into the `giraffe` workspace and run `yarn start`.
   This starts a [Rollup](https://rollupjs.org/guide/en/) process that will rebuild the library whenever its source files change.

2. In another terminal, change into the `stories` workspace and run `yarn start`.
   This will start a Storybook development server that consumes the locally build `@influxdata/giraffe` library. 

3. Visit [http://localhost:50000](http://localhost:50000) to see the storybook.
   Changes made either in the library source or in the stories source will be reflected automatically at that URL.

### Unit tests

To run unit tests, change into the `giraffe` workspace and run:

```
yarn test
```

### Screenshot tests

Giraffe uses Storybook and [Chromatic](https://www.chromaticqa.com) for screenshot testing.
The screenshot tests will run automatically in CircleCI for all PRs.

If you need to accept changes caught by the screenshot tests, follow the Chromatic build link listed in the logs for the failing CircleCI run.
After logging into Chromatic with your GitHub account, you should be able to approve the changes.
If you rerun the failing CircleCI build after approving changes, it will pass.

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
