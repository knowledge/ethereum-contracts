const leftPad = require('left-pad')

module.exports = {
  async expectThrow (promise) {
    const errMsg = 'Expected throw not received'

    try {
      await promise
    } catch (err) {
      const error = err.toString()
      assert(error.includes('invalid opcode') || error.includes('revert'), errMsg)
      return
    }

    assert.fail(errMsg)
  },
  convertTo: {
    uint256 (num) {
      return leftPad(num.toString(16), 64)
    }
  },
  sign (address, message) {
    const hash = web3.sha3(message, { encoding: 'hex' })
    const signature = web3.eth.sign(address, hash).slice(2)

    return [
      hash,
      '0x' + signature.slice(0, 64),
      '0x' + signature.slice(64, 128),
      parseInt(signature.slice(128, 130), 10) + 27
    ]
  }
}
