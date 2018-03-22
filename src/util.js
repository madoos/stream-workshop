'use strict'

const R = require('ramda')
const { Readable, Transform } = require('stream')
const take = require('take-generator')

module.exports = {
  generatorToStream,
  generatorInstanceToStream,
  mapStream,
  _await,
  lazyTake: R.curry(lazyTake),
  delayStream: R.curry(delayStream),
  take: R.pipe(
    R.flip,
    R.curry
  )(take),
  toPromise: R.curry(toPromise)
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

function _await (fn, time) {
  return function (...args) {
    return new Promise((resolve) => {
      const data = fn(...args)
      setTimeout(() => resolve(data), time)
    })
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
  return stream.pipe(mapStream(_await(R.identity, ms)))
}

function toPromise (time, data) {
  return new Promise((resolve) => setTimeout(() => resolve(data), time))
}
