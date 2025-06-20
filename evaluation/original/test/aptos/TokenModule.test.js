const TokenModuleOriginal = artifacts.require("TokenModule");
const fs = require("node:fs");

contract("TokenModule", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.tokenModule = await TokenModuleOriginal.new({ from: deployer });
  });

  describe("TokenModule", function () {
    it("should initialize balance", async function () {
      let result = await this.tokenModule.initializeBalance(1000, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token_mod;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should initialize balance with zero", async function () {
      let result = await this.tokenModule.initializeBalance(0, {
        from: user2,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token_mod;balance;${result.receipt.gasUsed}\n`
      );
    });
    it("should transfer tokens", async function () {
      let result = await this.tokenModule.transfer(user2, 100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token_mod;transfer;${result.receipt.gasUsed}\n`
      );
    });
    it("should get balance", async function () {
      let result = await this.tokenModule.getBalance(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token_mod;balance;${result.receipt.gasUsed}\n`
      );
    });
  });
});
