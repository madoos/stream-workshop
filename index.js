'use strict'

const { debug } = require('./src/util')
const DB = require('./src/DB')

const { User, Post, Tag } = DB({
  user: { ms: 1000, numItems: 2 },
  post: { ms: 2000, numItems: 4 },
  tag: { ms: 3000, numItems: 6 }
})

User.findOne().then(debug('User findOne:'))
Post.findOne().then(debug('Post findOne:'))
Tag.findOne().then(debug('Tag findOne:'))

User.findAll().then(debug('User findAll:'))
Post.findAll().then(debug('User findAll:'))
Tag.findAll().then(debug('User findAll:'))

User.findAllStream().on('data', debug('User findAllStream:'))
Post.findAllStream().on('data', debug('Post findAllStream:'))
Tag.findAllStream().on('data', debug('Tag findAllStream:'))
