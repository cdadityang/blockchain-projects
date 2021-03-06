var PacktToken = artifacts.require('./PacktToken');

contract('PacktToken', async (accounts) => {
   it ('initialises the contract with the correct name', async () => {
    let instance = await PacktToken.deployed();

    let name = await instance.name();
    assert.equal(name, 'Packt ERC20 Token', 'has the correct name');

    
  });

  it ('initialises the contract with the correct symbol', async () => {
    let instance = await PacktToken.deployed();

    let symbol = await instance.symbol();
    assert.equal(symbol, 'PET', 'has the correct symbol');
  });

  it ('allocates the total supply on deployment', async () => {
    let instance = await PacktToken.deployed();

    let supply = await instance.totalSupply();
    assert.equal(supply, 1000000, 'sets the correct total supply');
  });
});