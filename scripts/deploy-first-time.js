const getLatestVersion = require('./current-version')

const Knowledge = artifacts.require(getLatestVersion())
const KnowledgeProxy = artifacts.require('KnowledgeProxy')
const KnowledgeBase = artifacts.require('KnowledgeBaseLegacy')

module.exports = async () => {
  const imp = await Knowledge.new()
  const base = await KnowledgeBase.new()
  const proxy = await KnowledgeProxy.new()

  await proxy.upgradeTo(imp.address)
  KNW = Knowledge.at(proxy.address)

  await base.setNextContract(proxy.address)
  await KNW.setPrevContract(base.address)
  await base.upgrade()

  console.log('Proxy address:', proxy.address)
  console.log('Implementation address:', imp.address)
}
