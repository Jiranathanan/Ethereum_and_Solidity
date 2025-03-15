const ganache = require('ganache');
const { Web3 } = require('web3');

// updated ganache and web3 imports added for convenience

const assert = require('assert');

// contract test code will go here
const web3 = new Web3(ganache.provider());

