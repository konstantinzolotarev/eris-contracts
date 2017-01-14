'use strict'

const util = require('./util')
const fakeEth = require('./FakeEth')
const SolidityEvent = require('web3/lib/web3/event')
const SolidityFunction = require('web3/lib/web3/function')

/**
 * Contract instance
 * @type {Contract}
 */
module.exports = class Contract {

  constructor (data, eris) {
    this._eris = eris
    this.abi = data.abi
    this.bytecode = data.bytecode
    // account for signing
    this._account = data.account
  }

  new () {
    return Promise.reject(new Error('Not implemented yet !'))
  }

  at (address) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    return Promise.reject(new Error('Not implemented yet !'))
  }
}
