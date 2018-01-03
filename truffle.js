require('dotenv').load()

const HDWalletProvider = require("truffle-hdwallet-provider")

const infuraToken = process.env.INFURA_TOKEN
const mnemonic = process.env.MNEMONIC

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraToken}`),
      // https://git.io/vbhSl
      gas: 6000000000,
      gasPrice: 6000000000,
      network_id: 3
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD'
    }
  }
}
