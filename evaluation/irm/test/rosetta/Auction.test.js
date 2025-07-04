const { expectRevert } = require("@openzeppelin/test-helpers");
const { ethers } = require("ethers");
const fs = require("node:fs");

const BasicCoin = artifacts.require("BasicCoin");
const BasicCoinTest = artifacts.require("BasicCoinTest");
const Auction = artifacts.require("Auction");

contract("Auction", function (accounts) {
  const [deployer, user1, user2] = accounts;
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
  let AuctionABI = [
    "function bid(address signer, uint256 amount)",
    "function start(address signer, address coinAddress, uint256 base)",
    "function end(address signer)",
  ];
  let encoder = new ethers.utils.AbiCoder();
  let basicCoinInterface = new ethers.utils.Interface(BasicCoinABI);
  let basicCoinTestInterface = new ethers.utils.Interface(BasicCoinTestABI);
  let auctionInterface = new ethers.utils.Interface(AuctionABI);

  before(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });
    this.basicCoinTest = await BasicCoinTest.new(this.basicCoin.address, {
      from: deployer,
    });
    this.auction = await Auction.new();

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
      20,
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
      20,
      user2,
    ]);
    await this.basicCoin.protectionLayer(
      this.basicCoinTest.address,
      mintToEncoding,
      { from: deployer }
    );

    // Start auction
    let startEncoding = auctionInterface.encodeFunctionData("start", [
      deployer,
      this.basicCoin.address,
      0,
    ]);

    let result = await this.basicCoin.protectionLayer(
      this.auction.address,
      startEncoding,
      { from: deployer }
    );
    fs.appendFileSync(
      "./results/rosetta_gas.csv",
      `auction;start;${result.receipt.gasUsed}\n`
    );
  });
  describe("when everyting is set up", function () {
    it("user 1 should be able to bid", async function () {
      let bidEncoding = auctionInterface.encodeFunctionData("bid", [user1, 10]);
      let result = await this.basicCoin.protectionLayer(
        this.auction.address,
        bidEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;bid;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to bid", async function () {
      let bidEncoding = auctionInterface.encodeFunctionData("bid", [user2, 11]);
      let result = await this.basicCoin.protectionLayer(
        this.auction.address,
        bidEncoding,
        { from: user2 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;bid;${result.receipt.gasUsed}\n`
      );
    });
    it("auctioneer should be able to end the auction", async function () {
      let endEncoding = auctionInterface.encodeFunctionData("end", [deployer]);
      let result = await this.basicCoin.protectionLayer(
        this.auction.address,
        endEncoding,
        { from: deployer }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;end;${result.receipt.gasUsed}\n`
      );
    });
  });
});
