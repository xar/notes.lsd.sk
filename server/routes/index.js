const express = require('express')
global.router = express.Router()
const contentController = require('../controllers/content.js')

router.use('/content', contentController)

module.exports = router
