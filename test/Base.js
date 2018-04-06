const Knowledge = artifacts.require('Legacy')
const KnowledgeProxy = artifacts.require('KnowledgeProxy')
const KnowledgeBase = artifacts.require('KnowledgeBaseLegacy')

const { expectThrow } = require('./utils')

const initialSupply = 150000000 * 10 ** 8

contract('Base', accounts => {
  let KNW

  beforeEach(async () => {
    const imp = await Knowledge.new()
    const base = await KnowledgeBase.new()
    const proxy = await KnowledgeProxy.new()

    await proxy.upgradeTo(imp.address)
    KNW = Knowledge.at(proxy.address)

    await base.setNextContract(proxy.address)
    await KNW.setPrevContract(base.address)
    await base.upgrade()
  })

  describe('creation', () => {
    it('should create an initial balance of 150 million tokens for the creator', async () => {
      const balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply)
    })

    it('test correct setting of vanity information', async () => {
      const name = await KNW.name()
      assert.strictEqual(name, 'Knowledge.io')

      const decimals = await KNW.decimals()
      assert.strictEqual(decimals.toNumber(), 8)

      const symbol = await KNW.symbol()
      assert.strictEqual(symbol, 'KNW')
    })
  })

  describe('transfers', () => {
    it('should transfer tokens', async () => {
      await KNW.transfer(accounts[1], 10000, { from: accounts[0] })
      const balance = await KNW.balanceOf(accounts[1])
      assert.strictEqual(balance.toNumber(), 10000)
    })

    it('should fail when trying to transfer more tokens than the balance', async () => {
      const balance = await KNW.balanceOf(accounts[0])
      await expectThrow(KNW.transfer(accounts[1], balance + 1, { from: accounts[0] }))
    })

    it('should handle zero-transfers normally', async () => {
      assert(await KNW.transfer(accounts[1], 0, { from: accounts[0] }), 'zero-transfer has failed')
    })

    it('should fire Transfer event', async () => {
      const res = await KNW.transfer(accounts[1], 10000, { from: accounts[0] })
      const log = res.logs.find(element => element.event.match('Transfer'))
      assert.strictEqual(log.args.from, accounts[0])
      assert.strictEqual(log.args.to, accounts[1])
      assert.strictEqual(log.args.value.toNumber(), 10000)
    })
  })

  describe('approvals', () => {
    it('should be able to approve token transfers to another account', async () => {
      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      const allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 100)
    })

    it('should be able to approve tokens & withdraw once', async () => {
      await KNW.approve(accounts[1], 100, { from: accounts[0] })

      await KNW.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] })
      const allowance01 = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance01.toNumber(), 80)

      const balance2 = await KNW.balanceOf(accounts[2])
      assert.strictEqual(balance2.toNumber(), 20)

      const balance02 = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance02.toNumber(), initialSupply - 20)
    })

    it('should be able to approve tokens & withdraw twice', async () => {
      let allowance
      let balance

      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 100)

      await KNW.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] })
      allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 80)

      balance = await KNW.balanceOf(accounts[2])
      assert.strictEqual(balance.toNumber(), 20)

      balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply - 20)

      // FIRST tx done.
      // onto next.
      await KNW.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] })
      allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 60)

      balance = await KNW.balanceOf(accounts[2])
      assert.strictEqual(balance.toNumber(), 40)

      balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply - 40)
    })

    it('should fail to approve tokens & withdraw more than approved', async () => {
      let allowance
      let balance

      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 100)

      await KNW.transferFrom(accounts[0], accounts[2], 50, { from: accounts[1] })
      allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 50)

      balance = await KNW.balanceOf(accounts[2])
      assert.strictEqual(balance.toNumber(), 50)

      balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply - 50)

      // FIRST tx done.
      // onto next.
      await expectThrow(KNW.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] }))
    })

    it('should fail to withdraw with no allowance', async () => {
      await expectThrow(KNW.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] }))
    })

    it('should be able to approve tokens & revoke the approval', async () => {
      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      await KNW.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] })
      await KNW.approve(accounts[1], 0, { from: accounts[0] })
      await expectThrow(KNW.transferFrom(accounts[0], accounts[2], 10, { from: accounts[1] }))
    })

    it('should be able to increase the approved amount', async () => {
      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      await KNW.increaseApproval(accounts[1], 100, { from: accounts[0] })

      const allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 200)
    })

    it('should be able to decrease the approved amount', async () => {
      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      await KNW.decreaseApproval(accounts[1], 50, { from: accounts[0] })

      const allowance = await KNW.allowance(accounts[0], accounts[1])
      assert.strictEqual(allowance.toNumber(), 50)
    })

    it('should fire Approval event', async () => {
      const res = await KNW.approve(accounts[1], 1000, { from: accounts[0] })
      const log = res.logs.find(element => element.event.match('Approval'))
      assert.strictEqual(log.args.owner, accounts[0])
      assert.strictEqual(log.args.spender, accounts[1])
      assert.strictEqual(log.args.value.toNumber(), 1000)
    })
  })

  describe('ownership', () => {
    it('should start with one owner', async () => {
      const owners = await KNW.ownersCount()
      assert.strictEqual(owners.toNumber(), 1)
    })

    it('should add a new owner', async () => {
      await KNW.addOwner(accounts[1])
      assert.strictEqual(await KNW.owners(1), accounts[1])
    })

    it('should fail to add an owner if not authorized', async () => {
      await expectThrow(KNW.addOwner(accounts[1], { from: accounts[1] }))
    })

    it('should give the owner permisions to all of them', async () => {
      await KNW.addOwner(accounts[1], { from: accounts[0] })
      await KNW.addOwner(accounts[2], { from: accounts[1] })
      await KNW.addOwner(accounts[3], { from: accounts[2] })
      assert.strictEqual((await KNW.ownersCount()).toNumber(), 4)
    })

    it('should remove one owner', async () => {
      await KNW.addOwner(accounts[1], { from: accounts[0] })
      await KNW.addOwner(accounts[2], { from: accounts[1] })

      await KNW.removeOwner(0, { from: accounts[1] })
      assert.strictEqual(await KNW.owners(0), accounts[2])
    })

    it('should fire the OwnerAdded event', async () => {
      const res = await KNW.addOwner(accounts[1])
      const log = res.logs.find(element => element.event.match('OwnerAdded'))
      assert.strictEqual(log.args.authorizer, accounts[0])
      assert.strictEqual(log.args.newOwner, accounts[1])
      assert.strictEqual(log.args.index.toNumber(), 1)
    })

    it('should fire the OwnerRemoved event', async () => {
      await KNW.addOwner(accounts[1])
      const res = await KNW.removeOwner(1)
      const log = res.logs.find(element => element.event.match('OwnerRemoved'))
      assert.strictEqual(log.args.authorizer, accounts[0])
      assert.strictEqual(log.args.oldOwner, accounts[1])
    })
  })
})
