const { time } = require("@openzeppelin/test-helpers");

const Vesting = artifacts.require("Vesting");

contract("Vesting", async function (accounts) {
  const [deployer, user1, user2] = accounts;
  describe("Vesting execution", async function () {
    before(async function () {
      let now = await time.latest();
      let duration = 10000;
      this.vesting = await Vesting.new(user1, now, duration, {
        from: deployer,
      });
    });
    describe("After deployment", async function () {
      it("Anyone could release", async function () {
        let result = await this.vesting.release({
          from: user1,
        });
        console.log("Release cost: ", result.receipt.gasUsed);
      });
    });
  });
});
