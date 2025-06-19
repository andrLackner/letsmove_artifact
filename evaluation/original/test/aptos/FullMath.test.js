const FullMath = artifacts.require("full_math_u64");
const fs = require("node:fs");

contract("full_math_u64", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.math = await FullMath.new({ from: deployer });
  });

  describe("full_math_u64", function () {
    it("should calculate mulDivFloor", async function () {
      let result = await this.math.mulDivFloor(100, 200, 300, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `full_math;mulDivFloor;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate mulDivRound", async function () {
      let result = await this.math.mulDivRound(100, 200, 300, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `full_math;mulDivRound;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate mulDivCeil", async function () {
      let result = await this.math.mulDivCeil(100, 200, 300, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `full_math;mulDivCeil;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate mulShr", async function () {
      let result = await this.math.mulShr(100, 200, 8, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `full_math;mulShr;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate mulShl", async function () {
      let result = await this.math.mulShl(100, 200, 8, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `full_math;mulShl;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate fullMul", async function () {
      let result = await this.math.fullMul(100, 200, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `full_math;fullMul;${result.receipt.gasUsed}\n`
      );
    });
  });
});
