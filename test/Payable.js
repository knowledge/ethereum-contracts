const Knowledge = artifacts.require('Payable')
const KnowledgeProxy = artifacts.require('KnowledgeProxy')
const KnowledgeBase = artifacts.require('KnowledgeBaseLegacy')

const { expectThrow } = require('./utils')

const initialSupply = 150000000 * 10 ** 8

contract('Payable', accounts => {
  let KNW
  const fee = 5
  const ref = 'ID'
  const value = 100
  const balance = 1000
  const [store, seller, buyer] = accounts

  beforeEach(async () => {
    const imp = await Knowledge.new()
    const base = await KnowledgeBase.new()
    const proxy = await KnowledgeProxy.new()

    await proxy.upgradeTo(imp.address)
    KNW = Knowledge.at(proxy.address)

    await base.setNextContract(proxy.address)
    await KNW.setPrevContract(base.address)
    await base.upgrade()

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
