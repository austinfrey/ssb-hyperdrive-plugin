const FlumeReduce = require('flumeview-reduce')

exports.name = 'drive'
exports.version = require('./package.json').version
exports.manifest = {stream: 'source', get: 'async'}

const whitelist = ["kMtn+GVKlW6ULLeuDJI4xAM6d3fD9d0xRjw9pQH0OC8=.ed25519"]

function reduce (result, item) {
  if (!result) result = {}
  if (item) result[item.dirName] = item
  return result
}

function map (msg) {
  const author = msg.value.author
  const { dirName, publicKey, type} = msg.value.content

  if (dirName && type === 'hyperdrive' && author.indexOf(whitelist) !== -1) {
    return {author, dirName, publicKey}
  }
}

exports.init = (sbot, config) => sbot._flumeUse('drive', FlumeReduce(1, reduce, map))
