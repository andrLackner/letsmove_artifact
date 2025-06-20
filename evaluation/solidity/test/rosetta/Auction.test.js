const { time } = require("@openzeppelin/test-helpers");
const fs = require("node:fs");
const Auction = artifacts.require("Auction");

contract("Auction", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.auction = await Auction.new("Sold Object", 10, {
      from: deployer,
    });
  });
  describe("After deployment", function () {
    it("Seller could start the auction", async function () {
      let result = await this.auction.start(time.duration.days(1), {
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;start;${result.receipt.gasUsed}\n`
      );
    });
    it("User1 could bid", async function () {
      let result = await this.auction.bid({
        from: user1,
        value: 1000,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;bid;${result.receipt.gasUsed}\n`
      );
    });
    it("User2 could bid", async function () {
      let result = await this.auction.bid({
        from: user2,
        value: 2000,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;bid;${result.receipt.gasUsed}\n`
      );
    });
    it("User1 could bid again", async function () {
      let result = await this.auction.bid({
        from: user1,
        value: 3000,
      });
      // fs.appendFileSync(
      //   "./results/rosetta_gas.csv",
      //   `auction;bid;${result.receipt.gasUsed}\n`
      // );
    });
    it("User1 could withdraw", async function () {
      let result = await this.auction.withdraw({
        from: user1,
      });
      // fs.appendFileSync(
      //   "./results/rosetta_gas.csv",
      //   `auction;withdraw;${result.receipt.gasUsed}\n`
      // );
    });
    it("Seller could end the auction", async function () {
      // forward VM time
      await time.increase(time.duration.days(1));
      let result = await this.auction.end({
        from: deployer,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `auction;end;${result.receipt.gasUsed}\n`
      );
    });
  });
});
