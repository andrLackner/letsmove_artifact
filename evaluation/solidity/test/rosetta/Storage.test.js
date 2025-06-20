const { ethers } = require("ethers");
const fs = require("node:fs");
const Storage = artifacts.require("Storage");

contract("Storage", async function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.storage = await Storage.new({ from: deployer });
  });
  describe("After deployment", async function () {
    it("User1 could store bytes", async function () {
      let result = await this.storage.storeBytes(
        ethers.utils.formatBytes32String("ciao"),
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `storage;storeBytes;${result.receipt.gasUsed}\n`
      );
    });
    it("User1 could store string", async function () {
      let result = await this.storage.storeString("ciao", {
        from: user1,
      });
      fs.appendFileSync(
        "./results/rosetta_gas.csv",
        `storage;storeString;${result.receipt.gasUsed}\n`
      );
    });
  });
});
