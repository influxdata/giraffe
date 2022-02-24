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
- You have two factor authentication (2FA) turned on for your npm account. See [additional steps](#2fa-requirement-and-procedures) related to this requirement
- You are logged into Yarn (`yarn login`)
- You are on `master` and the working tree is clean

Then from the root of the repo, run the publish script:

```
./giraffe/publish
```

## 2FA Requirement and Procedures
To publish, you must have two factor authentication turned on for your npm account. For assistance setting this up, visit [npm's official docs on this topic](https://docs.npmjs.com/configuring-two-factor-authentication).

Additionally, npm recently updated the way they recognize 2FA during publishing. If you have not done so previously for any other libraries, you may need to set up a publishing token by doing the following. After these steps are taken, then you will be able to publish successfully using the steps outlined [above](#publishing-a-new-version)

1.  Log in to npmjs.org
1.  Click on your image avatar in the corner
1.  Select **Access Tokens**
1.  Click on the button **Generate New Token**
1.  Name the token and select type: Publish
1.  Click Generate Token when ready
1.  Copy the token string - _**this is your only chance to copy this string**_
1.  Go to your project's local repository
1.  Create a **.npmrc** file (if necessary) at the root of the repository
1. Append this line in the .npmrc file:  
```//registry.npmjs.org/:_authToken=<access_token>```
1. Replace \<access_token\> with the token string

## Security Vulnerability Reporting

InfluxData takes security and our user's trust very seriously.
If you believe you have found a security issue in any of our open source projects, please responsibly disclose it by contacting security@influxdata.com.
More details about security vulnerability reporting, including our GPG key, [can be found here](https://www.influxdata.com/how-to-report-security-vulnerabilities/).
