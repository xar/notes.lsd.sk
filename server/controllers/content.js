const express = require('express')
const router = express.Router()
const Content = require('../models/Content.js')
const Utils = require('../helpers/utils.js')

router.get('/create', (req, res) => {
  const contentItem = new Content({
    slug: Utils.randomValueHex(32),
    status: 0,
    content: '<div>###Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>'
  })

  contentItem.saveAll().then((result) => {
    return res.json({data: result}, 200)
  })
})


module.exports = router
