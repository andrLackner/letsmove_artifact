const { ethers } = require("ethers");
const { artifacts } = require("hardhat");
const fs = require("node:fs");

const AliensEvents = artifacts.require("aliens_events");
const AliensEventsTest = artifacts.require("AliensEventsTest");

contract("aliens_events", function (accounts) {
  const [deployer, user1] = accounts;
  let AliensEventsABI = ["function protectionLayer(address to, bytes cb)"];
  let AliensEventsTestABI = [
    "function newWithdrawEventTest(address signer)",
    "function newSetReferrerEventTest(address signer)",
    "function newSetMintPriceEventTest(address signer)",
  ];

  new ethers.utils.Interface(AliensEventsABI);
  let aliensEventsTestInterface = new ethers.utils.Interface(
    AliensEventsTestABI
  );

  before(async function () {
    this.aliensEvents = await AliensEvents.new({ from: deployer });
    this.aliensEventsTest = await AliensEventsTest.new(
      this.aliensEvents.address,
      {
        from: deployer,
      }
    );
  });
  describe("aliens_events", function () {
    it("should call newWithdrawEvent", async function () {
      let newWithdrawEventEncoding =
        aliensEventsTestInterface.encodeFunctionData("newWithdrawEventTest", [
          user1,
        ]);
      let result = await this.aliensEvents.protectionLayer(
        this.aliensEventsTest.address,
        newWithdrawEventEncoding,
        { from: user1 }
      );

      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `alien_events;new_withdraw_event;${result.receipt.gasUsed}\n`
      );
    });
    it("should call newSetReferrerEvent", async function () {
      let newSetReferrerEventEncoding =
        aliensEventsTestInterface.encodeFunctionData(
          "newSetReferrerEventTest",
          [user1]
        );
      let result = await this.aliensEvents.protectionLayer(
        this.aliensEventsTest.address,
        newSetReferrerEventEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `alien_events;set_ref;${result.receipt.gasUsed}\n`
      );
    });
    it("should call newSetMintPriceEvent", async function () {
      let newSetMintPriceEventEncoding =
        aliensEventsTestInterface.encodeFunctionData(
          "newSetMintPriceEventTest",
          [user1]
        );
      let result = await this.aliensEvents.protectionLayer(
        this.aliensEventsTest.address,
        newSetMintPriceEventEncoding,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `alien_events;mint_price_event;${result.receipt.gasUsed}\n`
      );
    });
  });
});
