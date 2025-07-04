const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");
const fs = require("node:fs");
const BasicCoin = artifacts.require("BasicCoin");
const CrowdFund = artifacts.require("Crowdfund");

contract("Crowdfund", function (accounts) {
  const [deployer, user1, user2, reclaimer, receiver] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });

    // register the deployer
    await this.basicCoin.register({ from: deployer });

    // Register user1
    await this.basicCoin.register({ from: user1 });
    // Mint to user 1
    await this.basicCoin.mintTo(200, user1, { from: deployer });

    // Register user2
    await this.basicCoin.register({ from: user2 });
    // Mint to user 2
    await this.basicCoin.mintTo(200, user2, { from: deployer });

    // Register reclaimer
    await this.basicCoin.register({ from: reclaimer });
    // Mint to reclaimer
    await this.basicCoin.mintTo(200, reclaimer, { from: deployer });

    // Register receiver
    await this.basicCoin.register({ from: receiver });
    // Mint to receiver
    await this.basicCoin.mintTo(200, receiver, { from: deployer });
  });
  describe("when everyting is set up", function () {
    before(async function () {
      const timestamp = await time.latest();
      const endDonate = toNumber(timestamp) + 1000;
      this.crowdfund = await CrowdFund.new(
        this.basicCoin.address,
        endDonate,
        200,
        receiver
      );
    });
    it("user 1 should be able to donate", async function () {
      let result = await this.crowdfund.donate(100, { from: user1 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;donate;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to donate", async function () {
      let result = await this.crowdfund.donate(200, { from: user2 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;donate;${result.receipt.gasUsed}\n`
      );
    });
    it("reclaimer should be able to donate", async function () {
      let result = await this.crowdfund.donate(200, { from: reclaimer });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;donate;${result.receipt.gasUsed}\n`
      );
    });
    it("reclaimer should be able to reclaim", async function () {
      // increase time to end the donation period
      await time.increase(2000);
      let result = await this.crowdfund.reclaim({ from: reclaimer });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;reclaim;${result.receipt.gasUsed}\n`
      );
    });
    it("receiver should be able to withdraw", async function () {
      let result = await this.crowdfund.withdraw({ from: receiver });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;withdraw;${result.receipt.gasUsed}\n`
      );
    });
  });
});
