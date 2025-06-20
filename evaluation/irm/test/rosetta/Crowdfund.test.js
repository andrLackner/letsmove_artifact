const { time } = require("@openzeppelin/test-helpers");
const { ethers } = require("ethers");
const { toNumber } = require("web3-utils");
const fs = require("node:fs");

const BasicCoin = artifacts.require("BasicCoin");
const BasicCoinTest = artifacts.require("BasicCoinTest");
const Crowdfund = artifacts.require("Crowdfund");

contract("Crowdfund", function (accounts) {
  const [deployer, user1, user2, reclaimer, receiver] = accounts;
  let BasicCoinABI = [
    "function protectionLayer(address to, bytes cb)",
    "function register()",
    "function transfer(address to, uint256 amount)",
    "function mintCapability()",
    "function hasMintCapability(address) returns (bool)",
  ];
  let BasicCoinTestABI = [
    "function register(address)",
    "function mintTo(address signer, uint256 amount, address to)",
    "function mint(address signer, uint256 amount)",
    "function withdraw(address signer, uint256 amount)",
    "function withdrawAndDeposit(address signer, uint256 amount, address to)",
  ];
  let CrowdfundABI = [
    "function create(address coinAddress, uint256 endDonate, uint64 goal, address receiver)",
    "function donate(address sender, uint256 amount)",
    "function withdraw(address owner)",
    "function reclaim(address sender)",
  ];
  let basicCoinTestInterface = new ethers.utils.Interface(BasicCoinTestABI);
  let crowdfundInterface = new ethers.utils.Interface(CrowdfundABI);

  before(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });
    this.basicCoinTest = await BasicCoinTest.new(this.basicCoin.address, {
      from: deployer,
    });
    this.crowdfund = await Crowdfund.new({ from: deployer });

    // register the deployer
    let registerEncoding = basicCoinTestInterface.encodeFunctionData(
      "register",
      [deployer]
    );
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      registerEncoding,
      { from: deployer }
    );

    // Register user1
    registerEncoding = basicCoinTestInterface.encodeFunctionData("register", [
      user1,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      registerEncoding,
      { from: user1 }
    );
    // Mint to user 1
    let mintToEncoding = basicCoinTestInterface.encodeFunctionData("mintTo", [
      deployer,
      2000,
      user1,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      mintToEncoding,
      { from: deployer }
    );

    // Register user2
    registerEncoding = basicCoinTestInterface.encodeFunctionData("register", [
      user2,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      registerEncoding,
      { from: user2 }
    );
    // Mint to user 2
    mintToEncoding = basicCoinTestInterface.encodeFunctionData("mintTo", [
      deployer,
      2000,
      user2,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      mintToEncoding,
      { from: deployer }
    );

    // Register reclaimer
    registerEncoding = basicCoinTestInterface.encodeFunctionData("register", [
      reclaimer,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      registerEncoding,
      { from: reclaimer }
    );
    // Mint to reclaimer
    mintToEncoding = basicCoinTestInterface.encodeFunctionData("mintTo", [
      deployer,
      2000,
      reclaimer,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      mintToEncoding,
      { from: deployer }
    );

    // Register receiver
    registerEncoding = basicCoinTestInterface.encodeFunctionData("register", [
      receiver,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      registerEncoding,
      { from: receiver }
    );
  });
  describe("when everyting is set up", function () {
    before(async function () {
      const timestamp = await time.latest();
      const endDonate = toNumber(timestamp) + 1000;

      let createEncoding = crowdfundInterface.encodeFunctionData("create", [
        this.basicCoin.address,
        endDonate,
        200,
        receiver,
      ]);
      let result = await this.basicCoin.protectionLayer(
        this.crowdfund.address,
        createEncoding,
        { from: deployer }
      );
    });
    it("user 1 should be able to donate", async function () {
      let donateEncoding = crowdfundInterface.encodeFunctionData("donate", [
        user1,
        100,
      ]);
      let result = await this.basicCoin.protectionLayer(
        this.crowdfund.address,
        donateEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;donate;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to donate", async function () {
      let donateEncoding = crowdfundInterface.encodeFunctionData("donate", [
        user2,
        200,
      ]);
      let result = await this.basicCoin.protectionLayer(
        this.crowdfund.address,
        donateEncoding,
        { from: user2 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;donate;${result.receipt.gasUsed}\n`
      );
    });
    it("reclaimer should be able to donate", async function () {
      let donateEncoding = crowdfundInterface.encodeFunctionData("donate", [
        reclaimer,
        300,
      ]);
      let result = await this.basicCoin.protectionLayer(
        this.crowdfund.address,
        donateEncoding,
        { from: reclaimer }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;donate;${result.receipt.gasUsed}\n`
      );
    });
    it("reclaimer should be able to reclaim", async function () {
      // increase time to end the donation
      await time.increase(2000);
      let reclaimEncoding = crowdfundInterface.encodeFunctionData("reclaim", [
        reclaimer,
      ]);
      let result = await this.basicCoin.protectionLayer(
        this.crowdfund.address,
        reclaimEncoding,
        { from: reclaimer }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;reclaim;${result.receipt.gasUsed}\n`
      );
    });
    it("receiver should be able to withdraw", async function () {
      // increase time to end the donation
      await time.increase(2000);
      let withdrawEncoding = crowdfundInterface.encodeFunctionData("withdraw", [
        receiver,
      ]);
      let result = await this.basicCoin.protectionLayer(
        this.crowdfund.address,
        withdrawEncoding,
        { from: receiver }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `crowdfund;withdraw;${result.receipt.gasUsed}\n`
      );
    });
  });
});
