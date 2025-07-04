const { time } = require("@openzeppelin/test-helpers");
const { ethers } = require("ethers");
const { toNumber } = require("web3-utils");
const fs = require("node:fs");

const BasicCoin = artifacts.require("BasicCoin");
const BasicCoinTest = artifacts.require("BasicCoinTest");
const Bet = artifacts.require("Bet");

contract("Bet", function (accounts) {
  const [deployer, user1, user2, oracle] = accounts;
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
  let BetABI = [
    "function join(address parteciapant, uint256 bet)",
    "function win(address oracle, address winner)",
    "function timeout()",
  ];
  let encoder = new ethers.utils.AbiCoder();
  let basicCoinInterface = new ethers.utils.Interface(BasicCoinABI);
  let basicCoinTestInterface = new ethers.utils.Interface(BasicCoinTestABI);
  let betInterface = new ethers.utils.Interface(BetABI);

  before(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });
    this.basicCoinTest = await BasicCoinTest.new(this.basicCoin.address, {
      from: deployer,
    });

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
  });
  describe("when everyting is set up", function () {
    before(async function () {
      const timestamp = await time.latest();
      const deadline = toNumber(timestamp) + 1000;
      this.bet = await Bet.new(
        user1,
        user2,
        oracle,
        10,
        deadline,
        this.basicCoin.address,
        { from: deployer }
      );
    });
    it("user 1 should be able to join", async function () {
      let joinEncoding = betInterface.encodeFunctionData("join", [user1, 10]);
      let result = await this.basicCoin.protectionLayer(
        this.bet.address,
        joinEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `bet;join;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to join", async function () {
      let joinEncoding = betInterface.encodeFunctionData("join", [user2, 10]);
      let result = await this.basicCoin.protectionLayer(
        this.bet.address,
        joinEncoding,
        { from: user2 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `bet;join;${result.receipt.gasUsed}\n`
      );
    });
    describe("after players have joined", function () {
      beforeEach(async function () {
        const timestamp = await time.latest();
        const deadline = toNumber(timestamp) + 1000;

        this.bet = await Bet.new(
          user1,
          user2,
          oracle,
          10,
          deadline,
          this.basicCoin.address,
          { from: deployer }
        );
        let joinEncoding = betInterface.encodeFunctionData("join", [user1, 10]);
        await this.basicCoin.protectionLayer(this.bet.address, joinEncoding, {
          from: user1,
        });
        joinEncoding = betInterface.encodeFunctionData("join", [user2, 10]);
        await this.basicCoin.protectionLayer(this.bet.address, joinEncoding, {
          from: user2,
        });
      });

      it("oracle should be able to set winner", async function () {
        let winEncoding = betInterface.encodeFunctionData("win", [
          oracle,
          user1,
        ]);
        let result = await this.basicCoin.protectionLayer(
          this.bet.address,
          winEncoding,
          { from: deployer }
        );
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;win;${result.receipt.gasUsed}\n`
        );
      });
      it("after some time the bet should timeout", async function () {
        await time.increase(2000);
        let timeoutEncoding = betInterface.encodeFunctionData("timeout", []);
        let result = await this.basicCoin.protectionLayer(
          this.bet.address,
          timeoutEncoding,
          { from: deployer }
        );
        fs.appendFileSync(
          "./results/rosetta_gas.csv",
          `bet;timeout;${result.receipt.gasUsed}\n`
        );
      });
    });
  });
});
