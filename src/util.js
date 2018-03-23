'use strict'

const R = require('ramda')
const { Readable, Transform } = require('stream')
const take = require('take-generator')
const chalk = require('chalk')

module.exports = {
  generatorToStream,
  generatorInstanceToStream,
  mapStream,
  toAsync,
  lazyTake: R.curry(lazyTake),
  delayStream: R.curry(delayStream),
  take: R.pipe(
    R.flip,
    R.curry
  )(take),
  toPromise: R.curry(toPromise),
  debug
}

function generatorToStream (genFn) {
  return function (...args) {
    return generatorInstanceToStream(genFn)(...args)
  }
}

function generatorInstanceToStream (gen) {
  return new Readable({
    objectMode: true,
    writableObjectMode: true,
    readableMode: true,
    read () {
      try {
        const iterator = gen.next()
        !iterator.done ? this.push(iterator.value) : this.push(null)
      } catch (e) {
        this.emit('error', e)
      }
    }
  })
}

function mapStream (fn) {
  return new Transform({
    objectMode: true,
    writableObjectMode: true,
    readableMode: true,
    transform: function (data, enc, done) {
      const res = fn(data, enc)

      return (res.then)
        ? res.then((_data) => done(null, _data)).catch(done)
        : done(null, res)
    }
  })
}

function toAsync (fn, time) {
  return function (...args) {
    return toPromise(time, fn(...args))
  }
}

function lazyTake (genFn, n) {
  return function * (...args) {
    let i = 0
    for (let value of genFn(...args)) {
      yield value
      if (++i === n) break
    }
  }
}

function delayStream (ms, stream) {
  return stream.pipe(mapStream(toAsync(R.identity, ms)))
}

function toPromise (time, data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), time))
}

function debug (tag, data) {
  let c = 1
  return (data) => {
    console.log(chalk.green(tag), chalk.yellow(c++))
    console.log(data)
  }
}
