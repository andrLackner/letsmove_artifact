const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");

const Crowdfund = artifacts.require("Crowdfund");

contract("Crowdfund", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  describe("Win execution", async function () {
    let payableValue = 1000;
    let blocks = 100;
    before(async function () {
      let now = await time.latestBlock();
      let goal = 100;
      this.crowdfund = await Crowdfund.new(
        user1,
        toNumber(now) + blocks,
        goal,
        { from: deployer }
      );
    });
    describe("After deployment", async function () {
      it("User1 could donate", async function () {
        let result = await this.crowdfund.donate({
          from: user1,
          value: payableValue,
        });
        console.log("Join cost: ", result.receipt.gasUsed);
      });
      it("User2 could donate", async function () {
        let result = await this.crowdfund.donate({
          from: user2,
          value: payableValue,
        });
        console.log("Join cost: ", result.receipt.gasUsed);
      });
      it("Deployer could withdraw", async function () {
        // increase the block number to simulate the passage of time
        let now = await time.latestBlock();
        await time.advanceBlockTo(toNumber(now) + blocks);
        let result = await this.crowdfund.withdraw({
          from: deployer,
        });
        console.log("Withdraw cost: ", result.receipt.gasUsed);
      });
    });
  });
  describe("Reclaim execution", async function () {
    let payableValue = 1000;
    let blocks = 100;
    before(async function () {
      let now = await time.latestBlock();
      let goal = 10000;
      this.crowdfund = await Crowdfund.new(
        user1,
        toNumber(now) + blocks,
        goal,
        { from: deployer }
      );
    });
    describe("After deployment", async function () {
      it("User1 could donate", async function () {
        let result = await this.crowdfund.donate({
          from: user1,
          value: payableValue,
        });
        // console.log('Join cost: ', result.receipt.gasUsed);
      });
      it("User2 could donate", async function () {
        let result = await this.crowdfund.donate({
          from: user2,
          value: payableValue,
        });
        // console.log('Join cost: ', result.receipt.gasUsed);
      });
      it("User1 could reclaim", async function () {
        // increase the block number to simulate the passage of time
        let now = await time.latestBlock();
        await time.advanceBlockTo(toNumber(now) + blocks);
        let result = await this.crowdfund.reclaim({
          from: user1,
        });
        console.log("Reclaim cost: ", result.receipt.gasUsed);
      });
    });
  });
});
