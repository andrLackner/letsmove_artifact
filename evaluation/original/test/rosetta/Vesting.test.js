const BasicCoin = artifacts.require("BasicCoin");
const Vesting = artifacts.require("Vesting");
const fs = require("node:fs");

contract("Vesting", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({
      from: deployer,
    });

    this.vesting = await Vesting.new({ from: deployer });

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
      let result = await this.vesting.init(
        user1,
        this.basicCoin.address,
        0,
        1000,
        1000,
        { from: deployer }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `vesting;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should be able to release", async function () {
      let result = await this.vesting.release({
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `vesting;release;${result.receipt.gasUsed}\n`
      );
    });
  });
});
