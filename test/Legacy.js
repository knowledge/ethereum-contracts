const Legacy = artifacts.require('Legacy')
const Proxy = artifacts.require('KnowledgeProxy')
const Knowledge = artifacts.require('KnowledgeLegacy')
const KnowledgeBase = artifacts.require('KnowledgeBaseLegacy')

const { expectThrow } = require('./utils')

const initialSupply = 150000000 * 10 ** 8

contract('Legacy', accounts => {
  let KNW, KNWB

  beforeEach(async () => {
    KNW = await Knowledge.new()
    KNWB = await KnowledgeBase.new()
  })

  describe('creation', () => {
    it('should create an initial balance of 150 million tokens for the creator', async () => {
      const balance = await KNWB.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply)
    })

    it('test correct setting of vanity information', async () => {
      const name = await KNWB.name()
      assert.strictEqual(name, 'Knowledge')

      const decimals = await KNWB.decimals()
      assert.strictEqual(decimals.toNumber(), 8)

      const symbol = await KNWB.symbol()
      assert.strictEqual(symbol, 'KNW')
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

  describe('upgrade', () => {
    it('should set the prev/next contract', async () => {
      await KNWB.setNextContract(KNW.address)
      await KNW.setPrevContract(KNWB.address)

      assert.strictEqual(await KNWB.nextContract(), KNW.address)
      assert.strictEqual(await KNW.prevContract(), KNWB.address)
    })

    it('should fail setting the prev/next contract if not owner', async () => {
      await expectThrow(KNWB.setNextContract(KNW.address, { from: accounts[1] }))
      await expectThrow(KNWB.setPrevContract(KNW.address, { from: accounts[1] }))
    })

    it('should fail upgrading tokens from a different address', async () => {
      await expectThrow(KNW.upgradeFrom(accounts[1], 100))
    })

    it('should fail upgrading it no tokens were found', async () => {
      await expectThrow(KNWB.upgrade())
    })

    it('should upgrade the tokens', async () => {
      let balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), 0)

      await KNWB.setNextContract(KNW.address)
      await KNW.setPrevContract(KNWB.address)
      await KNWB.upgrade()

      balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply)
    })

    it('should destroy the contract if no more tokens are left', async () => {
      await KNWB.transfer(accounts[1], 100)
      await KNWB.setNextContract(KNW.address)
      await KNW.setPrevContract(KNWB.address)

      await KNWB.upgrade({ from: accounts[0] })
      assert.notStrictEqual(web3.eth.getCode(KNWB.address), '0x0')

      await KNWB.upgrade({ from: accounts[1] })
      assert.strictEqual(web3.eth.getCode(KNWB.address), '0x0')
    })

    it('should fire the PrevContractSet event', async () => {
      const res = await KNW.setPrevContract(KNWB.address)
      const log = res.logs.find(element => element.event.match('PrevContractSet'))
      assert.strictEqual(log.args.contractAddress, KNWB.address)
    })

    it('should fire the NextContractSet event', async () => {
      const res = await KNWB.setNextContract(KNW.address)
      const log = res.logs.find(element => element.event.match('NextContractSet'))
      assert.strictEqual(log.args.contractAddress, KNW.address)
    })

    it('should fire the Upgrade/UpgradeFrom events', async () => {
      await KNW.setPrevContract(KNWB.address)
      await KNWB.setNextContract(KNW.address)

      const res = await KNWB.upgrade()

      const upgradeLog = res.logs.find(element => element.event === 'Upgrade')
      assert.strictEqual(upgradeLog.args._from, accounts[0])
      assert.strictEqual(upgradeLog.args._to, KNW.address)
      assert.strictEqual(upgradeLog.args._value.toNumber(), initialSupply)

      const upgradeFromLog = res.logs.find(element => element.event === 'UpgradeFrom')
      assert.strictEqual(upgradeFromLog.args._from, KNWB.address)
      assert.strictEqual(upgradeFromLog.args._to, accounts[0])
      assert.strictEqual(upgradeFromLog.args._value.toNumber(), initialSupply)
    })

    it('should fire the Transfer events', async () => {
      await KNW.setPrevContract(KNWB.address)
      await KNWB.setNextContract(KNW.address)

      const res = await KNWB.upgrade()

      const destroyLog = res.logs
        .find(element => element.event === 'Transfer' && element.args.to === '0x0000000000000000000000000000000000000000')
      assert.strictEqual(destroyLog.args.from, accounts[0])
      assert.strictEqual(destroyLog.args.value.toNumber(), initialSupply)

      const createLog = res.logs
        .find(element => element.event === 'Transfer' && element.args.from === '0x0000000000000000000000000000000000000000')
      assert.strictEqual(createLog.args.to, accounts[0])
      assert.strictEqual(createLog.args.value.toNumber(), initialSupply)
    })
  })

  describe('upgrade with', () => {
    beforeEach(async () => {
      await KNWB.setNextContract(KNW.address)
      await KNW.setPrevContract(KNWB.address)
      await KNWB.upgrade()
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

    describe('payments', () => {
      const fee = 5
      const ref = 'ID'
      const value = 100
      const balance = 1000
      const [store, seller, buyer] = accounts

      beforeEach(async () => {
        // Privision account with founds
        await KNW.transfer(buyer, balance, { from: store })
      })

      it('should create a payment request', async () => {
        await KNW.requestPayment(value, fee, ref, seller, { from: store })
        const [_value, _fee, _seller] = await KNW.paymentInfo(store, ref)

        assert.strictEqual(value, _value.toNumber())
        assert.strictEqual(fee, _fee.toNumber())
        assert.strictEqual(seller, _seller)
      })

      it('should make a payment', async () => {
        await KNW.requestPayment(value, fee, ref, seller, { from: store })
        await KNW.pay(store, ref, { from: buyer })

        const storeBalance = await KNW.balanceOf(store)
        assert.strictEqual(storeBalance.toNumber(), initialSupply - balance + fee)

        const buyerBalance = await KNW.balanceOf(buyer)
        assert.strictEqual(buyerBalance.toNumber(), balance - value - fee)

        const sellerBalance = await KNW.balanceOf(seller)
        assert.strictEqual(sellerBalance.toNumber(), value)
      })

      it('should fail at paying something that does not exist', async () => {
        await expectThrow(KNW.pay(store, ref, { from: buyer }))
      })

      it('should fail if the customer does not have all the founds and should revert the founds', async () => {
        await KNW.requestPayment(balance, fee, ref, seller, { from: store })
        await expectThrow(KNW.pay(store, ref, { from: buyer }))

        const buyerBalance = await KNW.balanceOf(buyer)
        assert.strictEqual(buyerBalance.toNumber(), balance)

        const sellerBalance = await KNW.balanceOf(seller)
        assert.strictEqual(sellerBalance.toNumber(), 0)
      })

      it('should fire Pay event', async () => {
        await KNW.requestPayment(value, fee, ref, seller, { from: store })
        const res = await KNW.pay(store, ref, { from: buyer })

        const log = res.logs.find(element => element.event.match('Pay'))
        assert.strictEqual(log.args.from, buyer)
        assert.strictEqual(log.args.seller, seller)
        assert.strictEqual(log.args.store, store)
        assert.strictEqual(log.args.value.toNumber(), value)
        assert.strictEqual(log.args.fee.toNumber(), fee)
        assert.strictEqual(log.args.ref, ref)
      })
    })
  })

  describe('upgrade from legacy', () => {
    it('should retain the balances', async () => {
      const proxy = await Proxy.new()
      const imp = await Legacy.new()

      await proxy.upgradeTo(imp.address)
      KNW = Legacy.at(proxy.address)

      await KNWB.setNextContract(KNW.address)
      await KNW.setPrevContract(KNWB.address)
      await KNWB.upgrade()

      const balance = await KNW.balanceOf(accounts[0])
      assert.strictEqual(balance.toNumber(), initialSupply)
    })
  })
})
