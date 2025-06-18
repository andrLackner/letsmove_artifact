const ReqLevOriginal = artifacts.require("req_lev");

contract("req_lev", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.reqLev = await ReqLevOriginal.new({ from: deployer });
  });

  describe("req_lev", function () {
    it("should call create prep market", async function () {
      // sig=b"createPerpMarket(string,string,string,uint8,uint8,uint64,uint64,uint64,uint64)"
      let result = await this.reqLev.createPerpMarket(
        "ETH",
        "USDC",
        "ETH/USDC",
        1,
        1,
        1000,
        1000,
        1000,
        1000,
        { from: user1 }
      );
      console.log("Create perp market cost: ", result.receipt.gasUsed);
    });
  });
});
