const prompt = require('prompt-promise')
const getLatestVersion = require('./current-version')

const Knowledge = artifacts.require(getLatestVersion())

module.exports = async () => {
  const impAddress = await prompt('Proxy address: ')
  const knowledge = Knowledge.at(impAddress)

  const from = await prompt('From: ')
  const to = await prompt('To: ')
  const value = await prompt('Value: ')
  prompt.done()

  const result =  await knowledge.transfer(to, value, { from })
  console.log('Tx:', result.tx)
}
