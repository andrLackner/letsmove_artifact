const ImperfectLockerOriginal = artifacts.require("imperfect_locker");
const fs = require("node:fs");
contract("imperfect_locker", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.locker = await ImperfectLockerOriginal.new({ from: deployer });
  });

  describe("imperfect_locker", function () {
    it("should initialize pool", async function () {
      let result = await this.locker.initializePool(100, 100, 100, 100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `imp_locker;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should update pool", async function () {
      let result = await this.locker.updatePool(100, 100, 100, 100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `imp_locker;update;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate impermanent loss", async function () {
      let result = await this.locker.calculateImpermanentLoss(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `imp_locker;calculate;${result.receipt.gasUsed}\n`
      );
    });
  });
});
