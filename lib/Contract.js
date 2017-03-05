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
        callback = true

      args = args.map((argument) => {
        if (util.isAddress(argument) && argument.slice(0, 2) !== '0x')
          return '0x' + argument

        return argument
      })

      if (callback)
        return solidityFunction[name](...args)
      else {
        return new Promise((resolve, reject) => {
          args.push(function (err, data) {
            if (err)
              return reject(err)

            if (!outputUnpacker)
              outputUnpacker = function (data) { return data }

            data = outputUnpacker(data)

            if (_.isString(data) && data.slice(0, 2) == '0x')
              data = data.slice(2).toUpperCase()

            resolve(data)
          })

          return solidityFunction[name](...args)
        })
      }
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
  contract.abi
    .filter(function (json) {
      return json.type === 'function'
    })
    .map(function (json) {
      const formatter = (result) => result

      return createFunction(formatter, eth, json, contract.address)
    })
    .forEach(function (func) {
      func.attachToContract(contract)
    })
}

const createEvent = (json, address, pipe) => {
  const solidityEvent = new SolidityEvent(null, json, address)

  const event = {
    /**
     * Should be used to create new eris-db events from events.
     *
     * @method execute
     * @param {function} [startCallback] - error-first callback. The data object is the EventSub. If left out
     * it will not return a sub and will automatically shut the sub down after the first event is received.
     * It is equivalent to but less expressive then calling 'Contract.eventName.once(eventCallback)'.
     * @param {function} eventCallback - error-first callback. The data object is a formatted solidity event.
     * @return {Object} filter object
     */
    execute (startCallback, eventCallback) {
      if (!eventCallback){
        eventCallback = startCallback
        startCallback = null
      }
      const formatter = this.decode.bind(this)
      const that = this
      return pipe.eventSub(this._address, startCallback, function (error, event) {
        if (error) {
          eventCallback(error)
          return
        }
        // TODO handle anonymous.
        // TODO we don't have filtering in tendermint yet, so I do it here.
        if (event.topics[0].toLowerCase() === that.signature()) {
          let fmtEvent, err
          try {
            fmtEvent = formatter(event)
          }
          catch (error) {
            err = error
          }

          console.log('==========================') // eslint-disable-line
          console.log(fmtEvent) // eslint-disable-line
          console.log('==========================') // eslint-disable-line
          eventCallback(err, fmtEvent)
        }
      })
    },

    attachToContract (contract) {
      super.attachToContract(contract)

      // Will stop as soon as it receives an event.
      contract[this.displayName()].once = this.execute.bind(this)
    }
  }

  Object.setPrototypeOf(event, solidityEvent)
  return event
}

/**
 * Should be called to add events to contract object
 *
 * @method addEventsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
const addEventsToContract = function (contract, pipe) {
  contract.abi.filter(function (json) {
    return json.type === 'event'
  }).map(function (json) {
    return createEvent(json, contract.address, pipe)
  }).forEach(function (e) {
    e.attachToContract(contract)
  })
}

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

    this._deployed_address = data.address || ''

    // List of contract instances
    this._instances = {}
  }

  deployed () {
    return {
      address: this._deployed_address
    }
  }

  /**
   * Create new transaction with contract details
   * @return {Promise}
   */
  new () {
    if (!this.bytecode || !util.isHex(this.bytecode))
      return Promise.reject(new Error('No bytecode exist'))

    return this._eris
      .unsafe
      .transactAndHold(this._account.privKey, this.bytecode, '', 0, 100000)
      .then((info) => {
        if (!info || !info.call_data || !info.call_data.callee)
          return Promise.reject(new Error('Error deploying new contract'))

        return this.createContractInstance(info.call_data.callee)
      })
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
      address: address,

      deployed: function () {
        return {
          address: this.address
        }
      }
    }

    addFunctionsToContract(contract, fakeEth(this._eris, this._account))
    // addEventsToContract(contract, fakeEth(this._eris, this._account))
    return contract
  }

}
