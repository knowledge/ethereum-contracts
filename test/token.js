const Knowledge = artifacts.require('Knowledge')
const { expectThrow } = require('./utils')

const initialSupply = 125000000 * 10 ** 8

contract('Knowledge', accounts => {
  let KNW

  beforeEach(async () => {
    KNW = await Knowledge.new()
  })

  describe('creation', () => {
    it('should create an initial balance of 125 million tokens for the creator', async () => {
      const balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply)
    })

    it('test correct setting of vanity information', async () => {
      const name = await KNW.name()
      assert.strictEqual(name, 'Knowledge')

      const decimals = await KNW.decimals()
      assert.strictEqual(decimals.toNumber(), 8)

      const symbol = await KNW.symbol()
      assert.strictEqual(symbol, 'KNW')
    })
  })

  describe('transfers', () => {
    it('should reverse ether transfer ', async () => {
      const balanceBefore = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balanceBefore.toNumber(), initialSupply)

      web3.eth.sendTransaction({
        from: accounts[0],
        to: KNW.address,
        value: web3.toWei('10', 'Ether')
      }, async err => {
        assert(err)

        const balanceAfter = await KNW.balanceOf(accounts[0])
        assert.strictEqual(balanceAfter.toNumber(), initialSupply)
      })
    })

    it('should transfer tokens', async () => {
      await KNW.transfer(accounts[1], 10000, { from: accounts[0] })
      const balance = await KNW.balanceOf(accounts[1])
      assert.strictEqual(balance.toNumber(), 10000)
    })

    it('should fail when trying to transfer more tokens than the balance', async () => {
      const balance = await KNW.balanceOf(accounts[0])
      expectThrow(KNW.transfer(accounts[1], balance + 1, { from: accounts[0] }))
    })

    it('should handle zero-transfers normally', async () => {
      assert(await KNW.transfer(accounts[1], 0, { from: accounts[0] }), 'zero-transfer has failed')
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
      expectThrow(KNW.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] }))
    })

    it('should fail to withdraw with no allowance', () => {
      return expectThrow(KNW.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] }))
    })

    it('should be able to approve tokens & revoke the approval', async () => {
      await KNW.approve(accounts[1], 100, { from: accounts[0] })
      await KNW.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] })
      await KNW.approve(accounts[1], 0, { from: accounts[0] })
      expectThrow(KNW.transferFrom(accounts[0], accounts[2], 10, { from: accounts[1] }))
    })
  })

  describe('events', () => {
    it('should fire Transfer event', async () => {
      const res = await KNW.approve(accounts[1], '1000', { from: accounts[0] })
      const approvalLog = res.logs.find(element => element.event.match('Approval'))
      assert.strictEqual(approvalLog.args.owner, accounts[0])
      assert.strictEqual(approvalLog.args.spender, accounts[1])
      assert.strictEqual(approvalLog.args.value.toNumber(), 1000)
    })
  })
})
