const { time } = require("@openzeppelin/test-helpers");
const { toNumber } = require("web3-utils");

const BasicCoin = artifacts.require("BasicCoin");
const Pricebet = artifacts.require("Pricebet");
const Exchange = artifacts.require("Exchange");

contract("Pricebet", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.BasicCoin = await BasicCoin.new({
      from: deployer,
    });

    // register the deployer
    await this.BasicCoin.register({ from: deployer });
    // Mint to deployer
    await this.BasicCoin.mintTo(2000, deployer, { from: deployer });

    // Register user1
    await this.BasicCoin.register({ from: user1 });
    // Mint to user 1
    await this.BasicCoin.mintTo(2000, user1, { from: deployer });

    // Register user2
    await this.BasicCoin.register({ from: user2 });
    // Mint to user 2
    await this.BasicCoin.mintTo(2000, user2, { from: deployer });
  });
  describe("when everyting is set up", function () {
    beforeEach(async function () {
      this.exchange = await Exchange.new({ from: deployer });

      let blockNumber = await time.latestBlock();
      let deadline = toNumber(blockNumber) + 100;

      let exchangeRate = 2;

      this.pricebet = await Pricebet.new(
        this.BasicCoin.address,
        this.exchange.address,
        deadline,
        exchangeRate,
        1000,
        { from: deployer }
      );

      let result = await this.pricebet.join(1000, { from: user1 });
      // Cost of joining the bet
      console.log("Join cost: ", result.receipt.gasUsed);
    });
    it("user 1 should be able to win the bet", async function () {
      let result = await this.pricebet.win({ from: user1 });
      // Cost of winning the bet
      console.log("Win cost: ", result.receipt.gasUsed);
    });
    it("deployer should be able to timeout the bet", async function () {
      // Increase the block number to simulate the timeout
      await time.advanceBlockTo(toNumber(await time.latestBlock()) + 1000);

      let result = await this.pricebet.timeout({ from: deployer });
      // Cost of timing out the bet
      console.log("Timeout cost: ", result.receipt.gasUsed);
    });
  });
});
