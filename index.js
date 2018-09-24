const FlumeReduce = require('flumeview-reduce')
const fs = require('fs')
const path = require('path')

exports.name = 'drive'
exports.version = require('./package.json').version
exports.manifest = {stream: 'source', get: 'async'}
console.log(__dirname)
const config = fs.readFileSync(path.join(__dirname, '../../config'))

const { whitelist } = JSON.parse(config)

function reduce (result, item) {
  if (item) result.push(item)
  return result
}

function map (msg) {
  const author = msg.value.author
  const { dirName, publicKey, type} = msg.value.content

  if (dirName && type === 'hyperdrive' && author.indexOf(whitelist) !== -1) {
    return {type, author, dirName, publicKey}
  }
}

exports.init = (sbot, config) => sbot._flumeUse('drive', FlumeReduce(1, reduce, map, null, []))
