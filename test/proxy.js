const Knowledge = artifacts.require('Payable')
const KnowledgeProxy = artifacts.require('KnowledgeProxy')
const KnowledgeBase = artifacts.require('KnowledgeBaseLegacy')

contract('KnowledgeProxy', accounts => {
  let proxy, knowledge, newContract
  const testAccount = accounts[1]

  beforeEach(async () => {
    const base = await KnowledgeBase.new()
    const initial = await Knowledge.new()

    proxy = await KnowledgeProxy.new()
    newContract = await Knowledge.new()

    await proxy.upgradeTo(initial.address)
    knowledge = Knowledge.at(proxy.address)

    // Upgradable
    await base.setNextContract(proxy.address)
    await knowledge.setPrevContract(base.address)
    await base.upgrade()
  })

  it('should retain the data storage after an upgrade', async () => {
    const amount = 100000000000

    await knowledge.transfer(testAccount, amount)
    await proxy.upgradeTo(newContract.address)

    const balance = await knowledge.balanceOf(testAccount)
    assert(balance.toNumber(), amount)
  })
})
