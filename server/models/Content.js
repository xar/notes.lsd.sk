const thinky = require('../helpers/thinky.js')
const type = thinky.type

const Content = thinky.createModel('Content', {
  id: type.string(),
  slug: type.string(),
  secret: type.string(),
  content: type.string(),
  status: type.number()
})

module.exports = Content
