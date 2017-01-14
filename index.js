'use strict'

const ContractManager = require('./lib/ContractManager')
const _ = require('lodash')

module.exports = {

  /**
   * Will create new {@link ContractManager}
   * @throws Error
   * @param {String} rpcUrl
   * @param {Object} account
   * @return {ContractManager}
   */
  newContractManager (rpcUrl, account) {
    if (!_.isString(rpcUrl) || !rpcUrl.length)
      throw new Error('RPCUrl is required parameter')

    if (!_.isObject(account) || !account.privKey || !account.address)
      throw new Error('Account is required parameter')

    return new ContractManager(rpcUrl, account)
  }

}
