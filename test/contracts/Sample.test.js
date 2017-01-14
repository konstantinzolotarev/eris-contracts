'use strict'

const expect = require('chai').expect
const solc = require('solc')

const Sample = `
  contract SampleContract {
    function add(int a, int b) constant returns (int sum) {
      sum = a + b;
    }
  }
`

describe('SampleContract :: ', () => {

  let SampleContract

  before(() => {
    const compiled = solc.compile(Sample, 1).contracts['SampleContract']
    expect(compiled).to.be.an('object')
    const abi = JSON.parse(compiled.interface)

    SampleContract = global.manager.newContract(abi, compiled.bytecode.toUpperCase())
  })

  it('should exist', () => {
    expect(SampleContract).to.be.an('object')

    expect(SampleContract.new).to.be.a('function')
    expect(SampleContract.at).to.be.a('function')
  })

  describe('SampleContract.at() :: ', () => {

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
  })

})
