const AliensEvents = artifacts.require("aliens_events");
const fs = require("node:fs");

contract("aliens_events", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.aliensEvents = await AliensEvents.new({ from: deployer });
  });
  describe("AliensEventsOrginal", function () {
    it("should call newWithdrawEvent", async function () {
      let result = await this.aliensEvents.newWithdrawEvent(
        this.aliensEvents.address,
        0,
        0,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `alien_events;new_withdraw_event;${result.receipt.gasUsed}\n`
      );
    });
    it("should call newSetReferrerEvent", async function () {
      let result = await this.aliensEvents.newSetReferrerEvent(
        "ciao",
        this.aliensEvents.address,
        0,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `alien_events;set_ref;${result.receipt.gasUsed}\n`
      );
    });
    it("should call newSetMintPriceEvent", async function () {
      let result = await this.aliensEvents.newSetMintPriceEvent(0, 0, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `alien_events;set_mint_price;${result.receipt.gasUsed}\n`
      );
    });
  });
});
