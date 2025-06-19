const { expect } = require("chai");
const fs = require("node:fs");

const BasicCoin = artifacts.require("ERCCoin");
const BasicCoinTest = artifacts.require("ERCCoinTest");

contract("ERCCoin", function (accounts) {
  const [deployer, user1, user2] = accounts;

  beforeEach(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });
    this.basicCoinTest = await BasicCoinTest.new(this.basicCoin.address, {
      from: deployer,
    });

    await this.basicCoin.register({ from: user1 });

    await this.basicCoin.register({ from: user2 });

    await this.basicCoinTest.register(user1, { from: user1 });

    expect(await this.basicCoin.getBalance(user1)).to.be.bignumber.equal("0");
    expect(await this.basicCoin.getBalance(user2)).to.be.bignumber.equal("0");

    await this.basicCoin.mintTo("10000", this.basicCoinTest.address, {
      from: deployer,
    });
  });

  describe("when everything is set up", function () {
    it("should allow to transfer", async function () {
      let result = await this.basicCoinTest.transfer(user1, "1", user2, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/erc20_.csv",
        `erc-coin;transfer;${result.receipt.gasUsed}\n`
      );
    });
  });
});
