# Eris contracts JS

This library is built to be able to work with Eris Contracts using JS and Promises

## Installation

### Prerequisites

You will need ErisDB installed and running Also this library is using ES6 so you will have to use node.js > 4.0.0

### Installing node module

```bash
$ npm i --save eris-contracts-promise
```

### Getting Account data

First of all to be able to use this module you have to have your account:

 - Address
 - Private key
 - Public key

On most of Linux based OS you will find them into `~/.eris/chains/<your-chain-name>/priv_validator.json`

## Usage

Finding out ErisDB IP
```bash
$ eris chains inspect <name of ErisDB server> NetworkSettings.IPAddress
```

After that you will be able to create new instance of library:

```javascript
const ContractContent = `
  contract GetSetContract {

    uint public something;

    function setSomething(uint newSome) {
      something = newSome;
    }
  }
`

const ErisContracts = require('eris-contracts-promise')

// Your ErisRPC url
const rpcUrl = 'http://localhost:1337/rpc'
// Account details
const account = {
  address: 'someaddress',
  privKey: 'accountPrivateKey',
  pubKey: 'accountPublicKey'
}
const ContractManager = ErisContracts.newContractManager(rpcUrl, account)

/**
* You have to compile your contract before using it.
*/
const compiled = require('solc').compile(ContractContent, 1).contracts['ContractName']
const abi = JSON.parse(compiled.interface)
// Create contract instance
const SomeContract = ContractManager.newContract(abi, compiled.bytecode.toUpperCase())

// Now we could work with newly created contract
SampleContract.at('address')
  .then((contract) => {
    // And call it's functions
    return contract
      .setSomething(1)
      .then(() => {
        //new value set
      })
  })
```

For more information please take a look into `test` folder. You will find more examples in there.
