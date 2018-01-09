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
  }
}
