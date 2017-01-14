'use strict'

const erisContracts = require('../index')
const config = require('./config')

before(() => {
  global.manager = erisContracts.newContractManager(config.rpc, config.account)
})
