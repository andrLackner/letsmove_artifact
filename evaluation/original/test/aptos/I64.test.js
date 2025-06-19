const { ethers } = require("ethers");
const fs = require("node:fs");
const I64Original = artifacts.require("i64");
const I64OriginalTest = artifacts.require("I64Test");

contract("i64", function (accounts) {
  const [deployer, user1, user2] = accounts;

  let I64ABI = ["function protectionLayer(address to, bytes cb)"];

  let I64TestABI = [
    "function zeroTest(address signer)",
    "function fromU64Test(address signer)",
    "function fromTest(address signer)",
    "function fromNegTest(address signer)",
    "function wrappingAddTest(address signer)",
    "function addTest(address signer)",
    "function wrappingSubTest(address signer)",
    "function subTest(address signer)",
    "function mulTest(address signer)",
    "function divTest(address signer)",
    "function absTest(address signer)",
    "function absU64Test(address signer)",
    "function minTest(address signer)",
    "function maxTest(address signer)",
    "function powTest(address signer)",
  ];

  let I64Interface = new ethers.utils.Interface(I64ABI);
  let I64TestInterface = new ethers.utils.Interface(I64TestABI);

  before(async function () {
    this.i64 = await I64Original.new({ from: deployer });
    this.i64Test = await I64OriginalTest.new(this.i64.address, {
      from: deployer,
    });
  });

  describe("i64", function () {
    it("should call zeroTest", async function () {
      let result = await this.i64Test.zeroTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;zeroTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fromU64Test", async function () {
      let result = await this.i64Test.fromU64Test(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;fromU64Test;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fromTest", async function () {
      let result = await this.i64Test.fromTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;fromTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fromNegTest", async function () {
      let result = await this.i64Test.fromNegTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;fromNegTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call wrappingAddTest", async function () {
      let result = await this.i64Test.wrappingAddTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;wrappingAddTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call addTest", async function () {
      let result = await this.i64Test.addTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;addTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call wrappingSubTest", async function () {
      let result = await this.i64Test.wrappingSubTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;wrappingSubTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call subTest", async function () {
      let result = await this.i64Test.subTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;subTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call mulTest", async function () {
      let result = await this.i64Test.mulTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;mulTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call divTest", async function () {
      let result = await this.i64Test.divTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;divTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call absTest", async function () {
      let result = await this.i64Test.absTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;absTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call absU64Test", async function () {
      let result = await this.i64Test.absU64Test(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;absU64Test;${result.receipt.gasUsed}\n`
      );
    });
    it("should call minTest", async function () {
      let result = await this.i64Test.minTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;minTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call maxTest", async function () {
      let result = await this.i64Test.maxTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;maxTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call powTest", async function () {
      let result = await this.i64Test.powTest(user1, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;powTest;${result.receipt.gasUsed}\n`
      );
    });
  });
});
