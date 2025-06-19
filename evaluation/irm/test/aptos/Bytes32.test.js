const { ethers } = require("ethers");
const fs = require("node:fs");

const Bytes32 = artifacts.require("bytes32");
const Bytes32Test = artifacts.require("Bytes32Test");

contract("bytes32", function (accounts) {
  const [deployer, user1, user2] = accounts;

  let Bytes32ABI = ["function protectionLayer(address to, bytes cb)"];

  let Bytes32TestABI = [
    "function zeroBytes32Test(address signer)",
    "function ffBytes32Test(address signer)",
    "function isZeroTest(address signer)",
    "function toBytes32Test(address signer)",
    "function fromBytes32Test(address signer)",
    "function fromAddressTest(address signer)",
  ];

  let bytes32Interface = new ethers.utils.Interface(Bytes32ABI);
  let Bytes32TestInterface = new ethers.utils.Interface(Bytes32TestABI);

  before(async function () {
    this.bytes32 = await Bytes32.new({ from: deployer });
    this.bytes32Test = await Bytes32Test.new(this.bytes32.address, {
      from: deployer,
    });
  });

  describe("bytes32", function () {
    it("should call zeroBytes32Test", async function () {
      let zeroBytes32Encoding = Bytes32TestInterface.encodeFunctionData(
        "zeroBytes32Test",
        [user1]
      );
      let result = await this.bytes32.protectionLayer(
        this.bytes32Test.address,
        zeroBytes32Encoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;zeroBytes32;${result.receipt.gasUsed}\n`
      );
    });

    it("should call ffBytes32Test", async function () {
      let ffBytes32Encoding = Bytes32TestInterface.encodeFunctionData(
        "ffBytes32Test",
        [user1]
      );
      let result = await this.bytes32.protectionLayer(
        this.bytes32Test.address,
        ffBytes32Encoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;ffBytes32;${result.receipt.gasUsed}\n`
      );
    });
    it("should call isZeroTest", async function () {
      let isZeroEncoding = Bytes32TestInterface.encodeFunctionData(
        "isZeroTest",
        [user1]
      );
      let result = await this.bytes32.protectionLayer(
        this.bytes32Test.address,
        isZeroEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;isZero;${result.receipt.gasUsed}\n`
      );
    });
    it("should call tobytes32Test", async function () {
      let tobytes32Encoding = Bytes32TestInterface.encodeFunctionData(
        "toBytes32Test",
        [user1]
      );
      let result = await this.bytes32.protectionLayer(
        this.bytes32Test.address,
        tobytes32Encoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;toBytes32;${result.receipt.gasUsed}\n`
      );
    });
    it("should call frombytes32Test", async function () {
      let frombytes32Encoding = Bytes32TestInterface.encodeFunctionData(
        "fromBytes32Test",
        [user1]
      );
      let result = await this.bytes32.protectionLayer(
        this.bytes32Test.address,
        frombytes32Encoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `bytes32;fromBytes32;${result.receipt.gasUsed}\n`
      );
    });
  });
});
