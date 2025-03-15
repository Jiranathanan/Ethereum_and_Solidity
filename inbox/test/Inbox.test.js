const ganache = require('ganache');
const assert = require('assert');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

// updated ganache and web3 imports added for convenience

// contract test code will go here
let accounts;
let inbox;
// refactor to async-await patterns 

beforeEach( async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!']})
        .send( { from: accounts[0] , gas: '1000000'})

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // ok method is checking if the value is exist ?
        assert.ok(inbox.options.address);
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