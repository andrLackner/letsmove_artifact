const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");

const Bet = artifacts.require("Bet");

contract("Bet", function (accounts) {
  const [deployer, user1, user2, oracle] = accounts;

  let payableValue = 1000;
  let blocks = 10;

  describe("Win execution", async function () {
    before(async function () {
      this.bet = await Bet.new(oracle, user2, blocks, {
        from: user1,
        value: payableValue,
      });
    });
    describe("After deployment", async function () {
      it("User2 could join the bet", async function () {
        let result = await this.bet.join({
          from: user2,
          value: payableValue,
        });
        console.log("Join cost: ", result.receipt.gasUsed);
      });
      it("Oracle could decide the winner", async function () {
        let result = await this.bet.win(1, {
          from: oracle,
        });
        console.log("Win cost: ", result.receipt.gasUsed);
      });
    });
  });
  describe("Timeout execution", async function () {
    before(async function () {
      this.bet = await Bet.new(oracle, user2, blocks, {
        from: user1,
        value: payableValue,
      });
    });

    describe("After deployment", async function () {
      it("User2 could join the bet", async function () {
        let result = await this.bet.join({
          from: user2,
          value: payableValue,
        });
        console.log("Join cost: ", result.receipt.gasUsed);
      });
      it("Anyone could timeout", async function () {
        await time.advanceBlockTo(
          toNumber(await time.latestBlock()) + 2 * blocks
        );
        console.log("Block number:", toNumber(await time.latestBlock()));

        let result = await this.bet.timeout({
          from: user1,
        });
        console.log("Timeout cost: ", result.receipt.gasUsed);
      });
    });
  });
});
