const Escrow = artifacts.require("Escrow");

contract("Escrow", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  describe("Pay execution", async function () {
    let payableValue = 1000;

    before(async function () {
      this.escrow = await Escrow.new(payableValue, user1, user2, {
        from: user2,
      });
    });
    describe("After deployment", async function () {
      it("User1 could deposit", async function () {
        let result = await this.escrow.deposit({
          from: user1,
          value: payableValue,
        });
        console.log("Deposit cost: ", result.receipt.gasUsed);
      });
      it("User1 could pay", async function () {
        let result = await this.escrow.pay({
          from: user1,
        });
        console.log("Pay cost: ", result.receipt.gasUsed);
      });
    });
  });
  describe("Refund execution", async function () {
    let payableValue = 1000;
    before(async function () {
      this.escrow = await Escrow.new(payableValue, user1, user2, {
        from: user2,
      });
    });
    describe("After deployment", async function () {
      it("User1 could deposit", async function () {
        let result = await this.escrow.deposit({
          from: user1,
          value: payableValue,
        });
        console.log("Deposit cost: ", result.receipt.gasUsed);
      });
      it("User2 could refund", async function () {
        let result = await this.escrow.refund({
          from: user2,
        });
        console.log("Refund cost: ", result.receipt.gasUsed);
      });
    });
  });
});
