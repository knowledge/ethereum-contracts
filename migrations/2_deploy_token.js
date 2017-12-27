const SafeMath = artifacts.require('SafeMath')
const Knowledge = artifacts.require('Knowledge')
const BasicToken = artifacts.require('BasicToken')
const StandardToken = artifacts.require('StandardToken')
const UpgradeableToken = artifacts.require('UpgradeableToken')

module.exports = async (deployer) => {
  await deployer.deploy(SafeMath)
  await deployer.link(SafeMath, [BasicToken, UpgradeableToken])
  await deployer.deploy(BasicToken)
  await deployer.link(BasicToken, StandardToken)
  await deployer.deploy(StandardToken)
  await deployer.link(StandardToken, UpgradeableToken)
  await deployer.deploy(UpgradeableToken)
  await deployer.link(UpgradeableToken, Knowledge)
  await deployer.deploy(Knowledge)
}
