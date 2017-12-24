const Token = artifacts.require('./Token.sol')

module.exports.credit = (account, amount) =>
  Token.deployed().then(token => token.mint(account, amount))
