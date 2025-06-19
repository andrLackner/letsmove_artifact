const NavOriginal = artifacts.require("nav");
const fs = require("node:fs");

contract("nav", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.aliensEvents = await NavOriginal.new({ from: deployer });
  });
  describe("NavOriginal", function () {
    it("should call initNav", async function () {
      let result = await this.aliensEvents.initNav({
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `nav;init;${result.receipt.gasUsed}\n`
      );
    });
    it("should call updateAssetValue", async function () {
      let result = await this.aliensEvents.updateAssetValue(1000, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `nav;updateAssetVal;${result.receipt.gasUsed}\n`
      );
    });
    it("should call updateTokenSupply", async function () {
      let result = await this.aliensEvents.updateTokenSupply(1000, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `nav;updateTokenSupply;${result.receipt.gasUsed}\n`
      );
    });
    it("should call calculateNav", async function () {
      let result = await this.aliensEvents.calculateNav({
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `nav;calculate;${result.receipt.gasUsed}\n`
      );
    });
  });
});
