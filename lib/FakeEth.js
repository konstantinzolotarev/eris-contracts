'use strict'

const _ = require('lodash')
const util = require('./util')

module.exports = function wrap(eris, account) {

  return {

    sendTransaction: function (transactionObject, callback) {
      callback = callback || _.noop

      console.log('==========================')
      console.log(transactionObject)
      console.log('==========================')

      if (_.startsWith(transactionObject.data, '0x'))
        transactionObject.data = transactionObject.data.slice(2)

      return eris
        .unsafe
        .transactAndHold(account.privKey, transactionObject.data, transactionObject.to)
        .then((data) => {
          console.log('==========================')
          console.log(data)
          console.log('==========================')
          if (util.isHex(data.return))
            data.return = '0x' + data.return

          callback(null, data.return)
          return data.return
        })
        .catch((err) => callback(err))
    },

    call: function (callObject, defaultBlock, callback) {
      callback = callback || _.noop

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
