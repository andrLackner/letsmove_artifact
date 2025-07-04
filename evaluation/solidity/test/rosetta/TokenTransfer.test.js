const TokenTransfer = artifacts.require("TokenTransfer");
const ERC20Token = artifacts.require("ERC20Mock");
const fs = require("node:fs");
contract("TokenTransfer", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.erc20Token = await ERC20Token.new("Test Token", "TT", deployer, 2000, {
      from: deployer,
    });
    this.tokenTransfer = await TokenTransfer.new(
      user2,
      this.erc20Token.address,
      { from: user1 }
    );
    await this.erc20Token.mint(user1, 1000, { from: deployer });
    await this.erc20Token.approveInternal(
      user1,
      this.tokenTransfer.address,
      1000,
      { from: deployer }
    );
    fs.appendFileSync("./results/rosetta_gas.csv", `token_transfer;init;0\n`);
  });
  describe("After deployment", async function () {
    it("User1 could deposit", async function () {
      let result = await this.tokenTransfer.deposit(100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `token_transfer;deposit;${result.receipt.gasUsed}\n`
      );
    });
    it("User2 could withdraw", async function () {
      let result = await this.tokenTransfer.withdraw(100, {
        from: user2,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `token_transfer;withdraw;${result.receipt.gasUsed}\n`
      );
    });
  });
});
