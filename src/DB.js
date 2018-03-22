'use strict'

const faker = require('faker')
const R = require('ramda')

const {
  lazyTake,
  take,
  delayStream,
  generatorInstanceToStream,
  toPromise
} = require('./util')

const genToAsyncStream = (ms) => R.pipe(generatorInstanceToStream, delayStream(ms))
const findAllStreamTo = (generatorFn, { numItems = 1000, ms = 250 }) => R.pipe(lazyTake(generatorFn, numItems), genToAsyncStream(ms))
const findOneTo = (generatorFn, { ms }) => R.pipe(
                                              generatorFn,
                                              take(1),
                                              Array.from,
                                              R.head,
                                              toPromise(ms)
                                            )

module.exports = (opt/* { ms, numItems} */) => ({
  User: {
    findAllStream: findAllStreamTo(getUsers, opt),
    findOne: findOneTo(getUsers, opt)
  },
  Post: {
    findAllStream: findAllStreamTo(getPosts, opt),
    findOne: findOneTo(getPosts, opt)
  },
  Tag: {
    findAllStream: findAllStreamTo(getTags, opt),
    findOne: findOneTo(getTags, opt)
  }
})

function * getUsers (query = {}) {
  let id = 0
  while (true) {
    yield {
      id: ++id,
      name: faker.internet.userName(),
      email: faker.internet.email(),
      ...query
    }
  }
}

function * getPosts (query = {}) {
  let id = 0
  while (true) {
    yield {
      id: ++id,
      title: faker.name.title(),
      slug: faker.lorem.slug(3),
      ...query
    }
  }
}

function * getTags (query = {}) {
  let id = 0
  while (true) {
    yield {
      tag: faker.lorem.word(),
      id: ++id,
      ...query
    }
  }
}
