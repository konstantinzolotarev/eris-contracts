'use strict'

const _ = require('lodash')
const util = require('./util')

module.exports = function wrap(eris, account) {

  return {

    sendTransaction: function (transactionObject, callback) {
      callback = callback || _.noop

      if (_.startsWith(transactionObject.data, '0x'))
        transactionObject.data = transactionObject.data.slice(2)

      return eris
        .unsafe
        .transactAndHold(account.privKey, transactionObject.data, transactionObject.to || '', 0, 1000000)
        // .transact(account.privKey, transactionObject.data, transactionObject.to, 0, 1000000)
        .then((data) => {
          if (transactionObject.to) {
            if (util.isHex(data.return))
              data.return = '0x' + data.return

            callback(null, data.return)
            return data.return
          }
          else {
            callback(null, data.call_data.callee)
            return data.call_data.callee
          }
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
