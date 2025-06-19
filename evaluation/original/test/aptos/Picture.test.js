const Picture = artifacts.require("Module_Domain_IV_Picture");
const fs = require("node:fs");

contract("Module_Domain_IV_Picture", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.picture = await Picture.new({
      from: deployer,
    });
  });

  describe("Module_Domain_IV_Picture", function () {
    it("should vectorize", async function () {
      let result = await this.picture.vectorize("44", { from: user1 });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `picture;vectorize;${result.receipt.gasUsed}\n`
      );
    });
    it("should theoreticalD1Values", async function () {
      let result = await this.picture.theoreticalD1Values(5, 2, 3, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `picture;theoreticalD1values;${result.receipt.gasUsed}\n`
      );
    });
    it("should distance", async function () {
      let result = await this.picture.distance(3, 4, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `picture;distance;${result.receipt.gasUsed}\n`
      );
    });
    it("should circlesIntersect", async function () {
      let result = await this.picture.circlesIntersect(3, 7, 19, 1, 4, 6, {
        from: user1,
      });
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `picture;circle_int;${result.receipt.gasUsed}\n`
      );
    });
  });
});
