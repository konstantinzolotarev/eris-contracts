'use strict'

const eris = require('eris-db-promise')
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
      return thrown new Error('ABI is required parameter')

    if (!bytecode || !util.isHex(bytecode))
      return throw new Error('Bytecode is required parameter')

    const params = {
      abi: abi,
      bytecode: bytecode,
      account: account
    }
    return new Contract(params, this._erisdb)
  }

}
