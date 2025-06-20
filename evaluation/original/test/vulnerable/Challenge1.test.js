const BasicCoin = artifacts.require("BasicCoin");
const Challenge1 = artifacts.require("Challenge1");

contract("Challenge1", function (accounts) {
  const [deployer, user1, user2] = accounts;

  beforeEach(async function () {
    this.basicCoin = await BasicCoin.new({ from: deployer });
    this.challenge1 = await Challenge1.new(this.basicCoin.address, {
      from: deployer,
    });

    await this.challenge1.register();

    await this.basicCoin.mintTo("10000", this.challenge1.address, {
      from: deployer,
    });
  });

  describe("when everything is set up", function () {
    it("should allow to drop resource", async function () {
      await this.challenge1.dropResource();
    });
  });
});
