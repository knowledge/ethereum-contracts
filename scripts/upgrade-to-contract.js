const prompt = require('prompt-promise')
const KnowledgeProxy = artifacts.require('KnowledgeProxy')

const setLatestVersion = require('./current-version')

module.exports = async () => {
  const contractName = await prompt('Contract Name: ')
  const UpgradeContract = artifacts.require(contractName)
  const upgradeContract = await UpgradeContract.new()

  const proxyAddress = await prompt('Proxy Address: ')

  const proxy = KnowledgeProxy.at(proxyAddress)
  proxy.upgradeTo(upgradeContract.address)

  setLatestVersion(contractName)
  prompt.done()
  console.log('Implementation Address:', upgradeContract.address)
}
