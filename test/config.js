'use strict'

// Getting priv key for user and address
const validator = require(process.env.HOME + '/.eris/chains/simplechain/priv_validator.json')

module.exports = {

  rpc: process.env.RPC_URL || 'http://localhost:1337/rpc',

  account: {
    address: validator.address,
    pubKey: validator.pub_key[1],
    privKey: validator.priv_key[1]
  }
}
