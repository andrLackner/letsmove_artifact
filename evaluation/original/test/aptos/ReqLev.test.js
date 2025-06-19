const ReqLevOriginal = artifacts.require("req_lev");
const fs = require("node:fs");

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
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `req_lev;create;${result.receipt.gasUsed}\n`
      );
    });
  });
});
