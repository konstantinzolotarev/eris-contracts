'use strict'

const _ = require('lodash')
const util = require('./util')

module.exports = function wrap(eris) {

  return {

    sendTransaction: function (transactionObject, callback) {
      console.log('==========================')
      console.log('sendTransaction', transactionObject)
      console.log('==========================')
    },

    call: function (callObject, defaultBlock, callback) {
      if (_.startsWith(callObject.data, '0x'))
        callObject.data = callObject.data.slice(2)

      return eris
        .transactions
        .call(callObject.to, callObject.data)
        .then((data) => {
          if (util.isHex(data.return))
            data.return = '0x' + data.return

          callback(null, data.return)
          return data.return
        })
        .catch((err) => callback(err))
    },

  }
}
