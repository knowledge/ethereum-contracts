const { credit } = require('./utils')
const Payment = artifacts.require('./Payment.sol')

contract('Payment', accounts => {
  const amount = 3000

  before(() =>
    Promise.all(accounts.map(account => credit(account, amount)))
  )

  it.only('should transfer tokens between acounts', () =>
    Payment.deployed()
      .then((payment) => payment.pay(accounts[1], amount, 'ref').then(() => token))
      .then((token) => token.balanceOf(accounts[1]))
      .then(balance => assert.equal(amount * 2, balance.toNumber(), 'Amounts dont match'))
  )
})
