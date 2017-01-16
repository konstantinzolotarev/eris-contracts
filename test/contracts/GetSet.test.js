'use strict'

const expect = require('chai').expect
const solc = require('solc')
const config = require('../config')

const GetSetContract = `
  contract GetSetContract {

    uint public something;

    function setSomething(uint newSome) {
      something = newSome;
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

    it('should set default value for something', () => {
      return SampleContract
        .at(contractAddress)
        .then((contract) => contract.something.call())
        .then((value) => {
          expect(value).to.be.an('object')
          expect(value.toNumber()).to.be.eq(0)
        })
    })

    it('should have setSomething() method', () => {
      return SampleContract
        .at(contractAddress)
        .then((contract) => {
          expect(contract.setSomething).to.be.a('function')
        })
    })

    it('should have setSomething()', () => {
      return SampleContract
        .at(contractAddress)
        .then((contract) => contract.setSomething(1))
        .then(() => {
          expect(true)
        })
    })

    it('should have something constant and be callable with callback', (done) => {
      SampleContract
        .at(contractAddress)
        .then((contract) => {
          contract.something.call((err, value) => {
            if (err)
              return done(err)

            expect(value).to.be.an('object')
            expect(value.toNumber()).to.be.eql(1)
            done()
          })
        })
    })

  })

})
