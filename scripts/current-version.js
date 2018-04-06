const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const versionFile = join(__dirname, '../CURRENT_VERSION')
const LATEST_VERSION = readFileSync(versionFile, 'utf8')

module.exports = (version) => {
  if (typeof version === 'string') {
    writeFileSync(versionFile, version, 'utf8')
    console.log('Version set to:', version)
  } else {
    console.log('Latest version:', LATEST_VERSION)
    return LATEST_VERSION.trim()
  }
}
