const CounterOriginal = artifacts.require("counter");
const fs = require("node:fs");

contract("counter", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.counter = await CounterOriginal.new({ from: deployer });
  });

  describe("counter", function () {
    it("should create counter", async function () {
      let result = await this.counter.createCounter({ from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `counter;create;${result.receipt.gasUsed}\n`
      );
    });
    it("should push counter", async function () {
      let result = await this.counter.pushCounter(100, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `counter;push;${result.receipt.gasUsed}\n`
      );
    });
    it("should create price", async function () {
      let result = await this.counter.createPrice({
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `counter;create_price;${result.receipt.gasUsed}\n`
      );
    });
    it("should push price", async function () {
      let result = await this.counter.pushPrice(100, 1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `counter;push_price;${result.receipt.gasUsed}\n`
      );
    });
  });
});
