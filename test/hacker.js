const Hacker = artifacts.require("Hacker");
const Preservation = artifacts.require("Preservation");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function ([_owner, _hacker]) {
  it("should claim ownership", async function () {
    const hackerContract = await Hacker.deployed();
    const targetContract = await Preservation.deployed();
    expect(await targetContract.owner()).to.be.equal(_owner);
    const result = await hackerContract.attack(targetContract.address, { from: _hacker, gas: 500000 });
    expect(result.receipt.status).to.be.equal(true);
    expect(await targetContract.owner()).to.be.equal(_hacker);
  });
});
