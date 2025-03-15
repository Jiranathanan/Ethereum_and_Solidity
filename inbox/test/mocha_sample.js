const ganache = require('ganache');
const { Web3 } = require('web3');

// updated ganache and web3 imports added for convenience

const assert = require('assert');

// contract test code will go here
const web3 = new Web3(ganache.provider());

// Mocha Functions
// Function : Purpose
// it : Run a test and make an assertion
// describe : Groups together 'it' functions
// beforeEach : Execute some general setup code

class Car {
    park() {
        return 'stopped';
    }
    drive() {
        return 'vroom';
    }
}

let car;
beforeEach( () => {
    car = new Car();
})

describe('Car', () => {
    it('car park', () => {
        assert.equal(car.park(), 'stopped');
    });
    it('can run', () => {
        assert.equal(car.drive(), 'vroom');
    });
});
