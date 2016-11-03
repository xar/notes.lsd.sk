const express = require('express')
const router = express.Router()
const io = require('socket.io')(3002)
const ot = require('../helpers/ot/index.js')
const Utils = require('../helpers/utils.js')
const Content = require('../models/Content.js')
const _ = require('lodash');
var documents = []
var doc = ''

const createContentIfNotExists = (token) => {
  return new Promise((resolve, reject) => {
    Content.filter({
      slug: token
    }).run().then((result) => {
      // If Item doesn't exist already. Create new item
      if (result.length === 0) {
        const contentItem = new Content({
          slug: token,
          status: 0,
          content: '### You can write here',
          revisions: []
        })
        contentItem.saveAll().then((result) => {
          resolve(result)
        })
      } else {
        resolve(result[0])
      }
    })
  })
}

const pushContentToMemory = (item) => {
  return new Promise((resolve, reject) => {
    var checkIfExists = _.find(documents, {
      slug: item.slug
    })
    if (!checkIfExists) {
      console.log('pushed')
      documents.push(item)
    } else {
      console.log('test')
      console.log(documents)
    }
    resolve()
  })
}

const updateContent = (id, content, revisions) => {
  Content.save([{
    id: id,
    content: content,
    revisions: revisions
  }],{
    conflict: 'update'
  }).then((doc) => {
    console.log(doc)
  })
}

io.sockets.on('connection', function (socket) {
  socket.on('set_token', (token) => {
    createContentIfNotExists(token).then((results) => {
      pushContentToMemory(results).then(() => {
        var content = results.content
        var revisions = results.revisions

        // socket.join(token)
        var ot_server = new ot.EditorSocketIOServer(content, revisions, token, function (socket, cb) {
          content = ot_server.document
          updateContent(results.id, content)
          cb(!!socket.mayEdit);
        })
        console.log('Joined to room: %s', token)
        ot_server.addClient(socket)
        // ot_server.setName(socket, 'FERI')
        socket.mayEdit = true
      })
    })
  })
})
