const MultiAdmin = artifacts.require("MultiAdmin");
const fs = require("node:fs");

contract("MultiAdmin", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.multiAdmin = await MultiAdmin.new({ from: deployer });
  });

  describe("MultiAdmin", function () {
    it("should initialize", async function () {
      let result = await this.multiAdmin.initialize({
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `multi_admin;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should set admin", async function () {
      let result = await this.multiAdmin.setAdmin(user2, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `multi_admin;set_cost;${result.receipt.gasUsed}\n`
      );
    });
  });
});
