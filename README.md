# Knowledge Ethereum Contracts

[![StandardJS Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Collaborative Etiquete](https://img.shields.io/badge/%E2%9C%93-collaborative_etiquette-brightgreen.svg)](https://git.io/col)
[![Travis](https://img.shields.io/travis/knowledge/knowledge-project-guidelines.svg)](https://travis-ci.org/knowledge/knowledge-contracts)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts?ref=badge_shield)

This repository contains all Ethereum Smart Contracts used at Knowledge.

Truffle is our development, testing and deployment framework.  
OpenZeppelin is the solidity library we use for writing secure Smart Contracts on Ethereum.  
We follow the [Knowledge Project Guidelines](https://knowledge.github.io/knowledge-project-guidelines/) and [Consensys Best Practices](https://consensys.github.io/smart-contract-best-practices).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Environment Dependencies](#environment-dependencies)
  - [Project Dependencies](#project-dependencies)
  - [Running Development Mode](#running-development-mode)
  - [Testing your code](#testing-your-code)
  - [Deploying to the TestNet](#deploying-to-the-testnet)
- [Contributing](#contributing)
- [Bug Reporting](#bug-reporting)
- [License](#license)
- [About Knowledge](#about-knowledge)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

- Smart contract compilation, deployment and binary management.
- Automated contract testing with [Mocha](https://mochajs.org/) and [Chai](https://github.com/chaijs/chai).
- Solidity code linting with [Solium](https://github.com/duaraghav8/Solium).
- JavaScript code linting with [StandardJS](https://github.com/standard/standard).
- Secure solidity utility functions with [OpenZeppelin Solidity ](https://github.com/OpenZeppelin/zeppelin-solidity)
- Continuous integration testing with [Travis CI](https://about.travis-ci.com/)
- Configurable build pipeline with support for custom build processes.
- Scriptable deployment & migrations with Truffle framework.
- Network management for deploying to many public & private networks.
- Interactive console for direct contract communication.
- Instant rebuilding of assets during development.
- External script runner that executes scripts within a Truffle environment.

## Getting Started

For you to able to understand and execute the code in this repository advanced knowledge of JavaScript, Node.js and Ethereum Solidity is required. If you are not familiar with these technologies we suggest you to visit [ethereum.org/](https://ethereum.org/) and [learnnode.com/](https://learnnode.com/).

### Environment Dependencies

You need some global environment configurations

- install [Node.js](https://github.com/nodejs/node) v8.9.3. We recommend using [nvm and avn to manage the node versions](https://gaboesquivel.com/blog/2015/automatic-node.js-version-switching/).
- install [Truffle](https://github.com/trufflesuite/truffle/) `npm i -g truffle`
- install [Ganache CLI](https://github.com/trufflesuite/ganache-cli) `npm i -g ganache-cli`

### Project Dependencies

In the project root directory run `npm install` to install all project dependencies

### Running Development Mode

In separate tabs of your console run the following commands:

```
ganache-cli
npm run develop
npm run deploy
```

For more information visit the Truffle Framework documentation.

### Testing your code

We do both static linting and analysis and functional tests.

```
ganache-cli
npm run lint
npm run test
```

### Deploying to the TestNet

_work in progress..._


## Contributing

Read the [contributing guidelines](CONTRIBUTING.md) for details.

## Bug Reporting

Please report bugs big and small by [opening an issue](https://github.com/knowledge/knowledge-contracts/issues/new). No possible bug report is too small.


## License

MIT © [Knowledge](http://knowledge.io)  
See LICENSE for more info


---

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts?ref=badge_large)

## About Knowledge

Knowledge.io is about rewarding and celebrating knowledge. Everyone possesses knowledge, and is shaped through their individual life experiences, but opportunities to share, showcase, and receive the benefit of one’s own knowledge can be scarce for most people. Knowledge.io introduces a platform to applaud and reward users for sharing their knowledge. Knowledge.io proposes a platform that will enable its participants to attain an immediate reward and validation through gamified learning, verification of expertise, and cutting-edge ad tech based technology.

<!-- Please don't remove this: Grab your social icons from https://github.com/carlsednaoui/gitsocial -->

<!-- display the social media buttons in your README -->

[![Knowledge Twitter][1.1]][1]
[![Knowledge Facebook][2.1]][2]
[![Knowledge Github][3.1]][3]

<!-- links to social media icons -->
<!-- no need to change these -->

<!-- icons with padding -->

[1.1]: http://i.imgur.com/tXSoThF.png (twitter icon with padding)
[2.1]: http://i.imgur.com/P3YfQoD.png (facebook icon with padding)
[3.1]: http://i.imgur.com/0o48UoR.png (github icon with padding)

<!-- icons without padding -->

[1.2]: http://i.imgur.com/wWzX9uB.png (twitter icon without padding)
[2.2]: http://i.imgur.com/fep1WsG.png (facebook icon without padding)
[3.2]: http://i.imgur.com/9I6NRUm.png (github icon without padding)


<!-- links to your social media accounts -->
<!-- update these accordingly -->

[1]: http://www.twitter.com/KnowledgeToken
[2]: http://www.facebook.com/KnowledgeToken
[3]: http://www.github.com/knowledge

<!-- Please don't remove this: Grab your social icons from https://github.com/carlsednaoui/gitsocial -->