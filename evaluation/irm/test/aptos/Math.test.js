const Math = artifacts.require("math");
const fs = require("node:fs");

contract("math", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.math = await Math.new({ from: deployer });
  });

  describe("math", function () {
    it("should call overflowAdd", async function () {
      let result = await this.math.overflowAdd(
        4607431768211455,
        4607431768211455,
        {
          from: user1,
        }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;overflow_add;${result.receipt.gasUsed}\n`
      );
    });
    it("should call mulDiv", async function () {
      let result = await this.math.mulDiv(
        4607431768211455,
        4607431768211455,
        4607431768211455,
        {
          from: user1,
        }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;mul_div;${result.receipt.gasUsed}\n`
      );
    });
    it("should call mulDivU128", async function () {
      let result = await this.math.mulDivU128(
        4607431768211455,
        4607431768211455,
        4607431768211455,
        {
          from: user1,
        }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;mul_divu128;${result.receipt.gasUsed}\n`
      );
    });
    it("should call mulToU128", async function () {
      let result = await this.math.mulToU128(
        4607431768211455,
        4607431768211455,
        {
          from: user1,
        }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;mulTo_u128;${result.receipt.gasUsed}\n`
      );
    });
    it("should call sqrt", async function () {
      let result = await this.math.sqrt(4607431768211455, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;sqrt;${result.receipt.gasUsed}\n`
      );
    });
    it("should call pow10", async function () {
      let result = await this.math.pow10(8, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;pow10;${result.receipt.gasUsed}\n`
      );
    });
    it("should call minU64", async function () {
      let result = await this.math.minU64(4607431768211455, 4607431768211455, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `math;minU64;${result.receipt.gasUsed}\n`
      );
    });
  });
});
