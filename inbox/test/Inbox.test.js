const ganache = require('ganache');
const assert = require('assert');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
// updated ganache and web3 imports added for convenience

// contract test code will go here
// refactor to async-await patterns 

beforeEach( async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy contract
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        console.log(accounts);
    })
})



// callback patterns (legacy)
/*
beforeEach( () => {
    // Get a list of a ll accounts
    web3.eth.getAccounts()
    .then(fetchedAccounts => {
        console.log(fetchedAccounts);
    })
})

describe('Inbox', () => {
    it('deploys a contract', () => {})
})
*/