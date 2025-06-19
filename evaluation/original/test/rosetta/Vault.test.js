const { time } = require("@openzeppelin/test-helpers");

const BasicCoin = artifacts.require("BasicCoin");
const Vault = artifacts.require("Vault");

contract("Vault", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({
      from: deployer,
    });

    this.vault = await Vault.new({ from: deployer });

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
      let result = await this.vault.init(user1, 1000, this.basicCoin.address, {
        from: deployer,
      });
      console.log("Init cost: ", result.receipt.gasUsed);
    });

    it("deployer should be able to deposit", async function () {
      let result = await this.vault.deposit(300, {
        from: deployer,
      });
      console.log("Deposit cost: ", result.receipt.gasUsed);
    });
    it("deployer should be able to withdraw", async function () {
      let result = await this.vault.withdraw(100, user1, {
        from: deployer,
      });
      console.log("Withdraw cost: ", result.receipt.gasUsed);
    });
    it("deployer should be able to finalize", async function () {
      // increase time
      await time.increase(1000);
      let result = await this.vault.finalize({
        from: deployer,
      });
      console.log("Finalize cost: ", result.receipt.gasUsed);
    });
    it("deployer should be able to withdraw", async function () {
      let result = await this.vault.withdraw(100, user1, {
        from: deployer,
      });
      console.log("Withdraw cost: ", result.receipt.gasUsed);
    });
    it("deployer should be able to cancel", async function () {
      let result = await this.vault.cancel(user1, {
        from: deployer,
      });
      console.log("Cancel cost: ", result.receipt.gasUsed);
    });
  });
});
