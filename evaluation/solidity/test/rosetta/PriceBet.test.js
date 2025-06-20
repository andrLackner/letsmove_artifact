const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");
const fs = require("node:fs");
const PriceBet = artifacts.require("PriceBet");
const ExchangeRate = artifacts.require("Exchange");

contract("PriceBet", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  describe("Win execution", async function () {
    before(async function () {
      let now = await time.latestBlock();
      let blocks = 100;
      let exchangeRate = 2;
      let payableValue = 1000;
      this.exchangeRate = await ExchangeRate.new();
      this.priceBet = await PriceBet.new(
        this.exchangeRate.address,
        toNumber(now) + blocks,
        exchangeRate,
        { from: deployer, value: payableValue }
      );
    });
    describe("After deployment", async function () {
      it("User1 could join", async function () {
        let result = await this.priceBet.join({
          from: user1,
          value: 1000,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `pricebet;join;${result.receipt.gasUsed}\n`
        );
      });
      it("User1 could win", async function () {
        let result = await this.priceBet.win({
          from: user1,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `pricebet;win;${result.receipt.gasUsed}\n`
        );
      });
    });
  });

  describe("Timeout execution", async function () {
    before(async function () {
      let now = await time.latestBlock();
      let blocks = 100;
      let exchangeRate = 2;
      let payableValue = 1000;
      this.exchangeRate = await ExchangeRate.new();
      this.priceBet = await PriceBet.new(
        this.exchangeRate.address,
        toNumber(now) + blocks,
        exchangeRate,
        { from: deployer, value: payableValue }
      );
    });
    describe("After deployment", async function () {
      it("User1 could join", async function () {
        let result = await this.priceBet.join({
          from: user1,
          value: 1000,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `pricebet;join;${result.receipt.gasUsed}\n`
        );
      });
      it("Anyone could timeout", async function () {
        // forward VM time
        let now = await time.latestBlock();
        await time.advanceBlockTo(toNumber(now) + 1000);
        let result = await this.priceBet.timeout({
          from: user1,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `pricebet;timeout;${result.receipt.gasUsed}\n`
        );
      });
    });
  });
});
