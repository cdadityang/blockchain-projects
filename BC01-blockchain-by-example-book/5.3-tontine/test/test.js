// References the contract to use in the test script.
var Cplayer = artifacts.require("Cplayer");
var Ctontine = artifacts.require("Ctontine");

// Create a test suite for each contract, Its first parameter is an array with the accounts coming from Ganache.
contract('Cplayer', function(accounts) {
  it("..should ADD players", () => {
    Cplayer.deployed()
      .then(async () => {
        let Cp = await Cplayer.new();
        for (let i = 0; i < 3; i++) {
          await Cp.addPlayer("player" + i, 123, { from: accounts[i] });
          const P = await Cp.players.call(accounts[i]);
          assert.equal(P[2], accounts[i], "player not added");
        }
      });
  });

  it("..should FIND a player", () => {
    Cplayer.deployed()
      .then(async () => {
        let Cp = await Cplayer.new();
        for (let i = 0; i < 3; i++) {
          await Cp.addPlayer("player" + i, 123, { from: accounts[i] });
          const P = await Cp.findplayer(accounts[i]);
          assert.equal(P[0], "player" + i, "player not found");
        }
      });
  });

  it("..Only admin can REMOVE players", () => {
    Cplayer.deployed()
      .then(async () => {
        let error;
        await Cp.addPlayer("player1", 123, { from: secondAccount });
        try {
          await Cp.removePlayer(secondAccount, { from: thirdAccount });
          assert.fail();
        } catch (error) {
          const msgexist = error.message.search('revert') >= 0;
          assert.ok(msgexist);
        }
      });
  })
});

// Create a test suite for each contract, Its first parameter is an array with the accounts coming from Ganache.
contract('Ctontine', function(accounts) {

});