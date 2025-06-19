const TokenOriginal = artifacts.require("Token");
const fs = require("node:fs");

contract("Token", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.token = await TokenOriginal.new({ from: deployer });
  });

  describe("Token", function () {
    it("should initialize", async function () {
      let result = await this.token.initialize({ from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should initialize", async function () {
      let result = await this.token.initialize({ from: user2 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should mint", async function () {
      let result = await this.token.mint(100, { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;mint;${result.receipt.gasUsed}\n`
      );
    });
    it("should transfer", async function () {
      let result = await this.token.transfer(user2, 50, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;transfer;${result.receipt.gasUsed}\n`
      );
    });
    it("should get balance", async function () {
      let result = await this.token.balanceOf(user2, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;balance;${result.receipt.gasUsed}\n`
      );
    });
  });
});
