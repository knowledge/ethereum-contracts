# Knowledge Ethereum Contracts

[![StandardJS Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Collaborative Etiquete](https://img.shields.io/badge/%E2%9C%93-collaborative_etiquette-brightgreen.svg)](https://git.io/col)
[![Travis](https://img.shields.io/travis/knowledge/knowledge-project-guidelines.svg)](https://travis-ci.org/knowledge/knowledge-contracts)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts?ref=badge_shield)
[![Gitter](https://badges.gitter.im/knowledge/knowledge-contracts.svg)](https://gitter.im/knowledge/knowledge-contracts)

This repository contains all Ethereum Smart Contracts used at Knowledge.

Truffle is our development, testing and deployment framework.  
OpenZeppelin is the solidity library we use for writing secure Smart Contracts on Ethereum.  
We follow the [Knowledge Project Guidelines](https://knowledge.github.io/knowledge-project-guidelines/) and [Consensys Best Practices](https://consensys.github.io/smart-contract-best-practices).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Features](#features)
- [Contracts](#contracts)
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
- Upgradable ERC20 Token contract.
- Network management for deploying to many public & private networks.
- Interactive console for direct contract communication.
- Instant rebuilding of assets during development.
- External script runner that executes scripts within a Truffle environment.

## Contracts

All ethereum solidity smart contracts can be found in the `/contracts` directory.

- *Knowledge.sol*  is the ERC20 Token contract for the KNW token. It's an upgradable contract, which means that if we ever discover a security vulnerability or have the need to publish a another version of the token contract users will be able to migrate their tokens to the new contract version.
- *Upgradable.sol* is the upgradable interface used by Knowledge token, it's inspired by Lunyr and Civic token contract.
- *Payment.sol* is used to receive payments at the Knowledge Marketplace and Adviser Self Service Platform.
- *Migration.sol* is a standard truffle contract needed for truffle integration and contract lifecycle management, not meant for use by Knowledge users.


## Getting Started

For you to able to understand and execute the code in this repository advanced knowledge of JavaScript, Node.js and Ethereum is required. If you are not familiar with these technologies we suggest you to visit [ethereum.org](https://ethereum.org/) and [learnnode.com](https://learnnode.com/).

To get started with smart contract programming with Solidity you can find an introduction to the language in the [Solidity documentation](https://solidity.readthedocs.org). In the documentation, you can find [code examples](https://solidity.readthedocs.io/en/latest/solidity-by-example.html) as well as [a reference](https://solidity.readthedocs.io/en/latest/solidity-in-depth.html) of the syntax and details on how to write smart contracts.

You can start using [Solidity in your browser](https://ethereum.github.io/browser-solidity/) with no need to download or compile anything.

### Environment Dependencies

You need some global environment configurations

- install [Node.js](https://github.com/nodejs/node) v8.9.3. We recommend using [nvm and avn to manage the node versions](https://gaboesquivel.com/blog/2015/automatic-node.js-version-switching/).

### Project Dependencies

In the project root directory run `npm install` to install all project dependencies

### Running Development Mode

In separate tabs of your console run the following commands:

```
npm run ganache
npm run develop
npm run deploy
```

For more information visit the Truffle Framework documentation.

### Testing your code

We do both static linting and analysis and functional tests.

```
npm run ganache
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

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fknowledge%2Fknowledge-contracts?ref=badge_large)

---

## About Knowledge

Blockchain technology is rebuilding the internet in a trustless, decentralized way, allowing for fundamental core improvements on existing business models and industries, and a new breed of dot-io powerhouse frameworks are emerging. Knowledge.io is producing an ecosystem that offers significant improvement in the areas of ad tech, commerce, education, and employment, and a supply and demand marketplace of goods and services, all based around rewarding users for what the massive and centralized supergiants utilize to make extraordinary profits - people’s data. The Knowledge.io ecosystem is built on the foundation of decentralization and rewarding people for sharing their knowledge.

[knowledge.io](https://knowledge.io)  

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
