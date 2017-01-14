'use strict'

const expect = require('chai').expect

describe('ContractManager :: ', () => {

  it('should exist', () => {
    expect(global.manager).to.be.an('object')
    expect(global.manager.newContract).to.be.a('function')
  })

  it('should create erisdb instance', () => {
    expect(global.manager._erisdb).to.be.an('object') // eslint-disable-line
  })

  it('throw without abi', () => {
    const func = () => {
      global.manager.newContract()
    }
    expect(func).to.throw(Error, 'ABI is required parameter')
  })

  it('throw without bytecode', () => {
    const func = () => {
      global.manager.newContract([])
    }
    expect(func).to.throw(Error, 'Bytecode is required parameter')
  })

  it('should return Contract', () => {
    const contract = global.manager.newContract([], new Buffer('test').toString('hex'))
    expect(contract).to.be.an('object')
      .and.to.contain.all.keys([
        'abi', 'bytecode', '_account', '_eris'
      ])

    expect(contract.new).to.be.a('function')
    expect(contract.at).to.be.a('function')
  })

})
