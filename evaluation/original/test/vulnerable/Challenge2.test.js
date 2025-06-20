const { expect } = require("chai");

const BasicCoin = artifacts.require("BasicCoin");
const Challenge2 = artifacts.require("Challenge2");

contract("Challenge 2", function (accounts) {
  const [deployer, user1, user2] = accounts;

  let mintAmount = "100";

  beforeEach(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });
    this.challenge2 = await Challenge2.new(this.basicCoin.address, {
      from: deployer,
    });

    await this.challenge2.register();

    await this.basicCoin.mintTo(mintAmount, this.challenge2.address, {
      from: deployer,
    });
  });

  describe("when everything is set up", function () {
    let initialAmount = "10";
    let finalAmount = "100";
    it("should allow to manipulate a resource", async function () {
      await this.challenge2.manipulateResource(initialAmount, finalAmount);
      expect(
        await this.basicCoin.getBalance(this.challenge2.address)
      ).to.be.bignumber.equal("190");
    });
  });
});
