const BasicCoin = artifacts.require("BasicCoin");
const TokenTransfer = artifacts.require("TokenTransfer");
const fs = require("node:fs");

contract("TokenTransfer", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({
      from: deployer,
    });
    this.tokenTransfer = await TokenTransfer.new({
      from: deployer,
    });

    // register the deployer
    await this.basicCoin.register({ from: deployer });
    // Mint to deployer
    await this.basicCoin.mintTo(2000, deployer, { from: deployer });

    // Register user1
    await this.basicCoin.register({ from: user1 });
    // Mint to user 1
    await this.basicCoin.mintTo(2000, user1, { from: deployer });

    // Register user2
    await this.basicCoin.register({ from: user2 });
    // Mint to user 2
    await this.basicCoin.mintTo(2000, user2, { from: deployer });
  });
  describe("when everyting is set up", function () {
    before(async function () {
      let result = await this.tokenTransfer.init(
        this.basicCoin.address,
        user1,
        { from: deployer }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `token_transfer;init;${result.receipt.gasUsed}\n`
      );
    });

    it("deployer should be able to deposit", async function () {
      let result = await this.tokenTransfer.deposit(100, {
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `token_transfer;deposit;${result.receipt.gasUsed}\n`
      );
    });

    it("user 1 should be able to withdraw", async function () {
      let result = await this.tokenTransfer.withdraw(deployer, 100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `token_transfer;withdraw;${result.receipt.gasUsed}\n`
      );
    });
  });
});
