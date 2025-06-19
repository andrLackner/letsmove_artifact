const { ethers } = require("ethers");
const fs = require("node:fs");
const Token = artifacts.require("Token");

contract("Token", function (accounts) {
  const [deployer, user1, user2] = accounts;

  let TokenABI = [
    "function protectionLayer(address to, bytes cb)",
    "function initialize()",
    "function mint(uint64)",
    "function transfer(address,uint64)",
    "function balanceOf(address) returns (uint64)",
  ];
  let tokenInterface = new ethers.utils.Interface(TokenABI);

  before(async function () {
    this.token = await Token.new({ from: deployer });
  });

  describe("Token", function () {
    it("should initialize", async function () {
      let initializeEncoding = tokenInterface.encodeFunctionData(
        "initialize",
        []
      );
      let result = await this.token.protectionLayer(
        this.token.address,
        initializeEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should initialize", async function () {
      let initializeEncoding = tokenInterface.encodeFunctionData(
        "initialize",
        []
      );
      let result = await this.token.protectionLayer(
        this.token.address,
        initializeEncoding,
        { from: user2 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should mint", async function () {
      let mintEncoding = tokenInterface.encodeFunctionData("mint", [100]);
      let result = await this.token.protectionLayer(
        this.token.address,
        mintEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;mint;${result.receipt.gasUsed}\n`
      );
    });
    it("should transfer", async function () {
      let transferEncoding = tokenInterface.encodeFunctionData("transfer", [
        user2,
        100,
      ]);
      let result = await this.token.protectionLayer(
        this.token.address,
        transferEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;transfer;${result.receipt.gasUsed}\n`
      );
    });
    it("should get balance", async function () {
      let result = await this.token.balanceOf(user2, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `token;balance;${result.receipt.gasUsed}\n`
      );
    });
  });
});
