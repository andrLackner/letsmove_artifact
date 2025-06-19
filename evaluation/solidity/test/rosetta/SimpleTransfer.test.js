const SimpleTransfer = artifacts.require("SimpleTransfer");

contract("SimpleTransfer", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.simpleTransfer = await SimpleTransfer.new(user2, {
      from: user1,
    });
  });

  describe("After deployment", async function () {
    it("User1 could deposit", async function () {
      let result = await this.simpleTransfer.deposit({
        from: user1,
        value: 1000,
      });
      console.log("Deposit cost: ", result.receipt.gasUsed);
    });
    it("User2 could withdraw", async function () {
      let result = await this.simpleTransfer.withdraw(100, {
        from: user2,
      });
      console.log("Withdraw cost: ", result.receipt.gasUsed);
    });
  });
});
