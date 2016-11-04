const config = require(__dirname + '/../config.js')
const thinky = require('thinky')(config.rethinkdb)

module.exports = thinky
