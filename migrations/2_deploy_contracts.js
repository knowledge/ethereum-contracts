const Token = artifacts.require('./Token.sol')
const Payment = artifacts.require('./Payment.sol')

module.exports = deployer =>
  deployer.deploy(Token)
    .then(() => deployer.deploy(Payment, Token.address))
