const Bytes32Original = artifacts.require("bytes32");
const Bytes32Test = artifacts.require("Bytes32Test");
const fs = require("node:fs");

contract("bytes32", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.bytes32 = await Bytes32Original.new({ from: deployer });
    this.bytes32Test = await Bytes32Test.new(this.bytes32.address, {
      from: deployer,
    });
  });

  describe("bytes32", function () {
    it("should call zeroBytes32Test", async function () {
      let result = await this.bytes32Test.zeroBytes32Test(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;zeroBytes32Test;${result.receipt.gasUsed}\n`
      );
    });

    it("should call ffBytes32Test", async function () {
      let result = await this.bytes32Test.ffBytes32Test(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;ffBytes32Test;${result.receipt.gasUsed}\n`
      );
    });
    it("should call isZeroTest", async function () {
      let result = await this.bytes32Test.isZeroTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;isZeroTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call tobytes32Test", async function () {
      let result = await this.bytes32Test.toBytes32Test(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;tobytes32Test;${result.receipt.gasUsed}\n`
      );
    });
    it("should call frombytes32Test", async function () {
      let result = await this.bytes32Test.fromBytes32Test(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;frombytes32Test;${result.receipt.gasUsed}\n`
      );
    });
  });
});
