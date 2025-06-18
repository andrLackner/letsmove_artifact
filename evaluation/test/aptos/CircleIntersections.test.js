const CircleIntersections = artifacts.require("Circle_Intersections_Module");

contract("Circle_Intersections_Module", function (accounts) {
  const [deployer, user1, user2] = accounts;

  before(async function () {
    this.circleIntersections = await CircleIntersections.new({
      from: deployer,
    });
  });

  describe("CircleIntersections", function () {
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
      console.log("Circle intersections cost: ", result.receipt.gasUsed);
    });
    it("should call circlesIntersectMonitor", async function () {
      let result = await this.circleIntersections.circlesIntersectMonitor();
      console.log(
        "Circle intersections monitor cost: ",
        result.receipt.gasUsed
      );
    });
  });
});
