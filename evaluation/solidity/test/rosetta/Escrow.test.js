const Escrow = artifacts.require("Escrow");
const fs = require("node:fs");
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
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `escrow;deposit;${result.receipt.gasUsed}\n`
        );
      });
      it("User1 could pay", async function () {
        let result = await this.escrow.pay({
          from: user1,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `escrow;pay;${result.receipt.gasUsed}\n`
        );
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
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `escrow;deposit;${result.receipt.gasUsed}\n`
        );
      });
      it("User2 could refund", async function () {
        let result = await this.escrow.refund({
          from: user2,
        });
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `escrow;refund;${result.receipt.gasUsed}\n`
        );
      });
    });
  });
});
