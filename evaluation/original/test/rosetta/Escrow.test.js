const BasicCoin = artifacts.require("BasicCoin");
const Escrow = artifacts.require("Escrow");
const fs = require("node:fs");

contract("Escrow", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({
      from: deployer,
    });

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
    beforeEach(async function () {
      this.escrow = await Escrow.new(this.basicCoin.address, user1, 100, {
        from: deployer,
      });

      let result = await this.escrow.deposit(100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `escrow;deposit;${result.receipt.gasUsed}\n`
      );
    });
    it("user 1 should be able to pay", async function () {
      let result = await this.escrow.pay({ from: user1 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `escrow;pay;${result.receipt.gasUsed}\n`
      );
    });
    it("seller should be able to refund", async function () {
      let result = await this.escrow.refund({ from: deployer });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `escrow;refund;${result.receipt.gasUsed}\n`
      );
    });
  });
});
