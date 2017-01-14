'use strict'

const eris = require('eris-db-promise')
const _ = require('lodash')
const util = require('./util')
const Contract = require('./Contract')

/**
 * ContractManager
 * @type {ContractManager}
 */
module.exports = class ContractManager {

  /**
   * @param {Srting} rpcUrl
   * @param {Object} account
   */
  constructor (rpcUrl, account) {
    this._rpcUrl = rpcUrl
    this._erisdb = eris.createInstance(rpcUrl)
    this._account = account
  }

  /**
   * Will create new Contract instance
   * @param {Array} abi
   * @param {String} bytecode
   * @return {Contract}
   */
  newContract (abi, bytecode) {
    if (!_.isArray(abi))
      throw new Error('ABI is required parameter')

    if (!bytecode || !util.isHex(bytecode))
      throw new Error('Bytecode is required parameter')

    const params = {
      abi: abi,
      bytecode: bytecode,
      account: this._account
    }
    return new Contract(params, this._erisdb)
  }

}
