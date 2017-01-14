'use strict'

function transact () {

}

function call () {

}

module.exports = function wrap(eris) {

  return {

    transact: transact,

    call: call,

  }
}
