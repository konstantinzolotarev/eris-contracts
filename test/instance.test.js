'use strict'

const expect = require('chai').expect

describe('ContractManager :: ', () => {

  it('should exist', () => {
    expect(global.manager).to.be.an('object')
  })
})
