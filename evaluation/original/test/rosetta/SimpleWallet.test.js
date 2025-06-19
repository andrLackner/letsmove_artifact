const BasicCoin = artifacts.require("BasicCoin");
const SimpleWallet = artifacts.require("SimpleWallet");
const fs = require("node:fs");
contract("SimpleWallet", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({
      from: deployer,
    });
    this.simpleWallet = await SimpleWallet.new({ from: deployer });

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
      let result = await this.simpleWallet.initialize(this.basicCoin.address, {
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;init;${result.receipt.gasUsed}\n`
      );
    });

    it("user 1 should be able to deposit", async function () {
      let result = await this.simpleWallet.deposit(deployer, 100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;deposit;${result.receipt.gasUsed}\n`
      );
    });
    it("deployer should be able to withdraw", async function () {
      let result = await this.simpleWallet.withdraw({
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;withdraw;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to deposit", async function () {
      let result = await this.simpleWallet.deposit(deployer, 100, {
        from: user2,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;deposit;${result.receipt.gasUsed}\n`
      );
    });
    it("deployer should be able to create a transaction", async function () {
      let result = await this.simpleWallet.createTransaction(
        user1,
        100,
        "ciao",
        { from: deployer }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;create_tx;${result.receipt.gasUsed}\n`
      );
    });
    it("deployer should be able to execute a transaction", async function () {
      let result = await this.simpleWallet.executeTransaction(0, {
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;execute_tx;${result.receipt.gasUsed}\n`
      );
    });
  });
});
