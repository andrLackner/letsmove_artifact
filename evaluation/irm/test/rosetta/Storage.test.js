const Storage = artifacts.require("Storage");
const fs = require("node:fs");

contract("Storage", function (accounts) {
  const [deployer] = accounts;

  before(async function () {
    this.storage = await Storage.new({ from: deployer });
  });
  it("should store bytes", async function () {
    const data = "0x1234567890abcdef";
    let result = await this.storage.storeBytes(data, { from: deployer });

    fs.appendFileSync(
      "./results/rosetta_gas.csv",
      `storage;storeBytes;${result.receipt.gasUsed}\n`
    );
  });
  it("should store string", async function () {
    const data = "Hello, world!";
    let result = await this.storage.storeString(data, { from: deployer });

    fs.appendFileSync(
      "./results/rosetta_gas.csv",
      `storage;storeString;${result.receipt.gasUsed}\n`
    );
  });
});
