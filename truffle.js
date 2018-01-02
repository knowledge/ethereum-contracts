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
      gas: 67123900, // https://git.io/vbhSl
      network_id: 3
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'USD'
    }
  }
}
