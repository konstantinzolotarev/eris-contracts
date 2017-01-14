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

  let compiled

  before(() => {
    compiled = solc.compile(Sample, 1).contracts['SampleContract']
    expect(compiled).to.be.an('object')
  })

})
