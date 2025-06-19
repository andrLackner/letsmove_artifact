const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");
const fs = require("node:fs");
const BasicCoin = artifacts.require("BasicCoin");
const Bet = artifacts.require("Bet");

contract("Bet", function (accounts) {
  const [deployer, user1, user2, oracle] = accounts;

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
  });
  describe("when everyting is set up", function () {
    before(async function () {
      const timestamp = await time.latest();
      const deadline = toNumber(timestamp) + 1000;
      this.bet = await Bet.new(
        user1,
        user2,
        oracle,
        10,
        deadline,
        this.basicCoin.address,
        { from: deployer }
      );
    });
    it("user 1 should be able to join", async function () {
      let result = await this.bet.join(10, { from: user1 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `bet;join;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to join", async function () {
      let result = await this.bet.join(10, { from: user2 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `bet;join;${result.receipt.gasUsed}\n`
      );
    });
    describe("after players have joined", function () {
      beforeEach(async function () {
        const timestamp = await time.latest();
        const deadline = toNumber(timestamp) + 1000;

        this.bet = await Bet.new(
          user1,
          user2,
          oracle,
          10,
          deadline,
          this.basicCoin.address,
          { from: deployer }
        );
        await this.bet.join(10, { from: user1 });
        await this.bet.join(10, { from: user2 });
      });

      it("oracle should be able to set winner", async function () {
        let result = await this.bet.win(user1, { from: oracle });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;win;${result.receipt.gasUsed}\n`
        );
      });
      it("after some time the bet should timeout", async function () {
        await time.increase(2000);
        let result = await this.bet.timeout({ from: oracle });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;timeout;${result.receipt.gasUsed}\n`
        );
      });
    });
  });
});
