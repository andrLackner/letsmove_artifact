const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");
const fs = require("node:fs");
const Bet = artifacts.require("Bet");

contract("Bet", function (accounts) {
  const [deployer, user1, user2, oracle] = accounts;

  let payableValue = 1000;
  let blocks = 10;

  describe("Win execution", async function () {
    before(async function () {
      this.Bet = await Bet.new(oracle, user2, blocks, {
        from: user1,
        value: payableValue,
      });
    });
    describe("After deployment", async function () {
      it("User2 could join the bet", async function () {
        let result = await this.Bet.join({
          from: user2,
          value: payableValue,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;join;${result.receipt.gasUsed}\n`
        );
      });
      it("Oracle could decide the winner", async function () {
        let result = await this.Bet.win(1, {
          from: oracle,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;win;${result.receipt.gasUsed}\n`
        );
      });
    });
  });
  describe("Timeout execution", async function () {
    before(async function () {
      this.Bet = await Bet.new(oracle, user2, blocks, {
        from: user1,
        value: payableValue,
      });
    });

    describe("After deployment", async function () {
      it("User2 could join the bet", async function () {
        let result = await this.Bet.join({
          from: user2,
          value: payableValue,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;join;${result.receipt.gasUsed}\n`
        );
      });
      it("Anyone could timeout", async function () {
        await time.advanceBlockTo(
          toNumber(await time.latestBlock()) + 2 * blocks
        );
        console.log("Block number:", toNumber(await time.latestBlock()));

        let result = await this.Bet.timeout({
          from: user1,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;timeout;${result.receipt.gasUsed}\n`
        );
      });
    });
  });
});
