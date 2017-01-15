'use strict'

const _ = require('lodash')
const util = require('./util')
const fakeEth = require('./FakeEth')
const SolidityEvent = require('web3/lib/web3/event')
const SolidityFunction = require('web3/lib/web3/function')


const createFunction = (formatter, eth, json, address) => {
  const solidityFunction = new SolidityFunction(eth, json, address)
  const wrapMethod = (name, outputUnpacker) =>
    function (...args) {

      let callback = false
      if (_.isFunction(args[args.length - 1]))
        callback = args.pop()

      if (callback)
        return solidityFunction[name](...args)
      else {
        return new Promise((resolve, reject) => {
          args.push(function (err, data) {
            if (err)
              return reject(err)

            resolve(data)
          })

          return solidityFunction[name](...args)
        })
      }
      // const web3Args = erisToWeb3(args)
      //
      // // If there is a callback.
      // if ((web3Args.length > 0) && (is(Function, I.get(-1, web3Args)))) {
      //   const callback = I.get(-1, web3Args)
      //
      //   const callbackWrapper = (error, output) =>
      //     error
      //       ? callback(error)
      //       : callback(null, formatter(web3ToEris(outputUnpacker(output))))
      //
      //   return solidityFunction[name](...I.concat(
      //     I.slice(0, -1, web3Args),
      //     callbackWrapper
      //   ))
      // } else {
      //   // Never call the Solidity function in web3's synchronous mode.
      //   return solidityFunction[name](...web3Args.concat(R.identity))
      // }
    }

  const func = {
    call: wrapMethod('call'),

    sendTransaction: wrapMethod(
      'sendTransaction',
      solidityFunction.unpackOutput.bind(solidityFunction)
    )
  }

  Object.setPrototypeOf(func, solidityFunction)
  return func
}

/**
 * Should be called to add functions to contract object
 *
 * @method addFunctionsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
function addFunctionsToContract (contract, eth, outputFormatter) {
    contract.abi.filter(function (json) {
        return json.type === 'function'
    }).map(function (json) {
        const formatter = (result) => result

        return createFunction(formatter, eth, json, contract.address)
    }).forEach(function (f) {
        f.attachToContract(contract);
    });
};

/**
 * Contract instance
 * @type {Contract}
 */
module.exports = class Contract {

  constructor (data, eris) {
    this._eris = eris
    this.abi = data.abi
    // Note: could be empty
    this.bytecode = data.bytecode
    // account for signing
    this._account = data.account

    // List of contract instances
    this._instances = {}
  }

  new () {
    return Promise.reject(new Error('Not implemented yet !'))
  }

  /**
   * Should load contract from given address
   * @param {String} address
   * @return {Promise}
   */
  at (address) {
    if (!address || !util.isAddress(address))
      return Promise.reject(new Error('Address is required parameter'))

    return Promise.resolve(this.createContractInstance(address))
  }

  /**
   * Will create new contract instance and bind functions/events to it
   * @param {String} address
   */
  createContractInstance (address) {
    const contract = {
      abi: this.abi,
      address: address
    }

    addFunctionsToContract(contract, fakeEth(this._eris))

    return contract
  }

}
