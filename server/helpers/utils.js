const crypto = require('crypto')

const Utils = {
  randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
      .toString('hex')
      .slice(0, len)
  }
}

module.exports = Utils
