require('dotenv').load()

const HDWalletProvider = require('truffle-hdwallet-provider')

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
      gas: 2000000,
      gasPrice: 10000000000,
      network_id: 3
    },
    mainnet: {
      provider: new HDWalletProvider(mnemonic, `https://mainnet.infura.io/${infuraToken}`),
      gas: 2000000,
      // 1 gwei - 1000000000 wei
      gasPrice: 8000000000,
      network_id: 1
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
