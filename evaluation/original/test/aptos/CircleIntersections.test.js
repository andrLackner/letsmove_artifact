const CircleIntersections = artifacts.require("Circle_Intersections_Module");
const fs = require("node:fs");

contract("Circle_Intersections_Module", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.circleIntersections = await CircleIntersections.new({
      from: deployer,
    });
  });

  describe("Circle_Intersections_Module", function () {
    it("should call circlesIntersect", async function () {
      let result = await this.circleIntersections.circlesIntersect(
        0,
        0,
        1,
        1,
        2,
        2,
        { from: user1 }
      );
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `circle_int;intersect;${result.receipt.gasUsed}\n`
      );
    });
    it("should call circlesIntersectMonitor", async function () {
      let result = await this.circleIntersections.circlesIntersectMonitor();
      fs.appendFileSync(
        "./results/aptos_gas.csv",
        `circle_int;monitor;${result.receipt.gasUsed}\n`
      );
    });
  });
});
