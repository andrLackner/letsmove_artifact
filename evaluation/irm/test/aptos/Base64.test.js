const Base64 = artifacts.require("base64");
const fs = require("node:fs");

contract("base64", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.base64 = await Base64.new({ from: deployer });
  });

  describe("base64", function () {
    it("should call encode", async function () {
      let result = await this.base64.encode("Hello World", {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `base64;encode;${result.receipt.gasUsed}\n`
      );
    });
    it("should call decode", async function () {
      let result = await this.base64.decode("SGVsbG8gV29ybGQ=", {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `base64;decode;${result.receipt.gasUsed}\n`
      );
    });
  });
});
