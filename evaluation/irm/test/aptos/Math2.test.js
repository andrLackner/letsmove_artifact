const Math2 = artifacts.require("math2");
const fs = require("node:fs");

contract("math2", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.math = await Math2.new({ from: deployer });
  });

  describe("math2", function () {
    it("should call sqrt", async function () {
      let result = await this.math.sqrt(4607431768211455, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math2;sqrt;${result.receipt.gasUsed}\n`
      );
    });
    it("should call min", async function () {
      let result = await this.math.min(4607431768211455, 4607431768211455, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math2;min;${result.receipt.gasUsed}\n`
      );
    });
    it("should call maxU64", async function () {
      let result = await this.math.maxU64(4607431768211455, 4607431768211455, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math2;maxU64;${result.receipt.gasUsed}\n`
      );
    });
    it("should call max", async function () {
      let result = await this.math.max(4607431768211455, 4607431768211455, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math2;max;${result.receipt.gasUsed}\n`
      );
    });
    it("should call pow", async function () {
      let result = await this.math.pow(80, 3, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math2;pow;${result.receipt.gasUsed}\n`
      );
    });
  });
});
