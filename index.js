'use strict'

const DB = require('./src/DB')

const { User, Post, Tag } = DB({ ms: 5, numItems: 10 })

console.log(User, Post, Tag)

User.findAllStream(5)
.on('data', console.log)
