const MultiAdmin = artifacts.require("MultiAdmin");

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
      console.log("Initialize cost: ", result.receipt.gasUsed);
    });
    it("should set admin", async function () {
      let result = await this.multiAdmin.setAdmin(user2, {
        from: user1,
      });
      console.log("Set admin cost: ", result.receipt.gasUsed);
    });
  });
});
