const SimpleWallet = artifacts.require("SimpleWallet");
const fs = require("node:fs");
contract("SimpleWallet", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.simpleWallet = await SimpleWallet.new(user1, {
      from: deployer,
    });
  });
  describe("After deployment", async function () {
    it("User2 could deposit", async function () {
      let result = await this.simpleWallet.deposit({
        from: user2,
        value: 1000,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;deposit;${result.receipt.gasUsed}\n`
      );
    });
    it("User1 could withdraw", async function () {
      let result = await this.simpleWallet.withdraw({
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;withdraw;${result.receipt.gasUsed}\n`
      );
    });
    it("User2 could deposit", async function () {
      let result = await this.simpleWallet.deposit({
        from: user2,
        value: 1000,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;deposit;${result.receipt.gasUsed}\n`
      );
    });
    it("User1 could create a transaction", async function () {
      let result = await this.simpleWallet.createTransaction(
        user2,
        100,
        "0x000000",
        {
          from: user1,
        }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;create_tx;${result.receipt.gasUsed}\n`
      );
    });
    it("User1 could execute a transaction", async function () {
      let result = await this.simpleWallet.executeTransaction(0, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `simple_wallet;execute_tx;${result.receipt.gasUsed}\n`
      );
    });
  });
});
