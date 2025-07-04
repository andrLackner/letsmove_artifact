const { ethers } = require("ethers");
const fs = require("node:fs");

const ReqLev = artifacts.require("req_lev");

contract("req_lev", function (accounts) {
  const [deployer, user1, user2] = accounts;

  let ReqLevABI = [
    "function protectionLayer(address to, bytes cb)",
    "function createPerpMarket(string,string,string,uint8,uint8,uint64,uint64,uint64,uint64)",
  ];
  let aliensEventsInterface = new ethers.utils.Interface(ReqLevABI);

  before(async function () {
    this.reqLev = await ReqLev.new({ from: deployer });
  });

  describe("req_lev", function () {
    it("should call create prep market", async function () {
      // sig=b"createPerpMarket(string,string,string,uint8,uint8,uint64,uint64,uint64,uint64)"
      let createPerpMarketEncoding = aliensEventsInterface.encodeFunctionData(
        "createPerpMarket",
        ["ETH", "USDC", "ETH/USDC", 1, 1, 1000, 1000, 1000, 1000]
      );
      let result = await this.reqLev.protectionLayer(
        this.reqLev.address,
        createPerpMarketEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `req_lev;createPerpMarket;${result.receipt.gasUsed}\n`
      );
    });
  });
});
