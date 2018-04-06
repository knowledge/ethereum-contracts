const prompt = require('prompt-promise')

module.exports = async () => {
  const from = await prompt('From: ')
  const to = await prompt('To: ')
  const value = await prompt('Value: ')
  prompt.done()

  const result = await new Promise((resolve, reject) =>
    web3.eth.sendTransaction({ from, to, value }, (err, res) =>
      err ? reject(err) : resolve(res)))

  console.log('Tx: ', result)
}
