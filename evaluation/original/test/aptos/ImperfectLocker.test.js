const ImperfectLockerOriginal = artifacts.require("imperfect_locker");

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
      console.log("Initialize pool cost: ", result.receipt.gasUsed);
    });
    it("should update pool", async function () {
      let result = await this.locker.updatePool(100, 100, 100, 100, {
        from: user1,
      });
      console.log("Update pool cost: ", result.receipt.gasUsed);
    });
    it("should calculate impermanent loss", async function () {
      let result = await this.locker.calculateImpermanentLoss(user1, {
        from: user1,
      });
      console.log("Calculate impermanent loss cost: ", result.receipt.gasUsed);
    });
  });
});
