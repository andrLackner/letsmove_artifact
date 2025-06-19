const { ethers } = require("ethers");
const fs = require("node:fs");

const ImperfectLocker = artifacts.require("imperfect_locker");

contract("imperfect_locker", function (accounts) {
  const [deployer, user1] = accounts;

  let LockerABI = [
    "function protectionLayer(address to, bytes cb)",
    "function initializePool(uint64,uint64,uint64,uint64)",
    "function updatePool(uint64,uint64,uint64,uint64)",
    "function calculateImpermanentLoss(address) returns (uint64)",
  ];
  let lockerInterface = new ethers.utils.Interface(LockerABI);

  before(async function () {
    this.locker = await ImperfectLocker.new({ from: deployer });
  });

  describe("imperfect_locker", function () {
    it("should initialize pool", async function () {
      let initializePoolEncoding = lockerInterface.encodeFunctionData(
        "initializePool",
        [100, 100, 100, 100]
      );
      let result = await this.locker.protectionLayer(
        this.locker.address,
        initializePoolEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `imperfect_locker;init_pool;${result.receipt.gasUsed}\n`
      );
    });
    it("should update pool", async function () {
      let updatePoolEncoding = lockerInterface.encodeFunctionData(
        "updatePool",
        [100, 100, 100, 100]
      );
      let result = await this.locker.protectionLayer(
        this.locker.address,
        updatePoolEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `imperfect_locker;update_pool;${result.receipt.gasUsed}\n`
      );
    });
    it("should calculate impermanent loss", async function () {
      let calculateImpermanentLossEncoding = lockerInterface.encodeFunctionData(
        "calculateImpermanentLoss",
        [user1]
      );
      let result = await this.locker.protectionLayer(
        this.locker.address,
        calculateImpermanentLossEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `imperfect_locker;calc;${result.receipt.gasUsed}\n`
      );
    });
  });
});
