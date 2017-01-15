'use strict'

const expect = require('chai').expect
const solc = require('solc')
const config = require('../config')

const GetSetContract = `
  contract GetSetContract {

    uint public something;

    function setSomething(uint level) {
      something = level;
    }
  }
`

describe('GetSetContract :: ', () => {

  let SampleContract

  before(() => {
    const compiled = solc.compile(GetSetContract, 1).contracts['GetSetContract']
    expect(compiled).to.be.an('object')
    const abi = JSON.parse(compiled.interface)

    SampleContract = global.manager.newContract(abi, compiled.bytecode.toUpperCase())
  })

  it('should exist', () => {
    expect(SampleContract).to.be.an('object')

    expect(SampleContract.new).to.be.a('function')
    expect(SampleContract.at).to.be.a('function')
  })

  describe('GetSetContract.at() :: ', () => {

    let contractAddress

    before(() => {
      const eris = global.manager.getEris()
      expect(eris).to.be.an('object')
      return eris
        .unsafe
        .transactAndHold(config.account.privKey, SampleContract.bytecode, '')
        .then((info) => {
          expect(info).to.be.an('object')
            .and.to.contain.all.keys([
              'tx_id', 'call_data'
            ])

          expect(info.call_data).to.be.an('object')
            .and.to.contain.all.keys([
              'callee', 'caller'
            ])

          contractAddress = info.call_data.callee
        })
    })

    it('reject without address', () => {
      return SampleContract
        .at()
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('reject with wrong address', () => {
      return SampleContract
        .at('wrong-address')
        .then(() => Promise.reject())
        .catch((err) => {
          expect(err).to.be.an('error')
            .and.to.have.property('message', 'Address is required parameter')
        })
    })

    it('should create new contract', () => {
      return SampleContract
        .at(contractAddress)
        .then((contract) => {
          expect(contract).to.be.an('object')
            .and.to.have.property('address', contractAddress)
        })
    })

    it('should have setSomething() method', () => {
      return SampleContract
        .at(contractAddress)
        .then((contract) => {
          expect(contract.setSomething).to.be.a('function')
        })
    })

    it('setSomething() should add numbers', () => {
      return SampleContract
        .at(contractAddress)
        .then((contract) => contract.setSomething(1))
        .then(() => {
          console.log('==========================')
          console.log(123)
          console.log('==========================')
        })
    })

  })

})
