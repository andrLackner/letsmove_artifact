const { ethers } = require("ethers");
const fs = require("node:fs");

const I64 = artifacts.require("i64");
const I64Test = artifacts.require("I64Test");

contract("i64", function (accounts) {
  const [deployer, user1] = accounts;

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
    this.i64 = await I64.new({ from: deployer });
    this.i64Test = await I64Test.new(this.i64.address, {
      from: deployer,
    });
  });

  describe("i64", function () {
    it("should call zeroTest", async function () {
      let zeroTestEncoding = I64TestInterface.encodeFunctionData("zeroTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        zeroTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;zeroTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fromU64Test", async function () {
      let fromU64TestEncoding = I64TestInterface.encodeFunctionData(
        "fromU64Test",
        [user1]
      );
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        fromU64TestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;fromU64;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fromTest", async function () {
      let fromTestEncoding = I64TestInterface.encodeFunctionData("fromTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        fromTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;fromTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call fromNegTest", async function () {
      let fromNegTestEncoding = I64TestInterface.encodeFunctionData(
        "fromNegTest",
        [user1]
      );
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        fromNegTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;fromNegTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call wrappingAddTest", async function () {
      let wrappingAddTestEncoding = I64TestInterface.encodeFunctionData(
        "wrappingAddTest",
        [user1]
      );
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        wrappingAddTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;wrappingAdd;${result.receipt.gasUsed}\n`
      );
    });
    it("should call addTest", async function () {
      let addTestEncoding = I64TestInterface.encodeFunctionData("addTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        addTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;add;${result.receipt.gasUsed}\n`
      );
    });
    it("should call wrappingSubTest", async function () {
      let wrappingSubTestEncoding = I64TestInterface.encodeFunctionData(
        "wrappingSubTest",
        [user1]
      );
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        wrappingSubTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;wrappingSub;${result.receipt.gasUsed}\n`
      );
    });
    it("should call subTest", async function () {
      let subTestEncoding = I64TestInterface.encodeFunctionData("subTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        subTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;sub;${result.receipt.gasUsed}\n`
      );
    });
    it("should call mulTest", async function () {
      let mulTestEncoding = I64TestInterface.encodeFunctionData("mulTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        mulTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;mul;${result.receipt.gasUsed}\n`
      );
    });
    it("should call divTest", async function () {
      let divTestEncoding = I64TestInterface.encodeFunctionData("divTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        divTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;div;${result.receipt.gasUsed}\n`
      );
    });
    it("should call absTest", async function () {
      let absTestEncoding = I64TestInterface.encodeFunctionData("absTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        absTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;absTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call absU64Test", async function () {
      let absU64TestEncoding = I64TestInterface.encodeFunctionData(
        "absU64Test",
        [user1]
      );
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        absU64TestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;absU64Test;${result.receipt.gasUsed}\n`
      );
    });
    it("should call minTest", async function () {
      let minTestEncoding = I64TestInterface.encodeFunctionData("minTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        minTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;callMint;${result.receipt.gasUsed}\n`
      );
    });
    it("should call maxTest", async function () {
      let maxTestEncoding = I64TestInterface.encodeFunctionData("maxTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        maxTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;maxTest;${result.receipt.gasUsed}\n`
      );
    });
    it("should call powTest", async function () {
      let powTestEncoding = I64TestInterface.encodeFunctionData("powTest", [
        user1,
      ]);
      let result = await this.i64.protectionLayer(
        this.i64Test.address,
        powTestEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `i64;powTest;${result.receipt.gasUsed}\n`
      );
    });
  });
});
