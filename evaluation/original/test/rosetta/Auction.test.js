const { expectRevert } = require("@openzeppelin/test-helpers");
const Auction = artifacts.require("Auction");
const BasicCoin = artifacts.require("BasicCoin");
const fs = require("node:fs");

contract("Auction", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });

    this.auction = await Auction.new({ from: deployer });

    // register the deployer
    await this.basicCoin.register({ from: deployer });

    // Register user1
    await this.basicCoin.register({ from: user1 });
    // Mint to user 1
    await this.basicCoin.mintTo(200, user1, { from: deployer });

    // Register user2
    await this.basicCoin.register({ from: user2 });

    // Mint to user 2
    await this.basicCoin.mintTo(200, user2, { from: deployer });

    // Start auction
    let result = await this.auction.start(this.basicCoin.address, 0, {
      from: deployer,
    });
    fs.appendFileSync(
      "./results/rosetta_gas.csv",
      `auction;start;${result.receipt.gasUsed}\n`
    );
  });
  describe("when everyting is set up", function () {
    it("user 1 should be able to bid", async function () {
      let result = await this.auction.bid(10, { from: user1 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;bid;${result.receipt.gasUsed}\n`
      );
    });
    it("user 2 should be able to bid", async function () {
      let result = await this.auction.bid(11, { from: user2 });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;bid;${result.receipt.gasUsed}\n`
      );
    });
    it("auctioneer should be able to end the auction", async function () {
      let result = await this.auction.end({ from: deployer });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;end;${result.receipt.gasUsed}\n`
      );
    });
    describe("after the auction is ended", function () {
      it("user 1 should not be able to bid", async function () {
        await expectRevert(
          this.auction.bid(12, { from: user1 }),
          "0xffffffffffffffff"
        );
      });
    });
  });
});
