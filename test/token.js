const { credit } = require('./utils')
const Token = artifacts.require('./Token.sol')

contract('Token', accounts => {
  const amount = 3000

  it(`should credit ${amount} tokens to each account`, () =>
    Promise.all(accounts.map(account => credit(account, amount)))
  )

  it('should persist the credited tokens', () =>
    Token.deployed()
      .then((token) => token.balanceOf(accounts[0]))
      .then(balance => assert.equal(amount, balance.toNumber(), 'Amounts dont match'))
  )

  it('should transfer tokens between acounts', () =>
    Token.deployed()
      .then((token) => token.transfer(accounts[1], amount).then(() => token))
      .then((token) => token.balanceOf(accounts[1]))
      .then(balance => assert.equal(amount * 2, balance.toNumber(), 'Amounts dont match'))
  )
})
