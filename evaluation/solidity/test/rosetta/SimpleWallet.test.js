const SimpleWallet = artifacts.require("SimpleWallet");

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
      console.log("Deposit cost: ", result.receipt.gasUsed);
    });
    it("User1 could withdraw", async function () {
      let result = await this.simpleWallet.withdraw({
        from: user1,
      });
      console.log("Withdraw cost: ", result.receipt.gasUsed);
    });
    it("User2 could deposit", async function () {
      let result = await this.simpleWallet.deposit({
        from: user2,
        value: 1000,
      });
      console.log("Deposit cost: ", result.receipt.gasUsed);
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
      console.log("Create transaction cost: ", result.receipt.gasUsed);
    });
    it("User1 could execute a transaction", async function () {
      let result = await this.simpleWallet.executeTransaction(0, {
        from: user1,
      });
      console.log("Approve transaction cost: ", result.receipt.gasUsed);
    });
  });
});
