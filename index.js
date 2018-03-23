'use strict'

const R = require('ramda')

const { debug, mapStream } = require('./src/util')
const DB = require('./src/DB')

const { User, Post, Tag } = DB({
  user: { ms: 100, numItems: 2 },
  post: { ms: 200, numItems: 4 },
  tag: { ms: 5, numItems: 600 }
})
/*
User.findOne().then(debug('User findOne:'))
Post.findOne().then(debug('Post findOne:'))
Tag.findOne().then(debug('Tag findOne:'))

User.findAll().then(debug('User findAll:'))
Post.findAll().then(debug('User findAll:'))
Tag.findAll().then(debug('Tag findAll:'))
*/
/*
User.findAllStream().on('data', debug('User findAllStream:'))
Post.findAllStream().on('data', debug('Post findAllStream:'))
Tag.findAllStream().on('data', debug('Tag findAllStream:'))
*/
Tag.findOne().then(debug('Tag findOne:'))

const listengPosts = (postStream) => postStream.on('data', console.log)

User.findAllStream()
  .pipe(mapStream(R.pick(['name'])))
  .pipe(mapStream(Post.findAllStream))
  .pipe(mapStream(listengPosts))
