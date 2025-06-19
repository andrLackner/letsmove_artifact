const Uq64x64Original = artifacts.require("uq64x64");
const fs = require("node:fs");

contract("uq64x64", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.uq64x64 = await Uq64x64Original.new({ from: deployer });
  });

  describe("uq64x64", function () {
    it("should call encode", async function () {
      let result = await this.uq64x64.encode(47, { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;encode;${result.receipt.gasUsed}\n`
      );
    });

    it("should call decode", async function () {
      let result = await this.uq64x64.decode([47], { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;decode;${result.receipt.gasUsed}\n`
      );
    });

    it("should call toU128", async function () {
      let result = await this.uq64x64.toU128([47], { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;toU128;${result.receipt.gasUsed}\n`
      );
    });
    it("should call mul", async function () {
      let result = await this.uq64x64.mul([47], 3, { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;mul;${result.receipt.gasUsed}\n`
      );
    });
    it("should call div", async function () {
      let result = await this.uq64x64.div([47], 3, { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;div;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fraction", async function () {
      let result = await this.uq64x64.fraction(47, 3, { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;fraction;${result.receipt.gasUsed}\n`
      );
    });
    it("should call compare", async function () {
      let result = await this.uq64x64.compare([47], [47], {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;compare;${result.receipt.gasUsed}\n`
      );
    });
    it("should call isZero", async function () {
      let result = await this.uq64x64.isZero([1], { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `uq64x64;isZero;${result.receipt.gasUsed}\n`
      );
    });
  });
});
